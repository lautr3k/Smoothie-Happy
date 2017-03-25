/**
* API version
* @type {String}
*/
export const VERSION = '2.0.0'

export { request, get, post } from './http'
export { PubSub } from './pubsub'
export {
  Board,
  commands as BoardCommands,
  events as BoardEvents
} from './board'
