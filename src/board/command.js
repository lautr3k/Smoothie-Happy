import { post } from '../http'
import * as events from './events'
import * as commands from './commands'

/**
* Board command class.
*/
class CommandPayload {
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
    this.data = payload.data || null

    /**
    * Error instance if any.
    * @type {Error|null}
    * @protected
    */
    this.error = payload.error || null

    // force error instance
    if (typeof this.error === 'string') {
      this.error = new Error(this.error)
    }
  }
}

function rejectCommand(event, error) {
  return Promise.reject(new CommandPayload({ event, error }))
}

function resolveCommand(event, data) {
  return Promise.resolve(new CommandPayload({ event, data }))
}

/**
* Board command class.
*/
class BoardCommand {
  /**
  * @param {Board}  board                 Board instance.
  * @param {Object} [settings]            Command settings (see {@link Request} for more details).
  * @param {String} [settings.command]    Command line to send.
  * @param {String} [settings.parse=true] Parse the response string.
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
      timeout: board.timeout,
      parse  : true
    }, settings)

    /**
    * Raw command line.
    * @type {String}
    * @protected
    */
    this.line = this.settings.command.trim()

    /**
    * Command arguments.
    * @type {Array}
    * @protected
    */
    this.args = this.line.split(' ').map(arg => arg.trim())

    /**
    * Command name.
    * @type {Object}
    * @protected
    */
    this.name = this.args.shift()

    // request settings
    this.settings.data = this.line + '\n'
    this.settings.url  = 'http://' + this.board.address + '/command'

    // disable auto-send
    this.settings.send = false

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

      // parse response string
      try {
        let data    = this.settings.parse ? this._parseResponse(raw) : raw
        let promise = resolveCommand(event, data)

        this.board.publish(events.COMMAND + '/' + this.name, this)

        return promise
      }
      catch (error) {
        return rejectCommand(event, error)
      }
    })
  }

  /**
  * Parse the command response
  * and return the parsed response data as object
  * or throw an Error if any error occured.
  *
  * @param  {String} raw Raw command response string.
  * @return {Object|Error}
  */
  _parseResponse(raw) {
    // if undefined command
    if (! commands[this.name]) {
      // return an Error message
      throw new Error('Sorry! The "' + this.name + '" command is not (yet) implemented.')
    }

    // parse and return the command response
    return commands[this.name](raw, this.args)
  }
}

// Exports
export default BoardCommand
export { BoardCommand, CommandPayload }
