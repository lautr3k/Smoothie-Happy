/**
* Get temperature.
*
* ### on success
* ```
* // get temp
* return [
*   {
*     "designator": "T",
*     "id": 57988,
*     "current": null, // null means the sensor is not properly connected, or it is damaged in some way.
*     "target": 0,
*     "pwm": 0
*   },
*   {
*     "designator": "B",
*     "id": 22060,
*     "current": null,
*     "target": 0,
*     "pwm": 0
*   }
* ]
* ```
* ```
* // get temp bed
* return {
*   "designator": "bed",
*   "current": null,
*   "target": 0,
*   "pwm": 0
* }
* ```
* ### on error
* ```
* return Error: 'No heaters found.'
* return Error: 'Unknown response string.'
* return Error: '"xxx" is not a known temperature device.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#745
*/
export function get_temp(raw, args) {
  if (raw.startsWith('no heaters found')) {
    return new Error('No heaters found.')
  }

  // device [bed|hotend]
  let device = (args[0] || 'all').toLowerCase()

  if (raw.endsWith('is not a known temperature device')) {
    return new Error('"' + device + '" is not a known temperature device.')
  }

  let result

  if (device === 'all') {
    // [T (57988) temp: inf/0.000000 @0]
    return raw.split('\n').map(parseTempString)
  }

  // "bed temp: inf/0.000000 @0"
  let matches = raw.match(/([a-z]+) temp: (inf|[0-9\.]+)\/(inf|[0-9\.]+) @([0-9]+)/)

  if (! matches) {
    return new Error('Unknown response string.')
  }

  return {
    device : matches[1],
    current: parseFloat(matches[2]),
    target : parseFloat(matches[3]),
    pwm    : parseInt(matches[4]),
  }
}

function parseTempString(temp) {
  // T (57988) temp: inf/0.000000 @0
  let matches = temp.match(/(T|B) \(([0-9]+)\) temp: (inf|[0-9\.]+)\/(inf|[0-9\.]+) @([0-9]+)/)

  if (! matches) {
    return new Error('Unknown response string.')
  }

  return {
    designator: matches[1],
    id        : parseInt(matches[2]),
    current   : parseFloat(matches[3]),
    target    : parseFloat(matches[4]),
    pwm       : parseInt(matches[5]),
  }
}
