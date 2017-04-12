import { normalizePath } from '../util'

/**
* Move a file.
*
* ### on success
* ```
* return {
*   source: '/sd/source.gcode',
*   target: '/sd/target.gcode'
* }
* ```
* ### on error
* ```
* return Error: 'Could not move "xxx" to "yyy".'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L339
*/
export function cmd_mv(raw, args) {
  // raw response
  raw = raw.trim()

  let source = normalizePath(args[0] || '')
  let target = normalizePath(args[1] || '')

  // file not found
  if (raw.startsWith('Could not rename')) {
    return new Error('Could not move "' + source + '" to "' + target + '".')
  }

  return { source, target }
}
