import { requiredTypes } from '../utils.js'
import command from '../command'

/**
* Sort files collection by path.
*
* @param {Array} files
* @return {Array}
*
*/
function sortByPath (files) {
  let sortedFiles = [ ...files ]
  return sortedFiles.sort((a, b) => {
    if (a.path < b.path) return -1
    if (a.path > b.path) return 1
    return 0
  })
}

/**
* Send ls command.
*
* @param {Object} settings - command settings
* @param {string} settings.address - ip or hostname (without protocle http://)
* @param {string} [settings.path = '/sd'] - path to list
* @param {boolean} [settings.getSize = false] - fetch files size (slower)
* @param {boolean} [settings.recursive = false] - fetch inner folders (slower)
* @param {function} [settings.onFile = null] - called when a file is found
* @param {number} [settings.timeout = 0] - connexion timeout
* @param {Object} [settings.axiosConfig = {}] - axios config ([documentation ](https://github.com/axios/axios#axiosconfig))
*
* @return {Promise}
*
* @example
* ls({
*   address: '192.168.1.121',
*   path: '/sd',
*   getSize: true,
*   recursive: true,
*   onFile (file) {
*     console.log('file:', file)
*   }
* })
*   .then(response => {
*     console.log(response)
*   })
*   .catch(error => {
*     console.log(error)
*   })
*
*/
export default function ls ({
  path = '/sd',
  getSize = false,
  recursive = false,
  onFile = file => {},
  ...params
} = {}) {
  // type check
  requiredTypes('path', path, ['string'])
  requiredTypes('getSize', getSize, ['boolean'])
  requiredTypes('recursive', recursive, ['boolean'])
  requiredTypes('onFile', onFile, ['function'])
  // clean path
  path = '/' + path.trim().replace(/^\/|\/$/g, '')
  // command settings
  const settings = {
    // overwritable settings
    timeout: 0,
    path,
    getSize,
    recursive,
    onFile,
    // user settings
    ...params,
    // fixed settings
    command: 'ls'
  }
  // get size ?
  if (getSize) {
    settings.command += ' -s'
  }
  // set path
  settings.command += ` ${path}`
  // send command
  return command(settings)
    .then(response => {
      // trim response data
      let data = response.data.trim()
      // file not found
      if (data.startsWith('Could not open')) {
        throw new Error(`Could not open "${path}".`)
      }
      // process data
      let folders = []
      let files = data.split('\n').map(line => {
        line = line.trim()
        // folder
        if (line.endsWith('/')) {
          const name = line.slice(0, -1)
          const folderPath = `${path === '/' ? '' : path}/${name}`
          folders.push(folderPath)
          const folder = {
            type: 'folder',
            name,
            path: folderPath,
            parent: path
          }
          settings.onFile(folder)
          return folder
        }
        // file
        let parts = line.split(' ')
        let file = {
          type: 'file',
          name: parts[0],
          extension: parts[0].split('.').pop(),
          path: `${path}/${parts[0]}`,
          parent: path
        }
        if (settings.getSize) {
          file.size = parseInt(parts[1])
        }
        settings.onFile(file)
        return file
      })
      if (settings.recursive && folders.length) {
        return new Promise((resolve, reject) => {
          const recursive = () => {
            let folder = folders.shift()
            ls({
              ...settings,
              path: folder
            })
              .then(response => {
                files = [ ...files, ...response.data ]
              })
              .catch(error => {
                reject(error)
              })
              .then(() => {
                if (!folders.length) {
                  return resolve({ settings, data: sortByPath(files) })
                }
                recursive()
              })
          }
          recursive()
        })
      }
      // allaways return an object with settings and data properties
      return { settings, data: sortByPath(files) }
    })
}
