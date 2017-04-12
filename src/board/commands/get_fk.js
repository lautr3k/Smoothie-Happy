/**
* Get forward kinematics.
*
* ### on success
* ```
* return {
*   "move": false,
*   "x"   : 10,
*   "y"   : 10,
*   "z"   : 10
* }
* ```
* ### on error
* ```
* return Error: 'Usage: get ik [-m] x[,y,z].'
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#771
*/
export function get_fk(raw, args) {
  let move = args.shift() === '-m'

  // error
  if (raw.startsWith('error:')) {
    return new Error('Usage: get fk [-m] x[,y,z].')
  }

  let matches = raw.match(/cartesian= X ([0-9\.]+), Y ([0-9\.]+), Z ([0-9\.]+)/)

  if (! matches) {
    return new Error('Unknown response string.')
  }

  return {
    move,
    x: parseFloat(matches[1]),
    y: parseFloat(matches[2]),
    z: parseFloat(matches[3])
  }
}
