import { normalizePath } from '../util'

/**
* Parse `play` command response.
*
* ### on success
* ```
* return {
*   file: "/sd/my_file.gcode",
*   size: 8600 // or null if not computable
* }
* ```
* ### on error
* ```
* return Error: 'File "xxx" not found.'
* return Error: 'Currently printing, abort print first.'
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L266
* @see https://github.com/Smoothieware/Smoothieware/blob/1f73659f0b0cb6142e395c3d4d7dcbaadbac870a/src/modules/utils/player/Player.cpp#L267
*/
export function cmd_play(raw, args) {
  // raw response
  raw = raw.trim()

  // file file
  let file = normalizePath(args[0] || '')

  if (raw.startsWith('File not found')) {
    return new Error('File "' + file + '" not found.')
  }

  if (raw.startsWith('Currently printing')) {
    return new Error('Currently printing, abort print first.')
  }

  if (! raw.startsWith('Playing')) {
    return new Error('Unknown response string.')
  }

  let lines = raw.split('\n')
  let size  = parseInt(lines[1].trim().split(' ').pop())

  return { file, size }
}
