import { FILE_NOT_FOUND } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/**
 * Send [ md5sum <file> ] command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params         - Params...
 * @param {String} params.address - Board address without protocol
 * @param {String} params.file    - File path
 * @param {...any} ...rest        - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link FILE_NOT_FOUND}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L1009
 *
 * @example
 * [EXAMPLE ../../examples/md5sum.js]
 */
export default function md5sum ({
  address = requiredParam('address'),
  file = requiredParam('file'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('file', file, ['string'])
  const params = {
    ...rest,
    address,
    file,
    command: `md5sum ${file}`
  }
  return command(params).then(response => {
    let text = response.text.trim()
    // throw an Error if somthing gose wrong
    if (text.startsWith('File not found:')) {
      throw errorFactory({
        ...response,
        type: FILE_NOT_FOUND,
        message: `File not found [ ${file} ]`
      })
    }
    let parts = text.split(' ')
    response.data = {
      file,
      hash: parts[0]
    }
    // allaways return the response
    return response
  })
}
