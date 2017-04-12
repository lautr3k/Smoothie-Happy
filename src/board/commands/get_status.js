/**
* Get status.
*
* ### on success
* ```
* return
* {
*   "status"   : "idle", // [idle, alarm, home, hold, run]
*   "machine"  : { "x": 0, "y": 0, "z": 0 },
*   "workspace": { "x": 0, "y": 0, "z": 0 }
* }
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#847
* @see https://github.com/Smoothieware/Smoothieware/blob/f7d999cff4a33d83b09ce136c122b3b7b2f1c69a/src/libs/Kernel.cpp#L163
*/
export function get_status(raw, args) {
  let parts = raw.slice(1, -1).toLowerCase().replace(/(w|m)pos:/g, '').split(',')

  return {
    status: parts[0],
    machine: {
      x: parseFloat(parts[1]),
      y: parseFloat(parts[2]),
      z: parseFloat(parts[3])
    },
    workspace: {
      x: parseFloat(parts[4]),
      y: parseFloat(parts[5]),
      z: parseFloat(parts[6])
    }
  }
}
