/**
* Defaults request settings.
* @type     {Object}
* @property {String}  [url      = '/']          Absolute or relative URL.
* @property {String}  [method   = 'GET']        'GET', 'POST', 'DELETE', ...
* @property {Mixed}   [data     = null]         Data to send with the request.
* @property {Object}  [headers  = {}]           Headers to send with the request.
* @property {Integer} [timeout  = 5000]         Timeout for this request in milliseconds.
* @property {String}  [mimeType = 'text/plain'] Expected response mime type.
* @property {Object}  [on       = {}]           Collection of function that takes as single parameter an {RequestEvent} instance.
*                                               Ex.: `{ 'download.load': event => { }, 'upload.progress': event => { } }`
*                                               See {@link src/http/events/types.js} for possible values.
* @property {Object}  [filters  = {}]           Collection of filter functions.
* @property {Object}  [filters.status   = null] A function that takes as single parameter the request status code and return an boolean.
* @property {Object}  [filters.response = null] A function that takes as single parameter the request response and return a new version.
*                                               You can throw an {Error} to reject the {Promise}.
*/
const settings = {
  url     : '/',
  method  : 'GET',
  data    : null,
  headers : {},
  timeout : 5000,
  mimeType: 'text/plain',
  filters : {},
  on      : {}
}

export default settings
export { settings }
