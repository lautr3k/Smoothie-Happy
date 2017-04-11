/**
* Get informations about memory usage.
*
* ### on success
* ```
* return {
*   "BLOCK_SIZE"    : 100
*   "UNUSED_HEAP"   : 8344,
*   "USED_HEAP_SIZE": 18008,
*   "FREE"          : 2572,
*   "ALLOCATED"     : 14348,
*   "TOTAL_FREE_RAM": 10916,
*   "AHB0": {
*     "free"  : 13652,
*     "total" : 15184, // verbose mode only
*     "used"  : 1532,  // verbose mode only
*     "chunks": [      // verbose mode only
*        {
*         "address": "0x2007c4b0",
*         "offset": 0,
*         "bytes": 268,
*         "free": false
*        }
*     //, ...
*     ]
*   },
*   "AHB1": {
*     "free"  : 10440,
*     "total" : 10440, // verbose mode only
*     "used"  : 0      // verbose mode only
*     "chunks": [...]  // verbose mode only
*   },
*   "CHUNKS": [ // verbose mode only
*     {
*       "address": "0x10000CF8",
*       "bytes"  : 32,
*       "free"   : false
*     }
*     //, ...
*   ]
* }
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#578
*/
export function cmd_mem(raw, args) {
  // trim raw response
  raw = raw.trim()

  // verbose mode
  let verbose = args[0] === '-v'

  // // Split on new line
  let lines = raw.split(/[\r\n|\r|\n]+/gm)

  let memory = {}

  if (verbose) {
    memory.CHUNKS = []
  }

  let setValue = line => {
    let [key, value] = line.split(': ')

    let bytes = parseInt(value.trim().replace(/ bytes$/, ''))

    key = key.trim().replace(/ +/gm, '_').toUpperCase()

    if (key === 'FREE_AHB0') {
      key = 'AHB0'
    }

    if (key.startsWith('AHB')) {
      memory[key] = { free: bytes }
    }
    else {
      memory[key] = bytes
    }
  }

  let target = null

  lines.forEach(line => {
    line = line.trim()

    if (line.startsWith('Allocated') || line.startsWith('Free AHB0')) {
      line = line.split(', ')
      setValue(line[1])
      line = line[0]
    }

    if (verbose && line.startsWith('Chunk:')) {
      // ["Chunk: 7", "Address: 0x10001028", "Size: 20", ""]
      let chunk = line.split('  ')

      memory.CHUNKS.push({
        address: chunk[1].split(': ')[1],
        bytes  : parseInt(chunk[2].split(': ')[1]),
        free   : chunk[3] !== undefined
      })
    }
    else if (verbose && line.startsWith('Start:')) {
      target = memory['AHB' + (target === null ? '0' : '1')]
      target.chunks = []
    }
    else if (verbose && line.startsWith('Chunk at')) {
      // "Chunk at 0x2007c8a8 (+1016): used, 516 bytes"
      // "Chunk at 0x2007caac (+1532): free, 13652 bytes"
      let chunk = line.match(/^Chunk at ([0-9a-zA-Z]+) \( *\+([0-9]+)\): (free|used), ([0-9]+) bytes$/)

      target.chunks.push({
        address: chunk[1],
        offset : parseInt(chunk[2]),
        bytes  : parseInt(chunk[4]),
        free   : chunk[3] === 'free'
      })
    }
    else if (verbose && line.startsWith('End:')) {
      // total 10440b, free: 10440b
      let end = line.match(/^End: total ([0-9]+)b, free: ([0-9]+)b$/)
      target.total = parseInt(end[1])
      target.used  = target.total - target.free
    }
    else {
      setValue(line)
    }
  })

  return memory
}
