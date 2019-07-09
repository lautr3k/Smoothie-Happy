import { UNKNOWN_RESPONSE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/** @ignore */
const states = ['Alarm', 'Home', 'Hold', 'Idle', 'Run']

/** @ignore */
const axisLabels = ['x', 'y', 'z', 'a', 'b', 'c']

/** @ignore */
const feedrateLabels = ['current', 'requested', 'override']

/** @ignore */
function parseNumber (value, labels) {
  let ret = {}
  value.match(/[0-9.]+/g).forEach((val, key) => {
    ret[labels[key]] = parseFloat(val)
  })
  return ret
}

/** @ignore */
function parseHeater (value) {
  let matches = value.match(/([^:]+):(inf|[0-9.]+),(inf|[0-9.]+)/)
  if (!matches) {
    throw new Error(`Undefined heater`)
  }
  return {
    designator: matches[1],
    currentTemp: matches[2] === 'inf' ? Infinity : parseFloat(matches[2]),
    targetTemp: matches[3] === 'inf' ? Infinity : parseFloat(matches[3])
  }
}

/** @ignore */
function parse (response) {
  let status = {}
  let text = response.text.trim().slice(1, -1)
  let parts = text.split('|')
  let state = parts.shift()
  let mpos = parts.shift()
  let wpos = parts.shift()
  let feedrate = parts.shift()
  if (!states.includes(state)) {
    throw new Error(`Unknown state [ ${state} ]`)
  }
  if (!mpos.startsWith('MPos:')) {
    throw new Error(`Undefined machine position`)
  }
  if (!wpos.startsWith('WPos:')) {
    throw new Error(`Undefined workspace position`)
  }
  if (!feedrate.startsWith('F:')) {
    throw new Error(`Undefined feedrate`)
  }
  status.state = state
  status.idle = state === 'Idle'
  status.alarm = state === 'Alarm'
  status.homming = state === 'Home'
  status.holding = state === 'Hold'
  status.running = ['Home', 'Run'].includes(state)
  status.machine = parseNumber(mpos, axisLabels)
  status.workspace = parseNumber(wpos, axisLabels)
  status.feedrate = parseNumber(feedrate, feedrateLabels)
  // laser module ?
  if (status.running && parts[0].startsWith('L:') && parts[1].startsWith('S:')) {
    status.laser = {
      power: parseFloat(parts.shift().slice(2)),
      sValue: parseFloat(parts.shift().slice(2))
    }
  }
  // any parts left is a heater
  status.heaters = []
  parts.forEach(heater => {
    status.heaters.push(parseHeater(heater))
  })
  // return status
  return status
}

/**
 * Send getStatus command.
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
 * @see https://github.com/Smoothieware/Smoothieware/blob/edge/src/modules/utils/simpleshell/SimpleShell.cpp#L887
 * @see https://github.com/Smoothieware/Smoothieware/blob/edge/src/libs/Kernel.cpp#L176
 *
 * @example
 * [EXAMPLE ../../examples/getStatus.js]
 */
export default function getStatus ({
  address = requiredParam('address'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  const params = {
    ...rest,
    address,
    command: 'get status'
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
