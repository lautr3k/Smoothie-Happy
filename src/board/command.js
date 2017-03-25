import uuid from 'uuid/v4'
import { post } from '../http'
import * as events from './events'
import * as commands from './commands'
import RequestEvent from '../http/events/request'

/**
* Command payload class.
*/
class CommandPayload {
  /**
  * @param {Board}  command Board instance.
  * @param {Object} [payload={}] Command payload.
  */
  constructor(command, payload = {}) {
    /**
    * Command instance.
    * @type {BoardCommand}
    * @protected
    */
    this.command = command

    /**
    * Board instance.
    * @type {Board}
    * @protected
    */
    this.board = command.board

    /**
    * Request event instance.
    * @type {RequestEvent}
    * @protected
    */
    this.event = payload.event || null

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
    * Unique identifier.
    * @type {String}
    * @protected
    */
    this.uuid = uuid()

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

    /**
    * Response data.
    * @type {Mixed}
    * @protected
    */
    this.response = null

    /**
    * Number of retry occured.
    * @type {Integer}
    * @default 0
    * @protected
    */
    this.retryCount = 0

    /**
    * Number of retry before rejection.
    * @type {Integer}
    */
    this.retryLimit = board.retryLimit

    /**
    * Retry interval in milliseconds for all commands.
    * @type {Integer}
    */
    this.retryInterval = board.retryInterval

    // publish command/create event
    this._publish(events.COMMAND_CREATE)
  }

  /**
  * Publish on topic.
  *
  * @param {String}       topic        Topic name.
  * @param {RequestEvent} [payload={}] Command payload.
  * @return {Promise}
  */
  _publish(topic, payload = {}) {
    return this.board.publish(topic, new CommandPayload(this, payload))
  }

  /**
  * Return an rejected Promise.
  *
  * @param {RequestEvent} event Request event instance.
  * @param {Error|String} error Error message or Error instance.
  * @return {Promise}
  */
  _reject(event, error) {
    let payload = { event, error }
    let promise = Promise.reject(new CommandPayload(this, payload))

    this._publish(events.COMMAND_ERROR, payload)

    return promise
  }

  /**
  * Return an resolved Promise.
  *
  * @param {RequestEvent} event Request event instance.
  * @param {Mixed}        data Mixed data.
  * @return {Promise}
  */
  _resolve(event, data) {
    let payload = { event, data }
    let promise = Promise.resolve(new CommandPayload(this, payload))

    this._publish(events.RESPONSE + '/' + this.name, payload)
    this._publish(events.RESPONSE, payload)

    return promise
  }

  /**
  * Send the command to the board.
  *
  * @return {Request}
  */
  send() {
    this._publish(events.COMMAND_SEND)

    let request = this.request.send()

    this._publish(events.COMMAND_SENT, { data: request })

    return request.then(event => {
      // raw response text
      let raw = event.response.raw

      // unsupported command...
      if (raw.indexOf('error:Unsupported command') === 0) {
        return this._reject(event, raw.substr(6))
      }

      try {
        // handle raw response string
        this.response = this.settings.parse ? this._parse(raw) : raw
        return this._resolve(event, this.response)
      }
      catch (error) {
        return this._reject(event, error)
      }
    })
    .catch(event => {
      // fatal error
      if (! (event instanceof RequestEvent)) {
        return Promise.reject(event)
      }

      // network error
      // if retry limit not reached
      if (this.retryCount < this.retryLimit) {
        // create and return a new Promise
        return new Promise((resolve, reject) => {
          // create new request
          this.request = post(this.settings)

          // increment retry counter
          this.retryCount++

          // publish some events
          this._publish(events.COMMAND_ERROR, { event, error: event.name })
          this._publish(events.COMMAND_RETRY, { event, data: {
            count   : this.retryCount,
            limit   : this.retryLimit,
            interval: this.retryInterval
          }})

          // delayed retry
          setTimeout(() => {
            this.send().then(resolve).catch(reject)
          }, this.retryInterval);
        })
      }

      return this._reject(event, event.name)
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
  _parse(raw) {
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
