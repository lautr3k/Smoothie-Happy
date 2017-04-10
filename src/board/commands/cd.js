import { normalizePath } from '../util'

/**
* Change current folder.
*
* ### on success
* ```
* return "ok"
* ```
* ### on error
* ```
* throw 'Could not open "xxx" directory.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L358
*/
export function cmd_cd(raw, args) {
  let source = normalizePath(args[0] || '')

  if (raw.trim().startsWith('Could not open directory')) {
    throw new Error('Could not open "' + source + '" directory.')
  }

  return 'ok'
}
