/**
* Set temperature.
*
* - set_temp [bed|hotend]
*
* ### on success
* ```
* return {
*   "device": "bed",
*   "target": 180
* }
* ```
* ### on error
* ```
* throw '"xxx" is not a known temperature device.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#857
*/
export function cmd_set_temp(raw, args) {
  // raw response
  raw = raw.trim()

  // device
  let device = (args.shift() || '').toLowerCase()

  // error
  if (raw.endsWith('is not a known temperature device')) {
    throw new Error('"' + device + '" is not a known temperature device.')
  }

  // new temperature
  let target = parseInt(args.shift() || 0)

  return { device, target }
}
