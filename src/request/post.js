import request from './request'

/**
 * Send POST request.
 *
 * - The [ method ] param can not be overwritten.
 * - See {@link request} for more details.
 *
 * @param  {Object} params - Request params, see {@link request}
 *
 * @return {Promise<responsePayload|RequestError>}
 */
export default function post (params = {}) {
  return request({ ...params, method: 'POST' })
}
