import { normalizePath } from '../util'

/**
* Get file content.
*
* ### on success
* ```
* return "Raw file contents as text."
* ```
* ### on error
* ```
* throw 'File not found "xxx".'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L331
*/
export function cat(raw, args) {
  let source = normalizePath(args[0] || '')

  if (raw.trim().startsWith('File not found')) {
    throw new Error('File not found "' + source + '".')
  }

  return raw
}
