import { normalizePath } from '../util'

/**
* Get current working directory.
*
* ### on success
* ```
* return "/sd/folder"
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L373
*/
export function pwd(raw, args) {
  return raw.trim()
}
