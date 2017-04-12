/**
* Parse `ok` command response.
*
* ### on success
* ```
* return "ok"
* ```
* ### on error
* ```
* return Error: 'ko'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L272
*/
export function cmd_ok(raw, args) {
  if (raw.trim() === 'ok') {
    return 'ok'
  }

  return new Error('ko')
}
