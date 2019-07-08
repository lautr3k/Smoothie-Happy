import { COULD_NOT_CREATE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send mkdir command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params         - Params...
 * @param {String} params.address - Board address without protocol
 * @param {string} params.path    - Path to create
 * @param {...any} ...rest        - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link COULD_NOT_CREATE}
 *
 * @example
 * [EXAMPLE ../../examples/mkdir.js]
 */
export default function mkdir ({
  address = requiredParam('address'),
  path = requiredParam('path'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('path', path, ['string'])
  const params = {
    ...rest,
    address,
    path,
    command: `mkdir ${path}`
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
    response.data.path = path
    return response
  })
}
