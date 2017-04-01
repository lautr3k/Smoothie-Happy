import uuid from 'uuid/v4'
import { settings as defaults } from './settings'
import * as eventTypes from './event/types'
import RequestEvent from './event/request'
import Progress from './payload/progress'
import Response from './payload/response'
import Attempt from './payload/attempt'

/**
* `XMLHttpRequest` wrapper with `Promise` logic.
*
* @example
* function on(event) {
*   console.info('on:', event.type, event);
* }
*
* new Request({
*   url   : 'http://192.168.1.102/command',
*   method: 'POST',
*   data  : 'version\n',
*   on    : {
*     'before.retry'     : on,
*     'retry'            : on,
*     'retry.limit'      : on,
*
*     'download.load'    : on,
*     'download.error'   : on,
*     'download.abort'   : on,
*     'download.timeout' : on,
*     'download.progress': on,
*
*     'upload.load'      : on,
*     'upload.error'     : on,
*     'upload.abort'     : on,
*     'upload.timeout'   : on,
*     'upload.progress'  : on
*   },
*   filters: {
*     status  : status => status === 200,
*     response: response => JSON.stringify(response)
*   }
* })
* .send()
* .then(event => {
*   console.info('then:', event);
* })
* .catch(event => {
*   console.error('catch:', event);
* });
*
* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
* @see https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
*/
class Request {
  /**
  * Encode data object to uri string `key_1=value_1&key_2=value_2`.
  *
  * @param  {Object} data
  * @return {Object}
  */
  static encodeData(data) {
    // no data
    if (data) {
      // stringify data object
      if (typeof data === 'object') {
        data = Object.keys(data).map(key => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
        }).join('&')
      }

      // remove the first char if it is an '?'
      if (data.startsWith('?')) {
        data = data.substr(1)
      }
    }

