import Request from '../request'
import requestEventTypes from '../request/event/types'

/**
* Board request.
* @extends {Request}
*/
class BoardRequest extends Request {
  /**
  * @param {Board}  board    Board instance.
  * @param {Object} settings See {@link src/board/settings.js~boardSettings}.request for defaults keys/values.
  */
  constructor(board, settings = {}) {
    // wrap request events
    settings.on = settings.on || {}

    for (let key in requestEventTypes) {
      let topic = requestEventTypes[key]

      if (settings.on[topic]) {
        let callback = settings.on[topic]

        settings.on[topic] = event => {
          board.publish('request.' + topic, event)
          callback(event)
        }
      }
      else {
        settings.on[topic] = event => {
          board.publish('request.' + topic, event)
        }
      }
    }

    // call parent constructor
    super(Object.assign({}, board.settings.request, settings, {
      url: 'http://' + board.address + '/' + settings.url
    }))

    /**
    * Board instance.
    * @type {String}
    * @protected
    */
    this.board = board
  }
}

// Exports
export default BoardRequest
export { BoardRequest }
