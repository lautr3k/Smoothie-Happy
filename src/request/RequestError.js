import { FATAL_ERROR } from './error-types'

/**
 * Request Error.
 *
 * @extends {Error}
 */
export default class RequestError extends Error {
  /**
   * @param {Object}          params                    - Params...
   * @param {String}          params.message            - Error message
   * @param {responsePayload} params.response           - Response payload
   * @param {String}          [params.type=FATAL_ERROR] - Error type {@see ./src/request/error-types.js}
   */
  constructor ({ message, response, type = FATAL_ERROR }) {
    super(message)
    /** @property {String} type - Error type {@see ./src/request/error-types.js} */
    this.type = type
    /** @property {responsePayload} response - Response payload */
    this.response = response
    /** @ignore */
    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      /** @ignore */
      this.stack = (new Error(message)).stack
    }
  }
}
