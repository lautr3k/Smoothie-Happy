import { UNKNOWN_RESPONSE, NO_HEATERS_FOUND, UNKNOWN_DEVICE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/** @ignore */
function parseTemp (line) {
  // single: bed temp: inf/0.000000 @0
  // all: T (57988) temp: inf/0.000000 @0
  let matches = line.match(/([^ ]+) (\(([0-9]+)\))? ?temp: (inf|[0-9.]+)\/(inf|[0-9.]+) @([0-9]+)/)
  if (!matches) {
    throw new Error('Unknown heater fingerprint')
  }
  let temp = {
    currentTemp: matches[4] === 'inf' ? Infinity : parseFloat(matches[4]),
    targetTemp: matches[5] === 'inf' ? Infinity : parseFloat(matches[5]),
    pwm: parseInt(matches[6])
  }
  // all
  if (matches[3]) {
    temp.id = parseInt(matches[3])
    temp.designator = matches[1]
  } else {
    temp.name = matches[1]
  }
  return temp
}

/** @ignore */
function parse (device, text) {
  let data = {}
  if (device === 'all') {
    data.devices = text.split('\n').map(line => {
      return parseTemp(line)
    })
  } else {
    data = parseTemp(text)
  }
  return data
}

/**
 * Send getTemp command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params                  - Params...
 * @param {String} params.address          - Board address without protocol
 * @param {String} [params.device = 'all'] - Device [ all, hotend, bed, ... ]
 * @param {...any} ...rest                 - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link UNKNOWN_RESPONSE}
 * @throws {RequestError} {@link NO_HEATERS_FOUND}
 * @throws {RequestError} {@link UNKNOWN_DEVICE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L783
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
    let text = response.text.trim()
    if (text.startsWith('no heaters found')) {
      throw errorFactory({
        ...response,
        type: NO_HEATERS_FOUND,
        message: 'No heaters found'
      })
    }
    if (text.endsWith('is not a known temperature device')) {
      throw errorFactory({
        ...response,
        type: UNKNOWN_DEVICE,
        message: `Unknown device [ ${device} ]`
      })
    }
    // set data
    try {
      response.data = parse(device, text)
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
