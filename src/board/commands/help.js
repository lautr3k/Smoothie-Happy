/**
* Get command help list.
*
* ### on success
* ```
* return "List of command help. One by line."
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#1124
*/
export function cmd_help(raw, args) {
  return raw.trim()
}
