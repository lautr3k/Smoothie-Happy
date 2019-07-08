import { errorFactory, responseFactory } from './factory.js'
import { requiredTypes } from '../utils'
import {
  REQUEST_OPEN,
  SERVER_ERROR,
  NETWORK_ERROR,
  REQUEST_ABORTED,
  REQUEST_TIMEOUT,
  PARALLEL_REQUEST
} from './error-types'

/** @external {XMLHttpRequest} https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest */
/** @external {ProgressEvent}  https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent  */
/** @external {Promise}        https://developer.mozilla.org/en-US/docs/Web/API/Promise        */

/**
 * True if a request is waiting for a response.
 * @type {Object}
 */
let sent = {}

/**
 * Test if a request is waiting for a response.
 * @param  {String} address
 * @return {Boolean}
 */
export function isSent (address) {
  return !!sent[address]
}

/**
 * Send a {@link XMLHttpRequest} request wrapped in a {@link Promise}.
 *
 * @param {Object}                    [params = {}]                    - Request params
 * @param {String}                    [params.method = 'POST']         - Request method
 * @param {String}                    [params.url = '/']               - Request URL
 * @param {null|String|Blob}          [params.data = null]             - Request data
 * @param {Number}                    [params.timeout = 0]             - Request timeout
 * @param {null|Array<Array<String>>} [params.headers = null]          - Array of [ key, val ]
 * @param {null|onUploadProgress}     [params.onUploadProgress = null] - On upload progress callback
 * @param {...any}                ...rest                              - Additional params
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @example
 * [EXAMPLE ../../examples/request.js]
 */
export default function request ({
  method = 'POST',
  url = '/',
  data = null,
  timeout = 0,
  headers = null,
  onUploadProgress = null,
  ...rest
} = {}) {
  requiredTypes('method', method, ['string'])
  requiredTypes('url', url, ['string'])
  requiredTypes('data', data, ['null', 'string', Blob])
  requiredTypes('timeout', timeout, ['number'])
  requiredTypes('headers', headers, ['null', 'array'])
  requiredTypes('onUploadProgress', onUploadProgress, ['null', 'function'])
  // force http protocol
  if (!url.startsWith('http://')) {
    url = `http://${url}`
  }
  // request params
  const params = {
    ...rest,
    method,
    url,
    data,
    timeout,
    headers,
    onUploadProgress
  }
  // create and return a Promise
  return new Promise((resolve, reject) => {
    // create http request object
    let xhr = new XMLHttpRequest()
    // extract address
    const matches = url.match(/http:\/\/([^/]+)/)
    const address = matches ? matches[1] : 'localhost'
    // open the request (async)
    try {
      xhr.open(method, url, true)
    } catch (e) {
      throw errorFactory({
        type: REQUEST_OPEN,
        message: e.message,
        params,
        xhr
      })
    }
    // set timeout
    xhr.timeout = timeout
    // set headers
    if (headers) {
      headers.forEach(([ key, val ]) => xhr.setRequestHeader(key, val))
    }
    // on ready state change
    xhr.onreadystatechange = function onReadyStateChange () {
      if (!xhr || xhr.readyState !== 4) return
      if (xhr.status === 0) return // => onError
      sent[address] = false
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(responseFactory({ params, xhr }))
      } else {
        reject(errorFactory({
          type: SERVER_ERROR,
          message: `Error ${xhr.status}`,
          params,
          xhr
        }))
      }
      xhr = null
    }
    // on network errors
    xhr.onerror = function onError () {
      sent[address] = false
      reject(errorFactory({
        type: NETWORK_ERROR,
        message: 'Network Error',
        params,
        xhr
      }))
      xhr = null
    }
    // on browser abord
    xhr.onabort = function onAbort () {
      if (!xhr) return
      sent[address] = false
      reject(errorFactory({
        type: REQUEST_ABORTED,
        message: 'Request aborted',
        params,
        xhr
      }))
      xhr = null
    }
    // on timeout
    xhr.ontimeout = function onTimeout () {
      sent[address] = false
      reject(errorFactory({
        type: REQUEST_TIMEOUT,
        message: `Timeout of ${timeout}ms exceeded`,
        params,
        xhr
      }))
      xhr = null
    }
    // on upload progress
    if (typeof onUploadProgress === 'function' && xhr.upload) {
      xhr.upload.addEventListener('progress', event => {
        if (!event.lengthComputable) return
        /**
         * @typedef  {Object}        progressPayload - Upload progress event
         * @property {Number}        total           - Total bytes
         * @property {Number}        loaded          - Loaded bytes
         * @property {Number}        percent         - Loaded bytes in percent
         * @property {ProgressEvent} event           - Original progress event
         */

        /**
         * @typedef {function(progress: progressPayload): void} onUploadProgress
         */
        onUploadProgress({
          event,
          total: event.total,
          loaded: event.loaded,
          percent: event.loaded / event.total * 100
        })
      })
    }
    // parallel request prohibited
    if (isSent(address)) {
      reject(errorFactory({
        type: PARALLEL_REQUEST,
        message: 'Parallel request prohibited. Please wait for the end of a request before sending another',
        params,
        xhr
      }))
      return
    }
    sent[address] = true
    // send request
    xhr.send(data)
  })
}
