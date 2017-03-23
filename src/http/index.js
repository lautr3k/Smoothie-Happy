import Request from './request'

/**
* Make, send and return an request.
*
* @param  {Object} [settings={}] Request settings. See {Request} for details.
* @return {Request}
* @example
* // Single request
* request({
*   method: 'GET',
*   url: 'hello.html'
* })
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
function request(settings = {}) {
  // force send request after creation if not defined
  settings = Object.assign({ send: true }, settings)

  // create (send) and return the request
  return new Request(settings)
}

/**
* Make, send and return an GET request. See {@link src/http/index.js~request} for example.
*
* @param  {Object} [settings={}] Request settings. See {@link Request} for details.
* @return {Request}
*/
function get(settings = {}) {
  // force GET method
  settings.method = 'GET'

  // create and return the request
  return request(settings)
}

/**
* Make, send and return an POST request. See {@link src/http/index.js~request} for example.
*
* @param  {Object} [settings={}] Request settings. See {@link Request} for details.
* @return {Request}
*/
function post(settings = {}) {
  // force POST method
  settings.method = 'POST'

  // create and return the request
  return request(settings)
}

// Exports
export default request
export { request, get, post }
