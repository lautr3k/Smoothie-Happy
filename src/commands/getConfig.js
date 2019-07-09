import { UNDEFINED_SETTING, UNKNOWN_RESPONSE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send [ config-get [source] <setting> ] command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params                 - Params...
 * @param {String} params.address         - Board address without protocol
 * @param {String} [params.source = 'sd'] - Where to read the value from, valid sources are ['local', 'sd', 'cache']
 * @param {String} params.setting         - Which setting should be read
 * @param {...any} ...rest                - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link UNDEFINED_SETTING}
 * @throws {RequestError} {@link UNKNOWN_RESPONSE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L274
 * @see https://github.com/Smoothieware/Smoothieware/blob/0faa088fe1a2207f6c0b99ec7abccfbd1162f730/src/modules/utils/configurator/Configurator.cpp#L30
 *
 * @example
 * [EXAMPLE ../../examples/getConfig.js]
 */
export default function getConfig ({
  address = requiredParam('address'),
  setting = requiredParam('setting'),
  source = 'sd',
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('source', source, ['null', 'string'])
  requiredTypes('setting', setting, ['string'])
  source = source || 'cache'
  const params = {
    ...rest,
    address,
    source,
    setting,
    command: `config-get ${source === 'cache' ? '' : `${source} `}${setting}`
  }
  return command(params).then(response => {
    let text = response.text.trim()
    // throw an Error if somthing gose wrong
    if (!text.length) {
      throw errorFactory({
        ...response,
        type: UNDEFINED_SETTING,
        message: `Undefined source [ ${source} ]`
      })
    }
    if (text.endsWith('is not in config')) {
      throw errorFactory({
        ...response,
        type: UNDEFINED_SETTING,
        message: `Undefined setting [ ${source}:${setting} ]`
      })
    }
    // parse response
    let matches = text.match(/([^:]+): ([^ ]+) is set to (.+)/)
    if (!matches) {
      throw errorFactory({
        ...response,
        type: UNKNOWN_RESPONSE,
        message: 'Unknown response'
      })
    }
    // set data
    response.data = { source, setting, value: matches[3] }
    // allaways return the response
    return response
  })
}
