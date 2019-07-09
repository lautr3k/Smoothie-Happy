import { UNKNOWN_DEVICE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send setTemp command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params         - Params...
 * @param {String} params.address - Board address without protocol
 * @param {String} params.device  - Device [ hotend, bed, ... ]
 * @param {Number} params.value   - Target temperature
 * @param {...any} ...rest        - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link UNKNOWN_DEVICE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L897
 *
 * @example
 * [EXAMPLE ../../examples/setTemp.js]
 */
export default function setTemp ({
  address = requiredParam('address'),
  device = requiredParam('device'),
  value = requiredParam('value'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('device', device, ['string'])
  requiredTypes('value', value, ['number'])
  const params = {
    ...rest,
    address,
    device,
    value,
    command: `set_temp ${device} ${value}`
  }
  return command(params).then(response => {
    let text = response.text.trim()
    if (text.endsWith('is not a known temperature device')) {
      throw errorFactory({
        ...response,
        type: UNKNOWN_DEVICE,
        message: `Unknown device [ ${device} ]`
      })
    }
    // allaways return the response
    response.data = { device, value }
    return response
  })
}
