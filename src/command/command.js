import { UNSUPPORTED_COMMAND } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import post from '../request/post'

/**
 * Send arbitrary command.
 *
 * - The [ method, url, data ] params can not be overwritten.
 * - See {@link post} and {@link request} for more details.
 *
 * @param  {Object} params         - Params...
 * @param  {String} params.address - Board address without protocol
 * @param  {String} params.command - Command without trailing LF char
 * @param  {...any} ...rest        - Optional params passed to {@link post} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @example
 * [EXAMPLE ../../examples/command.js]
 */
export default function command ({
  address = requiredParam('address'),
  command = requiredParam('command'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('command', command, ['string'])
  const params = {
    ...rest,
    command,
    url: `http://${address}/command`,
    data: `${command}\n`
  }
  return post(params).then(response => {
    if (response.text.startsWith('error:Unsupported command')) {
      throw errorFactory({
        ...response,
        type: UNSUPPORTED_COMMAND,
        message: `Unsupported command [ ${command} ]`
      })
    }
    return response
  })
}
