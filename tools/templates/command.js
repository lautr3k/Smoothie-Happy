import { UNKNOWN_RESPONSE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send __dummyCommandName__ command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params         - Params...
 * @param {String} params.address - Board address without protocol
 * @param {...any} ...rest        - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link UNKNOWN_RESPONSE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#LXXX
 *
 * @example
 * [EXAMPLE ../../examples/__dummyCommandName__.js]
 */
export default function __dummyCommandName__ ({
  address = requiredParam('address'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  const params = {
    ...rest,
    address,
    command: '__dummyCommandName__'
  }
  return command(params).then(response => {
    // throw an Error if somthing gose wrong
    if (!response.text.length) {
      throw errorFactory({
        ...response,
        type: UNKNOWN_RESPONSE,
        message: 'Unknown response'
      })
    }
    // allaways return the response
    return response
  })
}
