import Request from './request'
import * as eventTypes from './request/event/types'

/**
* Make and send an {XMLHttpRequest} and return an Promise.
*
* @param  {Object} [settings={}] See {@link src/http/request/settings.js~settings} for defaults keys/values.
* @return {Promise}
*/
function request(settings = {}) {
  return new Request(settings).send()
}

/**
* Make and send an {XMLHttpRequest} and return an Promise.
*
* @param  {Object} [settings={}] See {@link src/http/request/settings.js~settings} for defaults keys/values.
* @return {Promise}
*/
function get(settings = {}) {
  settings.method = 'GET'
  return new Request(settings).send()
}

/**
* Make and send an {XMLHttpRequest} and return an Promise.
*
* @param  {Object} [settings={}] See {@link src/http/request/settings.js~settings} for defaults keys/values.
* @return {Promise}
*/
function post(settings = {}) {
  settings.method = 'POST'
  return new Request(settings).send()
}

// Exports
export default Request
export { Request, request, get, post, eventTypes }
