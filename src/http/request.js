import uuid from 'uuid/v4'
import { RequestEvent, ProgressEvent } from './events'

/**
* `XMLHttpRequest` wrapper with `Promise` logic.
*
* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
* @see https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
* @example
* // Single request
* new Request({
*   url: 'hello.html'
* })
* .send()
* .onProgress(event => {
*   // notify progression
*   console.info('on:progress', event)
* })
* .then(event => {
*   // hello.html is loaded
*   console.info('on:load', event)
*
*   // return result for final then
*   return { event: event, error: false }
* })
* .catch(event => {
*   // error loading hello.html
*   console.warn('on:error', event)
*
*   // return error for final then
*   return { event: event, error: true }
* })
* .then(result => {
*   // finally, always ...
*   let event = result.event
*   let type  = result.error ? 'error' : 'info'
*
*   console[type]('finally:', event)
* })
*/
class Request {
  /**
  * @param {Object}  settings                    Request settings.
  * @param {String}  settings.url                URL with protocol.
  * @param {String}  [settings.method   = 'GET'] 'GET', 'POST', 'DELETE', ...
  * @param {Mixed}   [settings.data     = null]  Data to send with the request.
  * @param {Mixed}   [settings.send     = false] Send the request after creation.
  * @param {Object}  [settings.headers  = null]  Headers to send with the request.
  * @param {Integer} [settings.timeout  = 5000]  Timeout for this request in milliseconds.
  * @param {Object}  [settings.xhr      = null]  An `XMLHttpRequest` instance or an collection of `XMLHttpRequest` properties/methods to overwrite.
  */
  constructor(settings = {}) {
    /**
    * Request settings.
    * @type {Object}
    * @protected
    */
    this.settings = Object.assign({
      method : 'GET',
      data   : null,
      send   : false,
      headers: null,
      timeout: 5000,
      xhr    : null
    }, settings)

    /**
    * Request time (set just before send).
    * @type {Integer}
    * @protected
    */
    this.time = null

    /**
    * Unique identifier.
    * @type {String}
    * @protected
    */
    this.uuid = uuid()

    /**
    * Request url.
    * @type {String}
    * @protected
    */
    this.url = (this.settings.url || '').trim()

    /**
    * Request method.
    * @type {String}
    * @default 'GET'
    * @protected
    */
    this.method = (this.settings.method  || 'GET').trim().toUpperCase()

    /**
    * Request data.
    * @type {Mixed}
    * @default null
    * @protected
    */
    this.data = this.settings.data || null

    // append data to url if not a POST method
    if (this.method !== 'POST' && this.data) {
      // stringify data object
      if (typeof this.data === 'object') {
        this.data = Object.keys(this.data).map(key => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(this.data[key])
        }).join('&')
      }

      // trim data string
      this.data = this.data.trim()

      // remove the first char if it is an '?'
      if (this.data.indexOf('?') === 0) {
        this.data = this.data.substr(1)
      }

      // append '?' or '&' to the uri if not already set
      this.url += (this.url.indexOf('?') === -1) ? '?' : '&'

      // append data to uri
      this.url += this.data

      // reset data
      this.data = null
    }

    /**
    * Request headers.
    * @type {Object}
    * @default {}
    * @protected
    */
    this.headers = this.settings.headers || {}

    /**
    * Request timeout in milliseconds.
    * @type {Integer}
    * @default 5000
    * @protected
    */
    this.timeout = this.settings.timeout === undefined ? 5000 : this.settings.timeout

    /**
    * `XMLHttpRequest` instance.
    * @type {XMLHttpRequest}
    * @protected
    */
    this.xhr = this.settings.xhr || null

    /**
    * `Promise` instance.
    * @type {Promise}
    */
    this._promise = null

