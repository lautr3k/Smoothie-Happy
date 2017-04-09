/**
* Get position.
*
* ### on success
* ```
* return {
*   "WCS": {
*     "command"    : "M114",
*     "description": "Position of all axes",
*     "x"          : 0,
*     "y"          : 0,
*     "z"          : 0
*   },
*   "WPOS": {
*     "command"    : "M114.1",
*     "description": "Real time position of all axes"
*     // , x, y, z
*   },
*   "MPOS": {
*     "command"    : "M114.2",
*     "description": "Real time machine position of all axes"
*     // , x, y, z
*   },
*   "APOS": {
*     "command"    : "M114.3",
*     "description": "Real time actuator position of all actuators"
*     // , x, y, z
*   },
*   "LMS": {
*     "command"    : "M114.4",
*     "description": "Last milestone"
*     // , x, y, z
*   },
*   "LMP": {
*     "command"    : "M114.5",
*     "description": "Last machine position"
*     // , x, y, z
*   }
* }
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#818
*/
export function get_pos(raw, args) {
  // last C: X:0.0000 Y:0.0000 Z:0.0000
  // realtime WPOS: X:0.0000 Y:0.0000 Z:0.0000
  // MPOS: X:0.0000 Y:0.0000 Z:0.0000
  // APOS: X:0.0000 Y:0.0000 Z:0.0000
  // LMS: X:0.0000 Y:0.0000 Z:0.0000
  // LMP: X:0.0000 Y:0.0000 Z:0.0000
  // split on new lines
  let lines = raw.split('\n')
  let key, positions = {}

  lines.forEach(line => {
    let r = parsePositionString(line)
    positions[r.key] = r.position
  })

  // split response text on new lines
  return positions
}

// Parse position string.
// WCS : M114   - Last WCS.
// WPOS: M114.1 - Realtime WCS.
// MPOS: M114.2 - Realtime machine coordinate system.
// APOS: M114.3 - Realtime actuator position.
// LMS : M114.4 - Last milestone.
// LMP : M114.5 - Last machine position.
function parsePositionString(line) {
  let parts  = line.split(':')
  let key    = parts.shift().replace(' ', '_').toUpperCase()
  let coords = parts.join(':').trim().split(' ')

  let position = {
    x  : parseFloat(coords[0].substr(2)),
    y  : parseFloat(coords[1].substr(2)),
    z  : parseFloat(coords[2].substr(2))
  }

  if (key === 'LAST_C') {
    key = 'WCS'
  }
  else if (key === 'REALTIME_WPOS') {
    key = 'WPOS'
  }

  switch (key) {
    case 'WCS':
      position.command     = 'M114'
      position.description = 'Position of all axes'
      break
    case 'WPOS':
      position.command     = 'M114.1'
      position.description = 'Real time position of all axes'
      break
    case 'MPOS':
      position.command     = 'M114.2'
      position.description = 'Real time machine position of all axes'
      break
    case 'APOS':
      position.command     = 'M114.3'
      position.description = 'Real time actuator position of all actuators'
      break
    case 'LMS':
      position.command     = 'M114.4'
      position.description = 'Last milestone'
      break
    case 'LMP':
      position.command     = 'M114.5'
      position.description = 'Last machine position'
      break
    default:
      position.command     = 'M114.?'
      position.description = 'Unknown type'
  }

  return { key, position }
}
