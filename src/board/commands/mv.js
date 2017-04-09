import { normalizePath } from '../util'

/**
* Move a file.
*
* ### on success
* ```
* return {
*   "source": "/sd/file.txt",
*   "target": "/sd/file.gcode"
* }
* ```
* ### on error
* ```
* throw 'Could not move "xxx" to "yyy".'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Array}
* @throws {Error}
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

  return { source, target }
}
