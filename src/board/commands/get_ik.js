/**
* Get inverse kinematics.
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
* throw 'Usage: get ik [-m] x[,y,z].'
* throw 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#771
*/
export function get_ik(raw, args) {
  let move = args.shift() === '-m'

  // error
  if (raw.startsWith('error:')) {
    throw new Error('Usage: get ik [-m] x[,y,z].')
  }

  let matches = raw.match(/actuator= X ([0-9\.]+), Y ([0-9\.]+), Z ([0-9\.]+)/)

  if (! matches) {
    throw new Error('Unknown response string.');
  }

  return {
    move,
    x: parseFloat(matches[1]),
    y: parseFloat(matches[2]),
    z: parseFloat(matches[3])
  }
}
