import { post } from '../http'

/**
* Board command class.
*/
class BoardCommandPayload {
  /**
  * @param {Object}  payload Command payload.
  */
  constructor(payload) {
    /**
    * Request event instance.
    * @type {RequestEvent}
    * @protected
    */
    this.event = payload.event

    /**
    * Response data (parsed).
    * @type {Object}
    * @protected
    */
    this.data = payload.data

    // force error instance
    let error = false

    if (payload.error && typeof payload.error === 'string') {
      error = new Error(payload.error)
    }

    /**
    * Error instance if any.
    * @type {Error|false}
    * @protected
    */
    this.error = error
  }
}

function rejectCommand(event, error) {
  return Promise.reject(new BoardCommandPayload({ event, error }))
}

function resolveCommand(event, data) {
  return Promise.resolve(new BoardCommandPayload({ event, data }))
}

/**
* Board command class.
*/
class BoardCommand {
  /**
  * @param {Board}  board              Board instance.
  * @param {Object} [settings]         Command settings (see {@link Request} for more details).
  * @param {String} [settings.command] Command to send.
  */
  constructor(board, settings = {}) {
    /**
    * Board instance.
    * @type {Board}
    * @protected
    */
    this.board = board

    /**
    * Default settings from board.
    * @type {Object}
    * @protected
    */
    this.settings = Object.assign({
      timeout: board.timeout
    }, settings)

    // disable auto-send
    this.settings.send = false

    // request settings
    this.settings.data = this.settings.command.trim() + '\n'
    this.settings.url  = 'http://' + this.board.address + '/command'

    /**
    * Request instance.
    * @type {Request}
    * @protected
    */
    this.request = post(this.settings)
  }

  /**
  * Send the command to the board.
  *
  * @return {Request}
  */
  send() {
    return this.request.send().then(event => {
      // raw response text
      let raw = event.response.raw

      // unsupported command...
      if (raw.indexOf('error:Unsupported command') === 0) {
        return rejectCommand(event, raw.substr(6))
      }

      return resolveCommand(event, raw)
    })
  }
}

// Exports
export default BoardCommand
export { BoardCommand }
