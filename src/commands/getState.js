import { UNKNOWN_RESPONSE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/** @ignore */
function parse (response) {
  let state = response.text.trim().slice(1, -1).split(' ')
  return {
    modal: state[0],
    wcs: state[1],
    planeSelection: state[2],
    unit: state[3],
    distanceMode: state[4],
    pathControl: state[5],
    programPause: state[6],
    stopTool: state[7],
    stopCoolant: state[8],
    tool: state[9],
    feedRate: state[10],
    sValue: state[11]
  }
}

/**
 * Send [ get state ] command.
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
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L870
 *
 * @example
 * [EXAMPLE ../../examples/getState.js]
 */
export default function getState ({
  address = requiredParam('address'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  const params = {
    ...rest,
    address,
    command: 'get state'
  }
  return command(params).then(response => {
    // set data
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
