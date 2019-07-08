import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send mem command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object}  params                   - Params...
 * @param {String}  params.address           - Board address without protocol
 * @param {boolean} [params.verbose = false] - Verbose output ?
 * @param {...any} ...rest                   - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/edge/src/modules/utils/simpleshell/SimpleShell.cpp#L599
 * @see https://github.com/Smoothieware/Smoothieware/blob/92c787f87829434a3abdbb2c10eb36154d45bae9/src/libs/MemoryPool.cpp#L209
 *
 * @example
 * [EXAMPLE ../../examples/mem.js]
 */
export default function mem ({
  address = requiredParam('address'),
  verbose = false,
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('verbose', verbose, ['boolean'])
  const params = {
    ...rest,
    address,
    verbose,
    command: 'mem' + (verbose ? ' -v' : '')
  }
  return command(params).then(response => {
    let memory = {}
    let text = response.text.trim()
    text = text.replace(/\r\n/g, '\n').replace(/\t/g, '')
    text = text.replace(/Unused Heap: ([0-9]+) bytes\n/g, (match, p1) => {
      memory.unusedHeap = parseInt(p1)
      return ''
    })
    text = text.replace(/Used Heap Size: ([0-9]+)\n/g, (match, p1) => {
      memory.usedHeap = parseInt(p1)
      return ''
    })
    text = text.replace(/Allocated: ([0-9]+), /g, (match, p1) => {
      memory.allocated = parseInt(p1)
      return ''
    })
    text = text.replace(/Free: ([0-9]+)\n/g, (match, p1) => {
      memory.free = parseInt(p1)
      return ''
    })
    text = text.replace(/Total Free RAM: ([0-9]+) bytes\n/g, (match, p1) => {
      memory.freeRAM = parseInt(p1)
      return ''
    })
    text = text.replace(/Free AHB0: ([0-9]+), /g, (match, p1) => {
      memory.freeAHB0 = parseInt(p1)
      return ''
    })
    text = text.replace(/AHB1: ([0-9]+)\n/g, (match, p1) => {
      memory.freeAHB1 = parseInt(p1)
      return ''
    })
    text = text.replace(/Block size: ([0-9]+) bytes, /g, (match, p1) => {
      memory.blockSize = parseInt(p1)
      return ''
    })
    text = text.replace(/Tickinfo size: ([0-9]+) bytes/g, (match, p1) => {
      memory.tickInfoSize = parseInt(p1)
      return ''
    })
    let chunks = []
    let memoryPool = []
    let currentPool = null
    if (verbose) {
      text = text.replace(/Chunk: ([0-9]+) {2}Address: ([x0-9A-F]+) {2}Size: ([0-9]+) {2}(CHUNK FREE)?\n/g, (match, num, address, size, free) => {
        chunks.push({ num, address, size: parseInt(size), free: !!free })
        return ''
      })
      text = text.split('\n').map(line => {
        line = line.replace(/Start: ([0-9]+)b MemoryPool at ([x0-9a-f]+)/g, (match, start, address) => {
          currentPool = { address, start: parseInt(start), chunks: [], total: null, free: null }
          return ''
        })
        line = line.replace(/Chunk at ([x0-9a-f]+) \( *([0-9]+)\): (free|used), ([0-9]+) bytes/g, (match, address, offset, free, size) => {
          currentPool.chunks.push({ address, offset: parseInt(offset), free: free === 'free', size: parseInt(size) })
          return ''
        })
        line = line.replace(/End: total ([0-9]+)b, free: ([0-9]+)b/g, (match, total, free) => {
          currentPool = { ...currentPool, total: parseInt(total), free: parseInt(free) }
          memoryPool.push({ ...currentPool })
          currentPool = null
          return ''
        })
        return line
      })
        .filter(line => line.length)
        .join('\n')
        .trim()
    }
    // allaways return the response
    response.data = { ...memory, chunks, memoryPool, text }
    return response
  })
}
