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
* return Error: 'File not found "xxx".'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L331
*/
export function cmd_cat(raw, args) {
  let source = normalizePath(args[0] || '')

  if (raw.trim().startsWith('File not found')) {
    return new Error('File not found "' + source + '".')
  }

  return raw
}
