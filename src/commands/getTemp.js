import { UNKNOWN_RESPONSE, NO_HEATERS_FOUND, UNKNOWN_DEVICE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/** @ignore */
function parseTempString (response, temp) {
  // T (57988) temp: inf/0.000000 @0
  let matches = temp.match(/(T|B) \(([0-9]+)\) temp: (inf|[0-9.]+)\/(inf|[0-9.]+) @([0-9]+)/)
  if (!matches) {
    throw errorFactory({
      ...response,
      type: UNKNOWN_RESPONSE,
      message: 'Unknown response'
    })
  }
  return {
    name: matches[1] === 'T' ? 'hotend' : 'bed',
    currentTemp: matches[3] === 'inf' ? 0 : parseFloat(matches[3]),
    targetTemp: parseFloat(matches[4]),
    pwm: parseInt(matches[5])
  }
}

/**
 * Send getTemp command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params                  - Params...
 * @param {String} params.address          - Board address without protocol
 * @param {String} [params.device = 'all'] - Device [ all, hotend, bed ]
 * @param {...any} ...rest                 - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link UNKNOWN_RESPONSE}
 * @throws {RequestError} {@link NO_HEATERS_FOUND}
 * @throws {RequestError} {@link UNKNOWN_DEVICE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/edge/src/modules/utils/simpleshell/SimpleShell.cpp#L783
 *
 * @example
 * [EXAMPLE ../../examples/getTemp.js]
 */
export default function getTemp ({
  address = requiredParam('address'),
  device = 'all',
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('device', device, ['string'])
  const params = {
    ...rest,
    address,
    device,
    command: 'get temp' + (device !== 'all' ? ` ${device}` : '')
  }
  return command(params).then(response => {
    // throw an Error if somthing gose wrong
    if (response.text.startsWith('no heaters found')) {
      throw errorFactory({
        ...response,
        type: NO_HEATERS_FOUND,
        message: 'No heaters found'
      })
    }
    if (response.text.trim().endsWith('is not a known temperature device')) {
      throw errorFactory({
        ...response,
        type: UNKNOWN_DEVICE,
        message: `Unknown device [ ${device} ]`
      })
    }
    if (device === 'all') {
      // [T (57988) temp: inf/0.000000 @0]
      response.data.devices = response.text.trim().split('\n').map(line => {
        return parseTempString(response, line)
      })
    } else {
      const line = response.text.trim()
        .replace(/^hotend/, 'T (0)')
        .replace(/^bed/, 'B (0)')
      response.data.devices = [ parseTempString(response, line) ]
    }
    // allaways return the response
    return response
  })
}
