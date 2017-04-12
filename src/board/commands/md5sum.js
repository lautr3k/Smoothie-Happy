import { normalizePath } from '../util'

/**
* Get md5 sum of the given file.
*
* ### on success
* ```
* return {
*   "md5" : "335a4ebbaa1bc6b81cc94fd6e7209ec2",
*   "file": "/sd/config"
* }
* ```
* ### on error
* ```
* return Error: 'File "xxx" not found.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L358
*/
export function cmd_md5sum(raw, args) {
  raw = raw.trim()

  let source = normalizePath(args[0] || '')

  if (raw.startsWith('File not found')) {
    return new Error('File "' + source + '" not found.')
  }

  var parts = raw.split(' ')

  return {
    md5 : parts[0].trim(),
    file: parts[1].trim()
  };
}
