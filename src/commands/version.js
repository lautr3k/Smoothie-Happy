import { UNKNOWN_RESPONSE } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send version command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param  {Object} params         - Params...
 * @param  {String} params.address - Board address without protocol
 * @param  {...any} ...rest        - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link UNKNOWN_RESPONSE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L652
 *
 * @example
 * [EXAMPLE ../../examples/version.js]
 */
export default function version ({
  address = requiredParam('address'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  const params = {
    ...rest,
    address,
    command: 'version'
  }
  return command(params).then(response => {
    // version pattern
    const pattern = /Build version: ([^,]+), Build date: ([^,]+), MCU: ([^,]+), System Clock: ([^\n]+)\n(([0-5]) axis\n)?/m
    // test the pattern
    const matches = response.text.match(pattern)
    // throw an Error if somthing gose wrong
    if (!matches) {
      throw errorFactory({
        ...response,
        type: UNKNOWN_RESPONSE,
        message: 'Unknown response'
      })
    }
    // split branch-hash on dash
    const branch = matches[1].split('-')
    // set some data
    response.data = {
      branch: branch[0].trim(),
      hash: branch[1].trim(),
      date: matches[2].trim(),
      mcu: matches[3].trim(),
      clock: matches[4].trim()
    }
    // axis ?
    if (matches[5]) {
      response.data.axis = parseInt(matches[6])
    }
    // allaways return the response
    return response
  })
}
