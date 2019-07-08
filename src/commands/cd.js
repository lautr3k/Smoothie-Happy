import { COULD_NOT_OPEN_PATH } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send cd command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param  {Object} params         - Params...
 * @param  {String} params.address - Board address without protocol
 * @param {string}  params.path    - Path to set
 * @param  {...any} ...rest        - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link COULD_NOT_OPEN_PATH}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/edge/src/modules/utils/simpleshell/SimpleShell.cpp#L375
 *
 * @example
 * [EXAMPLE ../../examples/cd.js]
 */
export default function cd ({
  address = requiredParam('address'),
  path = requiredParam('path'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  const params = {
    ...rest,
    address,
    path,
    command: `cd ${path}`
  }
  return command(params).then(response => {
    // file not found or not empty folder
    if (response.text.startsWith('Could not open')) {
      // set an Error if somthing gose wrong
      throw errorFactory({
        ...response,
        type: COULD_NOT_OPEN_PATH,
        message: `Could not open [ ${path} ]`
      })
    }
    response.data.path = path
    // allaways return the response
    return response
  })
}
