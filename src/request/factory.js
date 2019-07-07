import RequestError from './RequestError'

/**
 * Response factory.
 *
 * @param {Object} params        - Params...
 * @param {Object} params.params - Request params
 * @param {Object} params.xhr    - Original XHR object
 *
 * @return {responsePayload}
 */
export function responseFactory ({ params, xhr }) {
  /**
   * @typedef  {Object}         responsePayload - Request payload
   * @property {String}         text            - Response text
   * @property {Object}         data            - Response data
   * @property {Object}         params          - Request params
   * @property {XMLHttpRequest} xhr             - Original XMLHttpRequest
   */
  return {
    xhr,
    params,
    data: {},
    text: xhr ? xhr.responseText : ''
  }
}

/**
 * Error factory.
 *
 * @param {Object} params         - Params...
 * @param {String} params.type    - Error type
 * @param {String} params.message - Error message
 * @param {Object} params.params  - Request params
 * @param {Object} params.xhr     - Original XHR object
 *
 * @return {RequestError}
 */
export function errorFactory ({ type, message, params, xhr }) {
  return new RequestError({
    type,
    message,
    response: responseFactory({ params, xhr })
  })
}
