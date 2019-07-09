import { ERROR_404 } from '../request/error-types'
import { FILE_NOT_FOUND } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes, normalizePath } from '../utils'
import get from '../request/get'

/**
 * Send [ cat <file> ] command.
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
 * @note cat is too slow, use get request a la place
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L396
 *
 * @example
 * [EXAMPLE ../../examples/cat.js]
 */
export default function cat ({
  address = requiredParam('address'),
  file = requiredParam('file'),
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('file', file, ['string'])
  file = '/' + normalizePath(file)
  const params = {
    ...rest,
    address,
    file,
    command: `cat ${file}`
  }
  return new Promise((resolve, reject) => {
    // cat is too slow, use get a la place
    get({
      ...params,
      url: `http://${params.address}${file}`
    })
      .then(response => {
        response.data.text = response.text
        resolve(response)
      })
      .catch(error => {
        if (error.type === ERROR_404) {
          error = errorFactory({
            ...error.response,
            type: FILE_NOT_FOUND,
            message: `File not found [ ${file} ]`
          })
        }
        reject(error)
      })
  })
}
