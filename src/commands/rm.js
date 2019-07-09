import { COULD_NOT_DELETE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'
import ls from './ls'

/** @ignore */
function rmRecursive (params) {
  return new Promise((resolve, reject) => {
    // fetch folder tree
    ls(params).then(response => {
      let files = [ { path: params.path }, ...response.data.files ]
      let removedFiles = []
      let rmResponse = null
      const recursive = () => {
        const file = files.pop()
        rm({
          ...params,
          path: file.path,
          recursive: false
        })
          .then(response => {
            if (!rmResponse) {
              rmResponse = response
            }
            removedFiles.unshift(file.path)
            rmResponse.data.files = removedFiles
            rmResponse.params = params
          })
          .catch(reject)
          .then(() => {
            if (!files.length) {
              return resolve(rmResponse)
            }
            recursive()
          })
      }
      recursive()
    })
      .catch(reject)
  })
}

/**
 * Send rm command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object}  params                     - Params...
 * @param {String}  params.address             - Board address without protocol
 * @param {string}  params.path                - Path to remove
 * @param {boolean} [params.recursive = false] - Fetch inner folders (slower)
 * @param {...any} ...rest                     - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link COULD_NOT_DELETE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L348
 *
 * @example
 * [EXAMPLE ../../examples/rm.js]
 */
export default function rm ({
  address = requiredParam('address'),
  path = requiredParam('path'),
  recursive = false,
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('path', path, ['string'])
  requiredTypes('recursive', recursive, ['boolean'])
  const params = {
    ...rest,
    address,
    path,
    recursive,
    command: `rm ${path}`
  }
  // recursive ?
  if (recursive) {
    return rmRecursive(params)
  }
  // send command
  return command(params).then(response => {
    // file not found or not empty folder
    if (response.text.startsWith('Could not delete')) {
      // set an Error if somthing gose wrong
      throw errorFactory({
        ...response,
        type: COULD_NOT_DELETE,
        message: `Could not delete [ ${path} ]`
      })
    }
    // set some data
    response.data.files = [ path ]
    // allaways return the response
    return response
  })
}
