import { UNKNOWN_RESPONSE, UNKNOWN_DEVICE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/** @ignore */
function parse (name, text) {
  if (!text.length) {
    throw new Error('Empty response')
  }
  let matches = text.match(new RegExp(`switch ${name} is ([0-1])`))
  if (!matches) {
    throw new Error('Unknown response')
  }
  return { name, value: !!parseInt(matches[1]) }
}

/**
 * Send getSwitch command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params         - Params...
 * @param {String} params.address - Board address without protocol
 * @param {String} params.name    - Switch name
 * @param {...any} ...rest        - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link UNKNOWN_DEVICE}
 * @throws {RequestError} {@link UNKNOWN_RESPONSE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L957
 *
 * @example
 * [EXAMPLE ../../examples/getSwitch.js]
 */
export default function getSwitch ({
  address = requiredParam('address'),
  name = requiredParam('name'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('name', name, ['string'])
  const params = {
    ...rest,
    address,
    name,
    command: `switch ${name}`
  }
  return command(params).then(response => {
    let text = response.text.trim()
    if (text.startsWith('unknown switch')) {
      throw errorFactory({
        ...response,
        type: UNKNOWN_DEVICE,
        message: `Unknown switch [ ${name} ]`
      })
    }
    try {
      response.data = parse(name, text)
    } catch (error) {
      throw errorFactory({
        ...response,
        type: UNKNOWN_RESPONSE,
        message: error.message
      })
    }
    // allaways return the response
    return response
  })
}
