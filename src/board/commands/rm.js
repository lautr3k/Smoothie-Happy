import { normalizePath } from '../util'

/**
* Remove a file.
*
* ### on success
* ```
* return "/sd/removed_file.gcode"
* ```
* ### on error
* ```
* return Error: 'Could not remove "xxx".'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L331
*/
export function cmd_rm(raw, args) {
  // raw response
  raw = raw.trim()

  let source = normalizePath(args[0] || '')

  // file not found
  if (raw.startsWith('Could not delete')) {
    return new Error('Could not remove "' + source + '".')
  }

  return source
}
