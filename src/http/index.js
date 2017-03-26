import Request from './request'

/**
* Make, send and return an HTTP request.
*
* @param  {Object} [settings={}] Request settings. See {@link Request} for details.
* @return {Request}
* @example
* // Send GET request with data
* request({ method: 'GET', url: 'hello.html', data: { name: 'Jon Doe' } })
* .then(event => callback)  // done
* .catch(event => callback) // error
* .then(result => callback) // always
*/
function request(settings = {}) {
  // force send request after creation if not defined
  settings = Object.assign({ send: true }, settings)

  // create (send) and return the request
  return new Request(settings)
}

/**
* Make, send and return an GET request.
*
* @param  {Object} [settings={}] Request settings. See {@link Request} for details.
* @return {Request}
* @example
* // Send GET request
* get({ url: 'hello.html' })
* .then(event => callback)  // done
* .catch(event => callback) // error
* .then(result => callback) // always
*/
function get(settings = {}) {
  // force GET method
  settings.method = 'GET'

  // create and return the request
  return request(settings)
}

/**
* Make, send and return an POST request.
*
* @param  {Object} [settings={}] Request settings. See {@link Request} for details.
* @return {Request}
* @example
* // Send POST request with data
* post({ url: 'hello.html', data: { name: 'Jon Doe' } })
* .then(event => callback)  // done
* .catch(event => callback) // error
* .then(result => callback) // always
*/
function post(settings = {}) {
  // force POST method
  settings.method = 'POST'

  // create and return the request
  return request(settings)
}

// Exports
export default Request
export { request, get, post }
