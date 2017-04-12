/**
* Parse `suspend` command response.
*
* ### on success
* ```
* return 'Suspending print, waiting for queue to empty...'
* ```
* ### on error
* ```
* throw 'Already suspended.'
* throw 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L266
* @see https://github.com/Smoothieware/Smoothieware/blob/1f73659f0b0cb6142e395c3d4d7dcbaadbac870a/src/modules/utils/player/Player.cpp#L359
*/
export function cmd_suspend(raw, args) {
  // raw response
  raw = raw.trim()

  if (raw.startsWith('Already suspended')) {
    throw new Error('Already suspended.')
  }

  if (! raw.startsWith('Suspending print')) {
    throw new Error('Unknown response string.')
  }

  return 'Suspending print, waiting for queue to empty...'
}
