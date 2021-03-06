import { INVALID_PARAMETERS } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send [ test circle <radius> <iterations> [feedrate] ] command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params                   - Params...
 * @param {String} params.address           - Board address without protocol
 * @param {Number} params.radius            - Circle radius
 * @param {Number} params.iterations        - Number of iterations
 * @param {Number} [params.feedrate = null] - Feedrate
 * @param {...any} ...rest                  - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link INVALID_PARAMETERS}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#LXXX
 *
 * @example
 * [EXAMPLE ../../examples/testCircle.js]
 */
export default function testCircle ({
  address = requiredParam('address'),
  radius = requiredParam('radius'),
  iterations = requiredParam('iterations'),
  feedrate = null,
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('radius', radius, ['number'])
  requiredTypes('iterations', iterations, ['number'])
  requiredTypes('feedrate', feedrate, ['null', 'number'])
  const params = {
    ...rest,
    address,
    radius,
    iterations,
    feedrate,
    command: `test circle ${radius} ${iterations} ${feedrate || ''}`
  }
  let millis = Date.now()
  return command(params).then(response => {
    let text = response.text.trim()
    // throw an Error if somthing gose wrong
    if (text.startsWith('error:')) {
      throw errorFactory({
        ...response,
        type: INVALID_PARAMETERS,
        message: 'Invalid parameters'
      })
    }
    // allaways return the response
    response.data = {
      millis: Date.now() - millis,
      gcode: text.split('\n').slice(0, -1)
    }
    return response
  })
}
