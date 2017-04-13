/**
* Parse `dfu` command response.
*
* ### on success
* ```
* return 'Entering boot mode...'
* ```
* ### on error
* ```
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L661
*/
export function cmd_dfu(raw, args) {
  raw = raw.trim()

  if (raw !== 'Entering boot mode...') {
    return new Error('Unknown response string.')
  }

  return raw
}
