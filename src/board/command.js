import { post } from '../http'

/**
* Board command class.
*/
class BoardCommandPayload {
  /**
  * @param {Board}  board              Board instance.
  * @param {Object} [settings]         Command settings (see {@link Request} for more details).
  * @param {String} [settings.command] Command to send.
  */
  constructor(payload) {
    this.event = payload.event
    this.data = payload.data
    this.error = payload.error || false
  }
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
    // board instance
    this.board = board

    // default settings from board
    this.settings = Object.assign({
      timeout: board.timeout
    }, settings)

    // disable auto-send
    this.settings.send = false

    // request settings
    this.settings.data = this.settings.command.trim() + '\n'
    this.settings.url  = 'http://' + this.board.address + '/command'

    // create new post request
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
        let error   = new Error(raw.substr(6))
        let payload = new BoardCommandPayload({ event, error })

        return Promise.reject(payload)
      }

      let payload = new BoardCommandPayload({ event, data: raw })

      return Promise.resolve(payload)
    })
  }
}

// Exports
export default BoardCommand
export { BoardCommand }
