import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send mri (break) command.
 *
 * - NOTE: this command allaways throw a REQUEST_TIMEOUT RequestError
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params         - Params...
 * @param {String} params.address - Board address without protocol
 * @param {...any} ...rest        - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L688
 *
 * @example
 * [EXAMPLE ../../examples/mri.js]
 */
export default function mri ({
  address = requiredParam('address'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  const params = {
    ...rest,
    address,
    command: 'break'
  }
  return command(params).then(response => {
    // allaways return the response
    response.data.message = response.text.trim()
    return response
  })
}
