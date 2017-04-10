/**
* Parse `ok` command response.
*
* ### on success
* ```
* return "ok"
* ```
* ### on error
* ```
* throw "ko"
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L272
*/
export function cmd_ok(raw, args) {
  if (raw.trim() === 'ok') {
    return 'ok'
  }

  throw new Error('ko')
}
