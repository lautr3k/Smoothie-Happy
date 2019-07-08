import { COULD_NOT_CREATE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/** @ignore */
function mkdirRecursive (params) {
  return new Promise((resolve, reject) => {
    let paths = params.path.split('/').filter(p => p.length)
    let views = []
    paths = paths.map(path => {
      views.push(path)
      return `/${views.join('/')}`
    })
    let createdPaths = []
    const recursive = () => {
      const path = paths.shift()
      mkdir({
        ...params,
        path,
        recursive: false
      })
        .then(response => {
          createdPaths.push(path)
          response.data.paths = createdPaths
          return response
        })
        .catch(error => {
          if (!paths.length) {
            reject(error)
          }
        })
        .then(response => {
          if (!paths.length) {
            return resolve(response)
          }
          recursive()
        })
    }
    recursive()
  })
}

/**
 * Send mkdir command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object}  params                     - Params...
 * @param {String}  params.address             - Board address without protocol
 * @param {string}  params.path                - Path to create
 * @param {boolean} [params.recursive = false] - Create sub-folders
 * @param {...any}  ...rest                    - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link COULD_NOT_CREATE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/edge/src/modules/utils/simpleshell/SimpleShell.cpp#L366
 *
 * @example
 * [EXAMPLE ../../examples/mkdir.js]
 */
export default function mkdir ({
  address = requiredParam('address'),
  path = requiredParam('path'),
  recursive = false,
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('path', path, ['string'])
  const params = {
    ...rest,
    address,
    path,
    recursive,
    command: `mkdir ${path}`
  }
  if (recursive) {
    return mkdirRecursive(params)
  }
  return command(params).then(response => {
    // throw an Error if somthing gose wrong
    if (response.text.startsWith('could not create')) {
      throw errorFactory({
        ...response,
        type: COULD_NOT_CREATE,
        message: `Could not create path [ ${path} ]`
      })
    }
    // allaways return the response
    response.data.paths = [ path ]
    return response
  })
}
