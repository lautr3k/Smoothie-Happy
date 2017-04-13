/**
* Parse `save` command response.
*
* ### on success
* ```
* return {
*   stored: true,
*   file  : '/sd/config-override'
* }
* ```
* ### on error
* ```
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L542
*/
export function cmd_save(raw, args) {
  raw = raw.trim()

  let matches = raw.match(/^Settings Stored to (.*)/)

  if (! matches) {
    return new Error('Unknown response string.')
  }

  return { stored: true, file: matches[1] }
}
