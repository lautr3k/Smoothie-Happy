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
* @return {Object}
* @throws {Error}
*/
export function ok(raw, args) {
  if (raw.trim() === 'ok') {
    return 'ok'
  }

  throw new Error('ko')
}
