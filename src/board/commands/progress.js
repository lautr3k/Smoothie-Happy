/**
* Parse `progress` command response.
*
* ### on success
* ```
* return {
*   "paused"   : false,
*   "file"     : "/sd/file.gcode",
*   "complete" : 85, // percent
*   "elapsed"  : "00:13:43",
*   "estimated": "00:02:14" // undefined if elapsed <= 10 seconds
* }
*
* // or if paused
* return {
*   "paused": true,
*   "played": 150,
*   "total" : 380
* }
* ```
* ### on error
* ```
* throw 'Not currently playing.'
* throw 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L266
* @see https://github.com/Smoothieware/Smoothieware/blob/1f73659f0b0cb6142e395c3d4d7dcbaadbac870a/src/modules/utils/player/Player.cpp#L315
*/
export function cmd_progress(raw, args) {
  // raw response
  raw = raw.trim()

  if (raw.startsWith('Not currently playing')) {
    throw new Error('Not currently playing.')
  }

  if (raw.startsWith('SD print is paused at')) {
    let matches = raw.match(/SD print is paused at ([0-9]+)\/([0-9]+)/)

    if (! matches) {
      throw new Error('Unknown response string.')
    }

    return {
      paused: true,
      played: parseInt(matches[1]),
      total : parseInt(matches[2])
    }
  }

  // file: /sd/skate.gcode, 27 % complete, elapsed time: 7 s
  // file: /sd/skate.gcode, 27 % complete, elapsed time: 13 s, est time: 33 s

  // Since -> https://github.com/Smoothieware/Smoothieware/commit/7f7d84293841e659d436b8f833e90d6f8cbdf281
  // file: /sd/tag.gcode, 6 % complete, elapsed time: 00:01:42, est time: 00:25:23
  let matches = raw.match(/file: ([^,]+), ([0-9]+) % complete, elapsed time: ([0-9\:]+)(?: s)?(?:, est time: ([0-9\:]+)( s)?)?/)

  if (! matches) {
    throw new Error('Unknown response string.')
  }

  // https://github.com/Smoothieware/Smoothieware/commit/7f7d84293841e659d436b8f833e90d6f8cbdf281
  let elapsed   = matches[3]
  let estimated = matches[4]

  if (matches[5]) {
    elapsed   = timeFormat(elapsed)
    estimated = timeFormat(estimated)
  }

  return {
    paused   : false,
    file     : matches[1],
    complete : parseInt(matches[2]),
    elapsed,
    estimated
  }
}

// seconds -> 00:00:00
function timeFormat(time) {
  time = parseInt(time)
  return [time / 3600, (time % 3600) / 60, time % 60].join(':')
}
