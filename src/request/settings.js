/**
* Defaults request settings.
* @type     {Object<String, Mixed>}
* @property {String}   [url = '/']               Absolute or relative URL.
* @property {String}   [method = 'GET']         'GET', 'POST', 'DELETE', ...
* @property {Mixed}    [data = null]             Data to send with the request.
* @property {Object}   [headers = {}]            Headers to send with the request.
* @property {Integer}  [timeout = 5000]          Timeout for this request in milliseconds.
* @property {Integer}  [maxAttempts = 5]         Maximum number of attemps before rejection.
* @property {Integer}  [attemptDelay = 5000]     Delay in milliseconds between two attemps.
* @property {String}   [mimeType = 'text/plain'] Expected response mime type.
* @property {Object}   [on = {}]                 Collection of function that takes as single parameter an {@link RequestEvent} instance.
*                                                Ex.: `{ 'download.load': event => { }, 'upload.progress': event => { } }`
*                                                See {@link src/request/event/types.js} for possible values.
* @property {Object}   [filters = {}]            Collection of filter functions.
* @property {Function} [filters.status]          A function that takes as single parameter the request status code and return an boolean to resolve/reject the request.
* @property {Function} [filters.response]        A function that takes as single parameter the request response and return a new version or throw an {@link Error} to reject the {@link Promise}.
*/
const requestSettings = {
  url         : '/',
  method      : 'GET',
  data        : null,
  headers     : {},
  timeout     : 1000,
  maxAttempts : 5,
  attemptDelay: 0,
  mimeType    : 'text/plain',
  filters     : {},
  on          : {}
}

export default requestSettings
export { requestSettings }
