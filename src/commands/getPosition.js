import { UNKNOWN_RESPONSE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Parse position string.
 * WCS : M114   - Last WCS.
 * WPOS: M114.1 - Realtime WCS.
 * MPOS: M114.2 - Realtime machine coordinate system.
 * APOS: M114.3 - Realtime actuator position.
 * LMS : M114.4 - Last milestone.
 * LMP : M114.5 - Last machine position.
 *  @ignore
 */
function parsePositionString (line) {
  let parts = line.toLowerCase().split(':')
  let key = parts.shift().replace(' ', '_')
  let coords = parts.join(':').trim().split(' ')
  let result = { key, coords: {} }
  coords.forEach(coord => {
    coord = coord.split(':')
    result.coords[coord[0]] = parseFloat(coord[1])
  })
  switch (key) {
    case 'last_c':
      result.command = 'M114'
      result.description = 'Position of all axes'
      break
    case 'realtime_wcs':
      result.command = 'M114.1'
      result.description = 'Real time position of all axes'
      break
    case 'mcs':
      result.command = 'M114.2'
      result.description = 'Real time machine position of all axes'
      break
    case 'apos':
      result.command = 'M114.3'
      result.description = 'Real time actuator position of all actuators'
      break
    case 'mp':
      result.command = 'M114.4'
      result.description = 'Last milestone'
      break
    case 'cmp':
      result.command = 'M114.5'
      result.description = 'Last machine position'
      break
    default:
      result.command = 'M114.?'
      result.description = 'Unknown type'
  }
  return result
}

/**
 * Send getPosition command.
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
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L856
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/robot/Robot.cpp#L360
 *
 * @example
 * [EXAMPLE ../../examples/getPosition.js]
 */
export default function getPosition ({
  address = requiredParam('address'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  const params = {
    ...rest,
    address,
    command: 'get pos'
  }
  return command(params).then(response => {
    // set data
    try {
      response.data = response.text.trim().split('\n').map(parsePositionString)
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
