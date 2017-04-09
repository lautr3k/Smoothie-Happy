/**
* Get wcs state.
*
* ### on success
* ```
* return {
*   "current": "G54",
*   "tool"   : { "x": 0, "y": 0, "z": 0 },
*   "prob"   : { "x": 0, "y": 0, "z": 0 },
*   "G54"    : { "x": 0, "y": 0, "z": 0 },
*   "G55"    : { "x": 0, "y": 0, "z": 0 },
*   "G56"    : { "x": 0, "y": 0, "z": 0 },
*   "G57"    : { "x": 0, "y": 0, "z": 0 },
*   "G58"    : { "x": 0, "y": 0, "z": 0 },
*   "G59"    : { "x": 0, "y": 0, "z": 0 },
*   "G59.1"  : { "x": 0, "y": 0, "z": 0 },
*   "G59.2"  : { "x": 0, "y": 0, "z": 0 },
*   "G59.3"  : { "x": 0, "y": 0, "z": 0 },
*   "G28"    : { "x": 0, "y": 0, "z": 0 },
*   "G30"    : { "x": 0, "y": 0, "z": 0 },
*   "G92"    : { "x": 0, "y": 0, "z": 0 }
*}
* ```
* ### on error
* ```
* throw '...'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#828
*/
export function get_wcs(raw, args) {
  // [current WCS: G54]
  // [G54:0.0000,0.0000,0.0000]
  // [G55:0.0000,0.0000,0.0000]
  // [G56:0.0000,0.0000,0.0000]
  // [G57:0.0000,0.0000,0.0000]
  // [G58:0.0000,0.0000,0.0000]
  // [G59:0.0000,0.0000,0.0000]
  // [G59.1:0.0000,0.0000,0.0000]
  // [G59.2:0.0000,0.0000,0.0000]
  // [G59.3:0.0000,0.0000,0.0000]
  // [G28:0.0000,0.0000,0.0000]
  // [G30:0.0000,0.0000,0.0000]
  // [G92:0.0000,0.0000,0.0000]
  // [Tool Offset:0.0000,0.0000,0.0000]
  // [PRB:0.0000,0.0000,0.0000:0]
  let lines = raw.split('\n')

  // unwrap line ([...])
  lines = lines.map(line => line.slice(1, -1))

  let wcs = {
    current: lines.shift().split(': ').pop()
  }

  lines.forEach(line => {
    let parts  = line.split(':')
    let code   = parts.shift().toUpperCase()
    let coords = parts.shift().split(',')

    if (code === 'TOOL OFFSET') {
      code = 'tool'
    }
    else if (code === 'PRB') {
      code = 'prob'
    }

    wcs[code] = {
      x: parseFloat(coords[0]),
      y: parseFloat(coords[1]),
      z: parseFloat(coords[2])
    }
  })

  return wcs
}
