import { UNKNOWN_RESPONSE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/** @ignore */
function parse (response) {
  let text = response.text.trim()
  let parts = text.split('\n')
  let address = parts.shift()
  let gateway = parts.shift()
  let mask = parts.shift()
  let MAC = parts.shift()
  if (!address.startsWith('IP Addr: ')) {
    throw new Error(`Undefined IP address`)
  }
  if (!gateway.startsWith('IP GW: ')) {
    throw new Error(`Undefined network gateway`)
  }
  if (!mask.startsWith('IP mask: ')) {
    throw new Error(`Undefined network mask`)
  }
  if (!MAC.startsWith('MAC Address: ')) {
    throw new Error(`Undefined MAC address`)
  }
  return {
    address: address.slice(9),
    gateway: gateway.slice(7),
    mask: mask.slice(9),
    MAC: MAC.slice(13)
  }
}

/**
 * Send network command.
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
 * @see https://github.com/Smoothieware/Smoothieware/blob/edge/src/modules/utils/simpleshell/SimpleShell.cpp#L637
 * @see https://github.com/Smoothieware/Smoothieware/blob/d82d66f550ce6bdd7f33e8f4998ac6d963fd7376/src/libs/Network/uip/Network.cpp#L211
 *
 * @example
 * [EXAMPLE ../../examples/network.js]
 */
export default function network ({
  address = requiredParam('address'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  const params = {
    ...rest,
    address,
    command: 'net'
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
