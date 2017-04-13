import { normalizePath } from '../util'

/**
* Parse `mkdir` command response.
*
* ### on success
* ```
* return '/sd/new_directory'
* ```
* ### on error
* ```
* return Error: 'Could not create directory "xxx".'
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L349
*/
export function cmd_mkdir(raw, args) {
  raw = raw.trim()

  let source = normalizePath(args[0] || '')

  if (raw.startsWith('could not create directory')) {
    return new Error('Could not create directory "' + source + '".')
  }

  if (! raw.startsWith('created directory')) {
    return new Error('Unknown response string.')
  }

  return source
}
