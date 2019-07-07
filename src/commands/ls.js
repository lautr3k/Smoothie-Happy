import { COULD_NOT_OPEN_PATH } from './error-types'
import { errorFactory } from '../request/factory'
import command from '../command'

/**
 * Folder factory.
 *
 * @param  {Object} params
 * @param  {String} params.path
 * @param  {String} params.line
 * @return {boardFolder}
 * @private
 */
function folderFactory ({ path, line }) {
  const name = line.slice(0, -1)
  const folderPath = `${path}/${name}`
  /**
   * @typedef  {Object} boardFolder - Board folder
   * @property {String} type        - Allaways === 'folder'
   * @property {String} name        - Folder name
   * @property {String} path        - Folder path
   * @property {String} parent      - Folder parent
   */
  return {
    type: 'folder',
    name,
    path: folderPath,
    parent: path
  }
}

/**
 * File factory.
 *
 * @param  {Object} params
 * @param  {String} params.path
 * @param  {String} params.line
 * @return {boardFile}
 * @private
 */
function fileFactory ({ path, line }) {
  let name = line
  let parts = line.split(' ')
  let size = parseInt(parts.pop())
  name = parts.join(' ')
  /**
   * @typedef  {Object} boardFile - Board file
   * @property {String} type      - Allaways === 'file'
   * @property {String} name      - File name
   * @property {Number} size      - File size
   * @property {String} path      - File path
   * @property {String} parent    - File parent
   * @property {String} extension - File extension
   */
  return {
    name,
    size,
    type: 'file',
    parent: path,
    path: `${path}/${name}`,
    extension: name.split('.').pop()
  }
}

/**
 * Sort files collection by path.
 *
 * @param {Array} files
 * @return {Array}
 * @private
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
 * List file recursive.
 *
 * @param  {Object}        config
 * @param  {Object}        config.params
 * @param  {Object}        config.response
 * @param  {Array<String>} config.folders
 *
 * @return {Promise<responsePayload|RequestError>}
 * @private
 */
function lsRecursive ({ params, response, folders }) {
  return new Promise((resolve, reject) => {
    const recursive = () => {
      const folder = folders.shift()
      ls({ ...params, path: folder }).then(({ text, data }) => {
        response.text += text
        response.data.files = [ ...data.files, ...response.data.files ]
        return response
      })
        .catch(reject)
        .then(response => {
          if (!folders.length) {
            response.data.files = sortByPath(response.data.files)
            return resolve(response)
          }
          recursive()
        })
    }
    recursive()
  })
}

/**
 * Send ls command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object}      params                     - Params...
 * @param {String}      params.address             - Board address without protocol
 * @param {String}      [params.path = '/']        - Path to list file from
 * @param {Boolean}     [params.recursive = false] - List subfolders ?
 * @param {onFile|null} [params.onFile = null]     - called when a file is found
 * @param {...any}      ...rest                    - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @example
 * [EXAMPLE ../../examples/ls.js]
 */
export default function ls ({
  address,
  path = '/',
  recursive = false,
  onFile = null,
  ...rest
} = {}) {
  path = '/' + path.replace(/^\/+|\/+$/g, '')
  const params = {
    ...rest,
    address,
    recursive,
    onFile,
    command: `ls -s ${path}`
  }
  return command(params).then(response => {
    // file not found
    if (response.text.startsWith('Could not open')) {
      throw errorFactory({
        ...response,
        type: COULD_NOT_OPEN_PATH,
        message: `Could not open path [ ${path} ]`
      })
    }
    let folders = []
    let files = response.text.split('\n').filter(line => line.length).map(line => {
      line = line.trim()
      let file = null
      if (line.endsWith('/')) {
        // folder
        file = folderFactory({ path, line })
        recursive && folders.push(file.path)
      } else {
        // file
        file = fileFactory({ path, line })
      }
      if (typeof onFile === 'function') {
        /**
         * @typedef {function(file: <boardFile|boardFolder>): void} onFile
         */
        onFile(file)
      }
      return file
    })
    // recursive ?
    if (recursive && folders.length) {
      response.data.files = files
      return lsRecursive({ params, response, folders })
    }
    // set files data
    response.data.files = sortByPath(files)
    // allaways return the response
    return response
  })
}
