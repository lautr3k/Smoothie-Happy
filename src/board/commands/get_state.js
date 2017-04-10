/**
* Get state.
*
* ### on success
* ```
* return
* {
*   "modal"          : "G0",
*   "wcs"            : "G54",
*   "plane_selection": "G17",
*   "unit"           : "G21",
*   "distance_mode"  : "G90",
*   "path_control"   : "G94",
*   "program_pause"  : "M0",
*   "stop_tool"      : "M5",
*   "stop_coolant"   : "M9",
*   "tool"           : "T0",
*   "feed_rate"      : "F4000.0000",
*   "s_value"        : "S0.8000",
*   "state"          : [ "G0", "G54", "G17", "G21", "G90", "G94", "M0", "M5", "M9", "T0", "F4000.0000", "S0.8000" ]
* }
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#832
*/
export function get_state(raw, args) {
  let state = raw.slice(1, -1).split(' ')

  return {
    modal          : state[0],
    wcs            : state[1],
    plane_selection: state[2],
    unit           : state[3],
    distance_mode  : state[4],
    path_control   : state[5],
    program_pause  : state[6],
    stop_tool      : state[7],
    stop_coolant   : state[8],
    tool           : state[9],
    feed_rate      : state[10],
    s_value        : state[11],
    state          : state
  }
}
