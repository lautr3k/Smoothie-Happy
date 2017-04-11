import { normalizePath } from '../util'

/**
* Parse `ls` command response.
*
* ### on success
* - If the `-s` parameter is not provided, the size is set to 0.
* - The size is also set to 0 on directories.
* ```
* return [
*   {"extension":"","name":"project1","path":"/sd/project1","parent":"/sd","type":"folder","size":0},
*   {"extension":".cur","name":"firmware.cur","path":"/sd/firmware.cur","parent":"/sd","type":"file","size":368144},
*   {"extension":"","name":"config","path":"/sd/config","parent":"/sd","type":"file","size":29417},
*   {"extension":".gcode","name":"file1.gcode","path":"/sd/file1.gcode","parent":"/sd","type":"file","size":1914257},
*   {"extension":".gcode","name":"file2.gcode","path":"/sd/file2.gcode","parent":"/sd","type":"file","size":0},
*   {"extension":".gcode","name":"file3.gcode","path":"/sd/file3.gcode","parent":"/sd","type":"file","size":1062811}
* ]
* ```
* ### on error
* ```
* throw 'Could not open "xxx" directory.'
* throw 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Array}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L284
*/
export function cmd_ls(raw, args) {
  // size flag
  let size = args[0] === '-s'

  size && args.shift()

  // extract and normalize path
  let path = normalizePath(args[0] || '')

  // raw response
  raw = raw.trim()

  // file not found
  if (raw.startsWith('Could not open directory')) {
    throw new Error('Could not open "' + path + '" directory.')
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
  let rootPath = path !== '/' ? path : ''

  // for each lines (file)
  lines.forEach(line => {
    // remove trailing spaces
    line = line.trim()

    if (! excludes.includes(line)) {
      // extract file/directory info (name/size)
      info = line.trim().match(/^([a-z0-9_\-\.]+) ?(\/| [0-9]+)?$/, 'gi')

      if (! info) {
        throw new Error('Unknown response string.');
      }

      // is directory ?
      isDir = info[2] === '/'

      extension = ''

      if (info[1].includes('.')) {
        extension = '.' + info[1].split('.').pop()
      }

      // set file info
      files.push({
        name: info[1],
        extension: extension,
        parent: rootPath.length ? rootPath : '/',
        path: rootPath + '/' + info[1],
        type: isDir ? 'folder' : 'file',
        size: isDir ? 0 : parseInt(info[2] || 0)
      })
    }
  })

  return files
}
