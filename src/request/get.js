import request from './request'

/**
 * Send GET request.
 *
 * - The [ method ] param can not be overwritten.
 * - See {@link request} for more details.
 *
 * @param  {Object} params - Request params, see {@link request}
 *
 * @return {Promise<responsePayload|RequestError>}
 */
export default function get (params = {}) {
  return request({ ...params, method: 'GET' })
}
