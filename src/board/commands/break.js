/**
* Parse `break` command response.
*
* !!! Smoothie never respond when calling this command.
*
* ### on success
* ```
* return 'Entering MRI debug mode...'
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
export function cmd_break(raw, args) {
  raw = raw.trim()

  if (raw !== 'Entering MRI debug mode...') {
    return new Error('Unknown response string.')
  }

  return raw
}