    // Send the request ?
    this.settings.send && this.send()
  }

  /**
  * Send the request.
  *
  * @return {Request} this
  */
  send() {
    // already sent...
    if (this._promise) {
      throw new Error('A request can only be sent once.')
    }

    // create XMLHttpRequest instance
    let xhrOptions = {}

    if (! (this.xhr instanceof XMLHttpRequest)) {
      // maybe properties/methods to overwrite
      if (this.xhr && typeof this.xhr === 'object') {
        xhrOptions = this.xhr
      }

      // create http request object
      this.xhr = new XMLHttpRequest()
    }

    // Execute the request
    this._promise = this._execute(xhrOptions)

    // chainable
    return this
  }

  /**
  * Execute the request and return a Promise.
  *
  * @param  {Object} xhrOptions An object of `XMLHttpRequest` settings.
  * @return {Promise}
  */
  _execute(xhrOptions) {
    // create and return the Promise
    return new Promise((resolve, reject) => {
      // open the request (async)
      this.xhr.open(this.method, this.url, true)

      // overwrite properties/methods
      for (let option in xhrOptions) {
        if (option === 'upload') {
          for (let event in xhrOptions[option]) {
            if (this.xhr.upload[event] !== undefined) {
              this.xhr.upload[event] = xhrOptions[option][event]
            }
          }
        }
        else if (this.xhr[option] !== undefined) {
          this.xhr[option] = xhrOptions[option]
        }
      }

      // force timeout
      this.xhr.timeout = this.timeout

      // on load
      let LOAD_EVENT = 'load'

      this.xhr.onload = () => {
        if (this.xhr.status >= 200 && this.xhr.status < 300) {
          resolve(new RequestEvent(LOAD_EVENT, this))
        }
        else {
          reject(new RequestEvent(LOAD_EVENT, this))
        }
      }

      // on error
      this.xhr.onerror = () => {
        reject(new RequestEvent('error', this))
      }

      // on timeout
      this.xhr.ontimeout = () => {
        reject(new RequestEvent('timeout', this))
      }

      // on abort
      this.xhr.onabort = () => {
        reject(new RequestEvent('abort', this))
      }

      // on upload.load
      this.xhr.upload.onload = () => {
        LOAD_EVENT = 'upload.load'
      }

      // on upload.error
      this.xhr.upload.onerror = () => {
        reject(new RequestEvent('upload.error', this))
      }

      // on upload.timeout
      this.xhr.upload.ontimeout = () => {
        reject(new RequestEvent('upload.timeout', this))
      }

      // on upload.abort
      this.xhr.upload.onabort = () => {
        reject(new RequestEvent('upload.abort', this))
      }

      // set request headers
      for (let header in this.headers) {
        this.xhr.setRequestHeader(header, this.headers[header])
      }

      // request sent time
      this.time = Date.now()

      // send the request
      this.xhr.send(this.method === 'POST' ? this.data : null)
    })
  }

  /**
  * Register progress event handler.
  *
  * @param  {Function} progressHandler An function receiving an {@link ProgressEvent} as first parameter.
  * @param  {Object}   [context]       The callback context
  * @return {Request}  this
  */
  onProgress(progressHandler, context) {
    // not sent...
    if (! this._promise) {
      throw new Error('Call the "send" method before calling the "onProgress" method, or set the "send" settings to true.')
    }

    // register progress event
    this.xhr.onprogress = event => {
      if (event.lengthComputable) {
        progressHandler.call(context || this, new ProgressEvent('progress', this, event))
      }
    }

    // return the promise
    return this
  }

  /**
  * Register upload progress event handler.
  *
  * @param  {Function} progressHandler An function receiving an {@link ProgressEvent} as first parameter.
  * @param  {Object}   [context]       The callback context
  * @return {Request}  this
  */
  onUploadProgress(progressHandler, context) {
    // not sent...
    if (! this._promise) {
      throw new Error('Call the "send" method before calling the "onUploadProgress" method, or set the "send" settings to true.')
    }

    // register upload progress event
    this.xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        progressHandler.call(context || this, new ProgressEvent('upload.progress', this, event))
      }
    }

    // return the promise
    return this
  }

  /**
  * Appends fulfillment and rejection handlers to the promise.
  *
  * @param  {Function} onFulfilled Fulfillment callback.
  * @param  {Function} onRejected  Rejection callback.
  * @return {Promise}
  */
  then(onFulfilled, onRejected) {
    // not sent...
    if (! this._promise) {
      throw new Error('Call the "send" method before calling the "then" method, or set the "send" settings to true.')
    }

    return this._promise.then(onFulfilled, onRejected)
  }

  /**
  * Appends a rejection handler callback to the promise.
  *
  * @param {Function} onRejected Rejection callback.
  * @return {Promise}
  */
  catch(onRejected) {
    // not sent...
    if (! this._promise) {
      throw new Error('Call the "send" method before calling the "catch" method, or set the "send" settings to true.')
    }

    return this._promise.catch(onRejected)
  }
}

// Exports
export default Request
export { Request }
