import Request from '../request'

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
