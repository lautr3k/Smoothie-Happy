import { UNKNOWN_RESPONSE, INVALID_PARAMETERS } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/** @ignore */
function parse (response) {
  let lines = response.text.trim().split('\n')
  const coefficients = lines.shift()
  const message = lines.shift()
  // Steinhart Hart coefficients:  I0.000722376862540841 J0.000216302098124288 K0.000000092640163984
  // Paste the above in the M305 S0 command, then save with M500
  const matches = coefficients.match(/[IJK][0-9.]+/g)
  if (!matches || !coefficients.startsWith('Steinhart Hart coefficients:')) {
    throw new Error('Unknown response')
  }
  return {
    message: message.trim(),
    I: matches[0].slice(1),
    J: matches[1].slice(1),
    K: matches[2].slice(1)
  }
}

/**
 * Send [ calc_thermistor [-s0] <T1,R1,T2,R2,T3,R3> ] command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object}        params               - Params...
 * @param {String}        params.address       - Board address without protocol
 * @param {Array<Number>} params.values        - Values for [T1,R1,T2,R2,T3,R3]
 * @param {null|Number}   [params.save = null] - Save the results to thermistor n
 * @param {...any}        ...rest              - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link UNKNOWN_RESPONSE}
 * @throws {RequestError} {@link INVALID_PARAMETERS}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L918
 *
 * @example
 * [EXAMPLE ../../examples/calculateThermistor.js]
 */
export default function calculateThermistor ({
  address = requiredParam('address'),
  values = requiredParam('values'),
  save = null,
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('values', values, ['array'])
  requiredTypes('save', save, ['null', 'number'])
  let s = save !== null ? `-s${save} ` : ''
  const params = {
    ...rest,
    address,
    values,
    save,
    command: `calc_thermistor ${s}${values.join(',')}`
  }
  return command(params).then(response => {
    let text = response.text.trim()
    // throw an Error if somthing gose wrong
    if (text.startsWith('Usage: ')) {
      throw errorFactory({
        ...response,
        type: INVALID_PARAMETERS,
        message: 'Invalid parameters'
      })
    }
    try {
      response.data = parse(response)
    } catch (e) {
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
