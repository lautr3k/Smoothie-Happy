/**
* Defaults board settings.
* @type     {Object<String, Mixed>}
* @property {String}   address                       IP or hostname without protocol prefix.
* @property {Object}   request                       Request settings, see {@link src/request/settings.js~requestSettings} for defaults keys/values.
* @property {Integer}  [request.timeout      = 0]    Timeout for this request in milliseconds.
* @property {Integer}  [request.maxAttempts  = 3]    Maximum number of attemps before rejection.
* @property {Integer}  [request.attemptDelay = 1000] Delay in milliseconds between two attemps.
* @property {Function} [request.filters.status]      Default to 200 OK `function(s) { return s === 200 }`.
*/
const boardSettings = {
  address: undefined,
  request: {
    timeout     : 0,
    maxAttempts : 3,
    attemptDelay: 1000,
    filters     : { status: status => status === 200 }
  }
}

export default boardSettings
export { boardSettings }
