import { COULD_NOT_RENAME } from './error-types'
import { errorFactory } from '../request/factory'
import { normalizePath, requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send [ mv <source> <target> ] command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params         - Params...
 * @param {String} params.address - Board address without protocol
 * @param {String} params.source  - Source file
 * @param {String} params.target  - Target file
 * @param {...any} ...rest        - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link COULD_NOT_RENAME}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L356
 *
 * @example
 * [EXAMPLE ../../examples/mv.js]
 */
export default function mv ({
  address = requiredParam('address'),
  source = requiredParam('source'),
  target = requiredParam('target'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('source', source, ['string'])
  requiredTypes('target', target, ['string'])
  source = '/' + normalizePath(source)
  target = '/' + normalizePath(target)
  const params = {
    ...rest,
    address,
    source,
    target,
    command: `mv ${source} ${target}`
  }
  return command(params).then(response => {
    // throw an Error if somthing gose wrong
    if (response.text.startsWith('Could not rename')) {
      throw errorFactory({
        ...response,
        type: COULD_NOT_RENAME,
        message: `Could not rename [ ${source} ] to [ ${target} ]`
      })
    }
    // allaways return the response
    response.data = { source, target }
    return response
  })
}
