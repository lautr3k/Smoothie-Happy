import { request, post, get } from './request'
import command from './command'
import * as commands from './commands'
import * as errorTypes from './error-types'

/**
* API version
* @type {String}
*/
export const VERSION = '2.1.0'

export default {
  VERSION,
  request,
  post,
  get,
  command,
  commands,
  errorTypes
}
