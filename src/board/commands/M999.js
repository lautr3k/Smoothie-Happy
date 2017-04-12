/**
* Clear state.
*
* ### on success
* ```
* return true if state cleared or false if state not halted
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Boolean|Error}
*/
export function cmd_M999(raw, args) {
  return raw.trim() !== 'ok'
}
