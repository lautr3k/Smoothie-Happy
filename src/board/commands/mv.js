import { normalizePath } from '../util'

/**
* Move a file.
*
* ### on success
* ```
* return "ok"
* ```
* ### on error
* ```
* throw 'Could not move "xxx" to "yyy".'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L339
*/
export function mv(raw, args) {
  // raw response
  raw = raw.trim()

  let source = normalizePath(args[0] || '')
  let target = normalizePath(args[1] || '')

  // file not found
  if (raw.startsWith('Could not rename')) {
    throw new Error('Could not move "' + source + '" to "' + target + '".')
  }

  return 'ok'
}
