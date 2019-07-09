import {
  INVALID_PARAMETERS,
  UNDEFINED_SETTING,
  NOT_ENOUGH_SPACE,
  UNKNOWN_RESPONSE
} from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send [ config-set [source] <setting> <value> ] command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object}        params                 - Params...
 * @param {String}        params.address         - Board address without protocol
 * @param {String}        [params.source = 'sd'] - Where to read the value from, valid sources are ['local', 'sd', 'cache']
 * @param {String}        params.setting         - Which setting should be set
 * @param {Number|String} params.value           - New value
 * @param {...any}        ...rest                - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link INVALID_PARAMETERS}
 * @throws {RequestError} {@link UNDEFINED_SETTING}
 * @throws {RequestError} {@link NOT_ENOUGH_SPACE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L277
 * @see https://github.com/Smoothieware/Smoothieware/blob/0faa088fe1a2207f6c0b99ec7abccfbd1162f730/src/modules/utils/configurator/Configurator.cpp#L68
 *
 * @example
 * [EXAMPLE ../../examples/setConfig.js]
 */
export default function setConfig ({
  address = requiredParam('address'),
  setting = requiredParam('setting'),
  value = requiredParam('value'),
  source = 'sd',
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('source', source, ['null', 'string'])
  requiredTypes('setting', setting, ['string'])
  requiredTypes('value', value, ['number', 'string'])
  source = source || 'cache'
  const params = {
    ...rest,
    address,
    source,
    setting,
    value,
    command: `config-set ${source === 'cache' ? '' : `${source} `}${setting} ${value}`
  }
  return command(params).then(response => {
    let text = response.text.trim()
    // throw an Error if somthing gose wrong
    if (text.endsWith('source does not exist')) {
      throw errorFactory({
        ...response,
        type: UNDEFINED_SETTING,
        message: `Undefined source [ ${source} ]`
      })
    }
    if (text.startsWith('Usage:')) {
      throw errorFactory({
        ...response,
        type: INVALID_PARAMETERS,
        message: 'Invalid parameters'
      })
    }
    if (text.endsWith('not enough space to overwrite existing key/value')) {
      throw errorFactory({
        ...response,
        type: NOT_ENOUGH_SPACE,
        message: `Not enough space to overwrite [ ${source}:${setting} ]`
      })
    }
    // parse response
    let matches = text.match(/([^:]+): ([^ ]+) has been set to (.+)/)
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
