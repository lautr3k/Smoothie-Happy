import { UNKNOWN_RESPONSE } from '../command/error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/** @ignore */
function parse (response) {
  let lines = response.text.trim().split('\n')
  lines = lines.map(line => line.slice(1, -1))
  let wcs = {
    current: lines.shift().split(': ').pop()
  }
  lines.forEach(line => {
    let parts = line.split(':')
    let code = parts.shift().toUpperCase()
    let coords = parts.shift().split(',')
    if (code === 'TOOL OFFSET') {
      code = 'tool'
    } else if (code === 'PRB') {
      code = 'prob'
    }
    wcs[code] = {
      x: parseFloat(coords[0]),
      y: parseFloat(coords[1]),
      z: parseFloat(coords[2])
    }
  })
  return wcs
}

/**
 * Send getWCS command.
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
 * @example
 * [EXAMPLE ../../examples/getWCS.js]
 */
export default function getWCS ({
  address = requiredParam('address'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  const params = {
    ...rest,
    address,
    command: 'get wcs'
  }
  return command(params).then(response => {
    // set data
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