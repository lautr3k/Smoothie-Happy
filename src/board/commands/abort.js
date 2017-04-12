/**
* Parse `abort` command response.
*
* ### on success
* ```
* return 'Aborted! Please turn any heaters off manually.'
* ```
* ### on error
* ```
* return Error: 'Not currently playing.'
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L266
* @see https://github.com/Smoothieware/Smoothieware/blob/1f73659f0b0cb6142e395c3d4d7dcbaadbac870a/src/modules/utils/player/Player.cpp#L359
*/
export function cmd_abort(raw, args) {
  // raw response
  raw = raw.trim()

  if (raw.startsWith('Not currently playing')) {
    return new Error('Not currently playing.')
  }

  if (! raw.startsWith('Aborted playing or paused file')) {
    return new Error('Unknown response string.')
  }

  return 'Aborted! Please turn any heaters off manually.'
}
