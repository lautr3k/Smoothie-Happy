import { UNKNOWN_RESPONSE } from '../command/error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send __dummyCommandName__ command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param  {Object} params         - Params...
 * @param  {String} params.address - Board address without protocol
 * @param  {...any} ...rest        - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link UNKNOWN_RESPONSE}
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
