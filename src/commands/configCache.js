import { INVALID_PARAMETERS } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send [ config-load ] command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object}             params                - Params...
 * @param {String}             params.address        - Board address without protocol
 * @param {String}             params.option         - One of [load, unload, dump, checksum]
 * @param {null|Number|String} [params.value = null] - Value for checksum
 * @param {...any}             ...rest               - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link INVALID_PARAMETERS}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L280
 * @see https://github.com/Smoothieware/Smoothieware/blob/0faa088fe1a2207f6c0b99ec7abccfbd1162f730/src/modules/utils/configurator/Configurator.cpp
 *
 * @example
 * [EXAMPLE ../../examples/configCache.js]
 */
export default function configCache ({
  address = requiredParam('address'),
  option = requiredParam('option'),
  value = ((option === 'checksum') && requiredParam('value')) || null,
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('option', option, ['string'])
  requiredTypes('value', value, ['null', 'number', 'string'])
  const params = {
    ...rest,
    address,
    option,
    value,
    command: `config-load ${option} ${value}`
  }
  return command(params).then(response => {
    let text = response.text.trim()
    // throw an Error if somthing gose wrong
    if (text.startsWith('unsupported option:')) {
      throw errorFactory({
        ...response,
        type: INVALID_PARAMETERS,
        message: `Invalid option [ ${option} ]`
      })
    }
    // set data
    if (option === 'dump') {
      response.data = { dump: text }
    } else if (option === 'checksum') {
      let parts = text.slice(11).split('=')
      response.data = {
        value: parts[0].trim(),
        checksum: parts[1].trim()
      }
    } else {
      response.data = { message: text }
    }
    // allaways return the response
    return response
  })
}
