import { UNKNOWN_DEVICE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send setSwitch command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object}  params         - Params...
 * @param {String}  params.address - Board address without protocol
 * @param {String}  params.name    - Switch name
 * @param {boolean} params.value   - Switch value
 * @param {...any}  ...rest        - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link UNKNOWN_DEVICE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/edge/src/modules/utils/simpleshell/SimpleShell.cpp#L957
 *
 * @example
 * [EXAMPLE ../../examples/setSwitch.js]
 */
export default function setSwitch ({
  address = requiredParam('address'),
  name = requiredParam('name'),
  value = requiredParam('value'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('name', name, ['string'])
  requiredTypes('value', value, ['boolean'])
  const params = {
    ...rest,
    address,
    name,
    value,
    command: `switch ${name} ${value ? 'on' : 'off'}`
  }
  return command(params).then(response => {
    let text = response.text.trim()
    if (text.endsWith('is not a known switch device')) {
      throw errorFactory({
        ...response,
        type: UNKNOWN_DEVICE,
        message: `Unknown switch [ ${name} ]`
      })
    }
    // allaways return the response
    response.data = { name, value }
    return response
  })
}
