import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send dfu command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params         - Params...
 * @param {String} params.address - Board address without protocol
 * @param {...any} ...rest        - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/edge/src/modules/utils/simpleshell/SimpleShell.cpp#L681
 *
 * @example
 * [EXAMPLE ../../examples/dfu.js]
 */
export default function dfu ({
  address = requiredParam('address'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  const params = {
    ...rest,
    address,
    command: 'dfu'
  }
  return command(params).then(response => {
    // allaways return the response
    response.data.message = response.text.trim()
    return response
  })
}
