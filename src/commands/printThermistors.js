import { UNKNOWN_RESPONSE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/** @ignore */
function parse (response) {
  let text = response.text.trim()
  let lines = text.split('\n')
  if (!text.startsWith('S/H table')) {
    throw new Error('Unknown response')
  }
  lines.shift()
  let table = []
  let beta = []
  let pointer = table
  lines.forEach(line => {
    if (line.startsWith('Beta table')) {
      pointer = beta
      return
    }
    let parts = line.split('-')
    pointer.push({ id: parseInt(parts[0].trim()), name: parts[1].trim() })
  })
  return { table, beta }
}

/**
 * Send [ thermistors ] command.
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
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L911
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/tools/temperaturecontrol/Thermistor.cpp#L186
 *
 * @example
 * [EXAMPLE ../../examples/printThermistors.js]
 */
export default function printThermistors ({
  address = requiredParam('address'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  const params = {
    ...rest,
    address,
    command: 'thermistors'
  }
  return command(params).then(response => {
    try {
      response.data = parse(response)
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
