
import { normalizePath, requiredParam, requiredTypes } from '../utils'
import { COULD_NOT_OPEN_PATH } from './error-types'
import { errorFactory } from '../request/factory'
import { folderFactory, fileFactory } from './factory'
import command from '../command'

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
 * @param {null|onFile} [params.onFile = null]     - called when a file is found
 * @param {...any}      ...rest                    - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link COULD_NOT_OPEN_PATH}
 *
 * @example
 * [EXAMPLE ../../examples/ls.js]
 */
export default function ls ({
  address = requiredParam('address'),
  path = '/',
  recursive = false,
  onFile = null,
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('path', path, ['string'])
  requiredTypes('recursive', recursive, ['boolean'])
  requiredTypes('onFile', onFile, ['null', 'function'])
  path = '/' + normalizePath(path)
  const params = {
    ...rest,
    address,
    path,
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
