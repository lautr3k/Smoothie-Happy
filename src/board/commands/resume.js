/**
* Parse `resume` command response.
*
* ### on success
* ```
* return [
*   "Restoring saved XYZ positions and state...",
*   "Resuming print",
*   ...
* ]
* ```
* ### on error
* ```
* return Error: 'Not suspended.'
* return Error: 'Resume aborted by kill.'
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L266
* @see https://github.com/Smoothieware/Smoothieware/blob/1f73659f0b0cb6142e395c3d4d7dcbaadbac870a/src/modules/utils/player/Player.cpp#L594
*/
export function cmd_resume(raw, args) {
  raw = raw.trim()

  if (raw.startsWith('Not suspended')) {
    return new Error('Not suspended.')
  }

  if (! raw.startsWith('resuming print...')) {
    return new Error('Unknown response string.')
  }

  if (raw.indexOf('Resume aborted by kill') !== -1) {
    return new Error('Resume aborted by kill.')
  }

  let lines = raw.split('\n').map(line => line.trim())

  lines.shift()

  return lines
}
