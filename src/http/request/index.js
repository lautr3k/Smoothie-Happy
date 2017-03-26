import uuid from 'uuid/v4'
import RequestEvent from './events/request'
import ProgressEvent from './events/progress'
import * as EventsTypes from './events/types'

/**
* `XMLHttpRequest` wrapper with `Promise` logic.
*
* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
* @see https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
* @example
* // Send GET request
* new Request({
*   url: 'hello.html',
*   on : {
*     retry: event => {
*       // notify retry event
*       console.info('on:retry', event)
*     }
*   }
* })
* .on('progress', event => {
*   // notify progression
*   console.info('on:progress', event)
* })
* .send()
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
  * @param {Object}  settings                      Request settings.
  * @param {String}  [settings.url        = '/']   Absolute or relative URL.
  * @param {String}  [settings.method     = 'GET'] 'GET', 'POST', 'DELETE', ...
  * @param {Mixed}   [settings.data       = null]  Data to send with the request.
  * @param {Boolean} [settings.send       = false] Send the request after creation.
  * @param {Object}  [settings.on         = {}]    Collection of events callbacks.
  * @param {Object}  [settings.headers    = {}]    Headers to send with the request.
  * @param {Integer} [settings.timeout    = 5000]  Timeout for this request in milliseconds.
  * @param {Object}  [settings.xhrOptions = {}]    An `XMLHttpRequest` object of properties/methods to overwrite.
  */
  constructor(settings = {}) {
    /**
    * Request settings.
    * @type {Object}
    * @protected
    */
    this.settings = Object.assign({
      url       : '/',
      method    : 'GET',
      data      : null,
      on        : {},
      headers   : {},
      send      : false,
      timeout   : 5000,
      xhrOptions: {}
    }, settings)

    /**
    * Request send time (set just before send).
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
    this.url = this.settings.url.trim()

    /**
    * Request method.
    * @type {String}
    * @default 'GET'
    * @protected
    */
    this.method = this.settings.method.trim().toUpperCase()

    /**
    * Request data.
    * @type {Mixed}
    * @default null
    * @protected
    */
    this.data = this.settings.data

    /**
    * Request headers.
    * @type {Object}
    * @default {}
    * @protected
    */
    this.headers = this.settings.headers

    /**
    * Request timeout in milliseconds.
    * @type {Integer}
    * @default 5000
    * @protected
    */
    this.timeout = this.settings.timeout

    /**
    * An `XMLHttpRequest` object of properties/methods to overwrite..
    * @type {Object}
    * @protected
    */
    this.xhrOptions = this.settings.xhrOptions

    /**
    * `XMLHttpRequest` instance.
    * @type {XMLHttpRequest}
    * @protected
    */
    this.xhr = null

    /**
    * Callbacks collection.
    * @type {Object}
    * @protected
    */
    this.callbacks = {}

    /**
    * Locking flag.
    * @type {Boolean}
    * @default false
    * @protected
    */
    this.locked = false

    /**
    * `Promise` instance.
    * @type {Promise}
    * @protected
    */
    this.promise = null

    // encode data settings and append data to url if not a POST method
    this.encodeDataSetting()
    this.appendDataToURL()

    // register callbacks
    this.registerCallbacks()

    // Send the request ?
    this.settings.send && this.send()
  }

  /**
  * Encode data settings.
  *
  * @protected
  */
  encodeDataSetting() {
    // no data
    if (! this.data) {
      return null
    }

    // stringify data object
    if (typeof this.data === 'object') {
      this.data = Object.keys(this.data).map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(this.data[key])
      }).join('&')
    }
  }

  /**
  * Append data to url if not a POST method
  *
  * @protected
  */
  appendDataToURL() {
    if (this.method !== 'POST' && this.data) {
      // remove the first char if it is an '?'
      if (this.data.startsWith('?')) {
        this.data = this.data.substr(1)
      }

      // append '?' or '&' to the uri if not already set
      this.url += (this.url.indexOf('?') === -1) ? '?' : '&'

      // append data to uri
      this.url += this.data

      // reset data
      this.data = null
    }
  }

  /**
  * Register callbacks from settings.
  *
  * @protected
  */
  registerCallbacks() {
    Object.keys(this.settings.on).map(eventName => {
      let callback = this.settings.on[eventName]

      if (typeof callback === 'function') {
        this.on(eventName, callback)
      }

      if (Array.isArray(callback)) {
        this.on(eventName, callback[0], callback[1])
      }
    })
  }

  /**
  * Send the request.
  *
  * @return {Request} this
  */
  send() {
    // is locked ?
    if (this.locked) {
      throw new Error('This request is locked, wait for an response or call the abort method.')
    }

    // set locked flag
    this.locked = true

    // request time
    if (! this.time) {
      this.time = Date.now()
    }

    // create http request object
    this.xhr = new XMLHttpRequest()

    // execute the request
    this.promise = this.execute()

    // chainable
    return this
  }

  /**
  * Execute the request and return a Promise.
  *
  * @return {Promise}
  * @protected
  */
  execute() {
    // create and return the Promise
    return new Promise((resolve, reject) => {
      // resolve wrapper
      let _resolve = event => {
        event = new RequestEvent(event, this)
        this.trigger(event)
        resolve(event)
      }

      // reject wrapper
      let _reject = event => {
        event = new RequestEvent(event, this)
        this.trigger(event)
        reject(event)
      }

      // on load event (load or upload.load)
      let LOAD_EVENT = EventsTypes.LOAD

      // open the request (async)
      this.xhr.open(this.method, this.url, true)

      // overwrite xhr properties
      Object.assign(this.xhr, this.xhrOptions)

      // force timeout
      this.xhr.timeout = this.timeout

      this.xhr.onload = () => {
        if (this.xhr.status >= 200 && this.xhr.status < 300) {
          _resolve(LOAD_EVENT)
        }
        else {
          _reject(EventsTypes.ERROR)
        }
      }

      // on error
      this.xhr.onerror = () => {
        _reject(EventsTypes.ERROR)
      }

      // on timeout
      this.xhr.ontimeout = () => {
        _reject(EventsTypes.TIMEOUT)
      }

      // on abort
      this.xhr.onabort = () => {
        _reject(EventsTypes.ABORT)
      }

      // on progress
      this.xhr.onprogress = event => {
        if (event.lengthComputable) {
          this.trigger(new ProgressEvent(EventsTypes.PROGRESS, this, event))
        }
      }

      // on upload.load
      this.xhr.upload.onload = () => {
        LOAD_EVENT = EventsTypes.UPLOAD_LOAD
      }

      // on upload.error
      this.xhr.upload.onerror = () => {
        _reject(EventsTypes.UPLOAD_ERROR)
      }

      // on upload.timeout
      this.xhr.upload.ontimeout = () => {
        _reject(EventsTypes.UPLOAD_TIMEOUT)
      }

      // on upload.abort
      this.xhr.upload.onabort = () => {
        _reject(EventsTypes.UPLOAD_ABORT)
      }

      // on upload.progress
      this.xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          this.trigger(new ProgressEvent(EventsTypes.UPLOAD_PROGRESS, this, event))
        }
      }

      // set request headers
      for (let header in this.headers) {
        this.xhr.setRequestHeader(header, this.headers[header])
      }

      // send the request
      this.xhr.send(this.method === 'POST' ? this.data : null)
    })
  }

  /**
  * Trigger an event.
  *
  * @param  {RequestEvent|ProgressEvent} event Event instance.
  * @return {Request} this
  * @protected
  */
  trigger(event) {
    let callback = this.callbacks[event.name]

    callback && callback.func.call(callback.context, event)

    // chainable
    return this
  }

  /**
  * Register event handler.
  *
  * @param  {String}   eventName      Event identifier.
  * @param  {Function} callback       An function receiving an {@link ProgressEvent} as first parameter.
  * @param  {Object}   [context=null] The callback context.
  * @return {Request}  this
  */
  on(eventName, callback, context = null) {
    // register envent callback
    this.callbacks[eventName] = { func: callback, context: context || callback }

    // backup in settings for cloning
    if (! this.settings.on[eventName]) {
      this.settings.on[eventName] = [callback, context || callback]
    }

    // chainable
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
    if (! this.promise) {
      throw new Error('Call the "send" method before calling the "then" method, or set the "send" settings to true.')
    }

    return this.promise.then(onFulfilled, onRejected)
  }

  /**
  * Appends a rejection handler callback to the promise.
  *
  * @param {Function} onRejected Rejection callback.
  * @return {Promise}
  */
  catch(onRejected) {
    // not sent...
    if (! this.promise) {
      throw new Error('Call the "send" method before calling the "catch" method, or set the "send" settings to true.')
    }

    return this.promise.catch(onRejected)
  }
}

// Exports
export default Request
export { Request }
