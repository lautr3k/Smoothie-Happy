// -----------------------------------------------------------------------------
// List of commands (12/2016)
// http://smoothieware.org/console-commands
// https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp
// -----------------------------------------------------------------------------
// + DONE
// - TODO
// -----------------------------------------------------------------------------
// - abort
// - break
// - calc_thermistor
// - cat
// - cd
// - config-load
// - config-get
// - config-set
// - dfu
// - fire
// - get
// - help
// - load
// + ls
// - md5sum
// - mem
// - mv
// - mkdir
// - net
// + ok
// - play
// - progress
// - pwd
// - remount
// - reset
// - resume
// - rm
// - save
// - set_temp
// - suspend
// - switch
// - test
// - thermistors
// - upload
// + version
// -----------------------------------------------------------------------------

/**
* Parse `ls` command response.
*
* ### on success
* - If the `-s` parameter is not provided, the size is set to 0.
* - The size is also set to 0 on directories.
* ```
* return [
*   {"extension":"","name":"project1","path":"sd/project1","parent":"sd","type":"directory","size":0},
*   {"extension":".cur","name":"firmware.cur","path":"sd/firmware.cur","parent":"sd","type":"file","size":368144},
*   {"extension":"","name":"config","path":"sd/config","parent":"sd","type":"file","size":29417},
*   {"extension":".gcode","name":"file1.gcode","path":"sd/file1.gcode","parent":"sd","type":"file","size":1914257},
*   {"extension":".gcode","name":"file2.gcode","path":"sd/file2.gcode","parent":"sd","type":"file","size":0},
*   {"extension":".gcode","name":"file3.gcode","path":"sd/file3.gcode","parent":"sd","type":"file","size":1062811}
* ]
* ```
* ### on error
* ```
* throw "Could not open "xxx" directory."
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Array}
* @throws {Error}
*/
export function ls(raw, args) {
  // size flag
  let size = args[0] === '-s'

  size && args.shift()

  // extract path and remove trailing slash
  let path = args[0] ? args[0].replace(/\/$/, '') : ''

  // raw response
  raw = raw.trim()

  // file not found
  if (raw.startsWith('Could not open directory')) {
    throw new Error('Could not open "' + path + '" directory')
  }

  // excluded files
  let excludes = ["system volume information/"]

  // split lines
  let lines = raw.split('\n')
  let info  = null

  // empty files list
  let files = []
  let file  = null
  let isDir = false

  let extension

  // for each lines (file)
  lines.forEach(line => {
    // remove trailing spaces
    line = line.trim()

    if (! excludes.includes(line)) {
      // extract file/directory info (name/size)
      info = line.trim().match(/^([a-z0-9_\-\.]+) ?(\/| [0-9]+)?$/, 'gi')

      if (info) {
        // is directory ?
        isDir = info[2] == '/'

        extension = ''

        if (info[1].includes('.')) {
          extension = '.' + info[1].split('.').pop()
        }

        // set file info
        files.push({
          name: info[1],
          path: path + '/' + info[1],
          parent: path.length ? path : '/',
          type: isDir ? 'directory' : 'file',
          size: isDir ? 0 : parseInt(info[2] || 0),
          extension: extension
        })
      }
    }
  })

  return files
}

/**
* Parse `ok` command response.
*
* ### on success
* ```
* return "ok"
* ```
* ### on error
* ```
* throw "ko"
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
*/
export function ok(raw, args) {
  if (raw.trim() === 'ok') {
    return 'ok'
  }

  throw new Error('ko')
}

/**
* Parse version command response.
*
* ### on success
* ```
* return {
*   branch: "edge",
*   hash  : "9ab4538",
*   date  : "Oct 10 2016 04:09:42",
*   mcu   : "LPC1769",
*   clock : "120MHz"
* }
* ```
* ### on error
* ```
* throw "Unknown version string"
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
*/
export function version(raw, args) {
  // version pattern
  let pattern = /Build version: (.*), Build date: (.*), MCU: (.*), System Clock: (.*)/

  // test the pattern
  let info = raw.trim().match(pattern)

  if (info) {
    // split branch-hash on dash
    let branch = info[1].split('-')

    // resolve
    return {
      branch: branch[0].trim(),
      hash  : branch[1].trim(),
      date  : info[2].trim(),
      mcu   : info[3].trim(),
      clock : info[4].trim()
    }
  }

  // reject
  throw new Error('Unknown version string')
}
