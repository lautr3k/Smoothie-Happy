import { UNKNOWN_RESPONSE } from '../command/error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send kinematics (ik|fk) command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object}  params                    - Params...
 * @param {String}  params.address            - Board address without protocol
 * @param {Number}  [params.type = 'forward'] - Kinematics type [ inverse, forward ]
 * @param {Number}  params.x                  - X position
 * @param {Number}  [params.y = null]         - Y position, or X if null
 * @param {Number}  [params.z = null]         - Z position, or Y if null
 * @param {boolean} [params.move = false]     - Move to the calculated, or given, XYZ
 * @param {...any}  ...rest                   - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link UNKNOWN_RESPONSE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/edge/src/modules/utils/simpleshell/SimpleShell.cpp#L809
 *
 * @example
 * [EXAMPLE ../../examples/kinematics.js]
 */
export default function kinematics ({
  address = requiredParam('address'),
  type = 'forward',
  x = requiredParam('x'),
  y = null,
  z = null,
  move = false,
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('type', type, ['string'])
  requiredTypes('x', x, ['number'])
  requiredTypes('y', y, ['null', 'number'])
  requiredTypes('z', z, ['null', 'number'])
  requiredTypes('move', move, ['boolean'])
  const coords = [x, y, z].filter(c => c).join(',')
  const params = {
    ...rest,
    address,
    type,
    x,
    y,
    z,
    move,
    command: `get ${type === 'forward' ? 'fk' : 'ik'} ${move ? '-m ' : ''}${coords}`
  }
  return command(params).then(response => {
    const matches = response.text.match(/X ([0-9.]+), Y ([0-9.]+), Z ([0-9.]+)/)
    // throw an Error if somthing gose wrong
    if (!matches) {
      throw errorFactory({
        ...response,
        type: UNKNOWN_RESPONSE,
        message: 'Unknown response'
      })
    }
    // set response data
    response.data = {
      type,
      move,
      x: parseFloat(matches[1]),
      y: parseFloat(matches[2]),
      z: parseFloat(matches[3])
    }
    // allaways return the response
    return response
  })
}
