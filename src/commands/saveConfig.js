import { UNKNOWN_RESPONSE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send [ save [file] ] command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params               - Params...
 * @param {String} params.address       - Board address without protocol
 * @param {String} [params.file = null] - File path (default '/sd/config-override')
 * @param {...any} ...rest              - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link UNKNOWN_RESPONSE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L563
 *
 * @example
 * [EXAMPLE ../../examples/saveConfig.js]
 */
export default function saveConfig ({
  address = requiredParam('address'),
  file = null,
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('file', file, ['null', 'string'])
  const params = {
    ...rest,
    address,
    command: `save ${file || ''}`
  }
  return command(params).then(response => {
    let text = response.text.trim()
    if (!text.startsWith('Settings Stored to ')) {
      throw errorFactory({
        ...response,
        type: UNKNOWN_RESPONSE,
        message: `Unknown response`
      })
    }
    // allaways return the response
    response.data = { file: text.slice(19) }
    return response
  })
}