    return data
  }

  /**
  * Join data to url.
  *
  * @param  {String}        url
  * @param  {String|Object} data
  * @return {String}
  */
  static joinUrlData(url, data) {
    return url + (url.indexOf('?') === -1 ? '?' : '&') + Request.encodeData(data)
  }

  /**
  * @param {Object} settings See {@link src/http/request/settings.js~settings} for defaults keys/values.
  */
  constructor(settings = {}) {
    /**
    * Request settings, see {@link src/http/request/settings.js~settings} for defaults keys/values.
    * @type {Object}
    * @protected
    */
    this.settings = Object.assign({}, defaults, settings)

    /**
    * Unique identifier (uuid/v4).
    * @type {String}
    * @protected
    */
    this.uuid = uuid()

    /**
    * Creation time.
    * @type {Integer}
    * @protected
    */
    this.time = Date.now()

    /**
    * Send time.
    * @type {Integer}
    * @protected
    */
    this.sendTime = null

    /**
    * Elapsed time.
    * @type {Integer}
    * @protected
    */
    this.elapsedTime = null

    /**
    * Number of attempts.
    * @type {Integer}
    * @protected
    */
    this.attempts = 0

    /**
    * `XMLHttpRequest` instance.
    * @type {XMLHttpRequest}
    * @protected
    */
    this.xhr = null
  }

  /**
  * Trigger an user defined event.
  *
  * @throws {Error}
  */
  _triggerEvent(event) {
    if (typeof this.settings.on[event.type] === 'function') {
      this.settings.on[event.type](event)
    }
  }

  /**
  * Send the request and return a Promise.
  *
  * @return {Promise}
  * @throws {Error}
  */
  _send() {
    // prevent calling twice
    if (this.xhr) {
      throw new Error('You can not send the same request twice.')
    }

    // increment attempts counter
    this.attempts++

    // set send time
    this.sendTime = Date.now()

    // local settings
    let settings = Object.assign({}, this.settings)

    // normalize settings
    settings.url    = settings.url.trim()
    settings.method = settings.method.toUpperCase()
    settings.data   = Request.encodeData(settings.data)

    if (settings.method !== 'POST' && settings.data) {
      // append data to uri and reset data
      settings.url  = Request.joinUrlData(settings.url, settings.data)
      settings.data = null
    }

    // wrap the request in promise
    return new Promise((resolve, reject) => {
      // create http request object
      this.xhr = new XMLHttpRequest()

      // override mime type
      this.xhr.overrideMimeType(settings.mimeType)

      // open async request
      this.xhr.open(settings.method, settings.url, true)

      // status
      let rejected = false

      // create, trigger and return an RequestEvent
      let createEvent = (type, event, payload = null) => {
        let requestEvent = new RequestEvent(type, event, this, payload)
        ! rejected && this._triggerEvent(requestEvent)
        return requestEvent
      }

      // on abort, error, timeout
      let _reject = (type, event, error) => {
        this.elapsedTime = Date.now() - this.sendTime
        reject(createEvent(type, event, error instanceof Error ? error : new Error(error)))
        rejected = true
      }

      let onAbort = (type, event) => {
        _reject(type, event, 'Connection aborted.')
      }

      let onError = (type, event) => {
        _reject(type, event, 'Unknown network error.')
      }

      let onTimeout = (type, event) => {
        _reject(type, event, 'Connection timed out (>' + settings.timeout + 'ms).')
      }

      // on progress
      let onProgress = (type, event) => {
        createEvent(type, event, new Progress(event))
      }

      // on load
      let onLoad = (type, event) => {
        // check status
        let status = this.xhr.status

        if (! status) {
          return _reject(eventTypes.DOWNLOAD_ERROR, event, 'Unknown HTTP error.')
        }

        // let user check the status
        if (typeof settings.filters.status === 'function') {
          status = settings.filters.status(status)
        }

        if (! status) {
          return _reject(type, event, this.xhr.status + ' ' + this.xhr.statusText)
        }

        // response payload
        let payload

        try { // catch filter error
          payload = new Response(this.xhr, settings.filters.response)
        }
        catch (error) {
          return _reject(type, event, error)
        }

        // set elapsed time
        this.elapsedTime = Date.now() - this.sendTime

        // resolve the promise
        resolve(createEvent(type, event, payload))
      }

      let onUploaLoad = (type, event) => {
        createEvent(type, event, settings.data)
      }

      // download events
      this.xhr.onload     = event => onLoad(eventTypes.DOWNLOAD_LOAD, event)
      this.xhr.onabort    = event => onAbort(eventTypes.DOWNLOAD_ABORT, event)
      this.xhr.onerror    = event => onError(eventTypes.DOWNLOAD_ERROR, event)
      this.xhr.ontimeout  = event => onTimeout(eventTypes.DOWNLOAD_TIMEOUT, event)
      this.xhr.onprogress = event => onProgress(eventTypes.DOWNLOAD_PROGRESS, event)

      // upload events
      this.xhr.upload.onload     = event => onProgress(eventTypes.UPLOAD_LOAD, event)
      this.xhr.upload.onabort    = event => onAbort(eventTypes.UPLOAD_ABORT, event)
      this.xhr.upload.onerror    = event => onError(eventTypes.UPLOAD_ERROR, event)
      this.xhr.upload.ontimeout  = event => onTimeout(eventTypes.UPLOAD_TIMEOUT, event)
      this.xhr.upload.onprogress = event => onProgress(eventTypes.UPLOAD_PROGRESS, event)

      // set request headers
      if (settings.headers) {
        for (let header in settings.headers) {
          this.xhr.setRequestHeader(header, settings.headers[header])
        }
      }

      // set request timeout
      this.xhr.timeout = settings.timeout

      // send the request
      this.xhr.send(settings.data)
    })
  }

  /**
  * Send the request and return a Promise.
  *
  * @return {Promise}
  */
  send() {
    return this._send().catch(event => {
      // trigger user callback
      let triggerEvent = (type, event) => this._triggerEvent(
        new RequestEvent(type, event.event, this, new Attempt(this))
      )

      // retry on timeout error if attempts limit is not reached
      if (event.type.endsWith('timeout')) {
        if (this.attempts < this.settings.maxAttempts) {
          // call user callback
          triggerEvent(eventTypes.BEFORE_RETRY, event)

          // delayed retry
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              // reset xhr object
              this.xhr = null

              // call user callback
              triggerEvent(eventTypes.RETRY, event)

              // (re)send the request
              return this.send().then(resolve).catch(reject)
            }, this.settings.attemptDelay)
          })
        }

        // call user callback
        triggerEvent(eventTypes.RETRY_LIMIT, event)

        let payload = new Error('Too many attempts (max: ' + this.attempts + ').')
        event       = new RequestEvent(eventTypes.DOWNLOAD_ERROR, event.event, this, payload)
      }

      return Promise.reject(event)
    })
  }

  /**
  * Abort the this.
  */
  abort() {
    this.xhr && this.xhr.abort()
  }
}

export default Request
export { Request }
