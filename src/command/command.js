import { PARALLEL_COMMANDS, UNSUPPORTED_COMMAND } from './error-types'
import { errorFactory } from '../request/factory'
import post from '../request/post'

/**
 * True if a command is waiting for a response.
 * @type {Object}
 */
let sent = {}

/**
 * Test if a command is waiting for a response.
 * @param  {String} address
 * @return {Boolean}
 */
export function isSent (address) {
  return !!sent[address]
}

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
  address,
  command,
  ...rest
} = {}) {
  return new Promise(function (resolve, reject) {
    const params = {
      ...rest,
      command,
      url: `http://${address}/command`,
      data: `${command}\n`
    }
    if (isSent(address)) {
      reject(errorFactory({
        type: PARALLEL_COMMANDS,
        message: 'Parallel commands prohibited. Please wait for the end of a command before sending another',
        params,
        xhr: null
      }))
      return
    }
    sent[address] = true
    post(params).then(response => {
      sent[address] = false
      if (response.text.startsWith('error:Unsupported command')) {
        throw errorFactory({
          ...response,
          type: UNSUPPORTED_COMMAND,
          message: `Unsupported command [ ${command} ]`
        })
      }
      resolve(response)
    })
      .catch(error => {
        sent[address] = false
        reject(error)
      })
  })
}
