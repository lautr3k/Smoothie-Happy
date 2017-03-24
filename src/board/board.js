import PubSub from '../pubsub'
import * as events from './events'
import BoardCommand from './command'

// Enable cross-tab communication
// PubSub.crossTabCommunication(true)

/**
* Board class.
*/
class Board extends PubSub {
  /**
  * @param {String|Object} address|settings        Board address or settings.
  * @param {Object}        [settings]              Board settings.
  * @param {String}        [settings.address]      Board address (ip or hostname).
  * @param {Integer}       [settings.timeout=2000] Default response timeout for all commands (in milliseconds).
  */
  constructor(address, settings = {}) {
    super()

    // settings provided as first argument
    if (typeof address === 'object') {
      settings = address
      address  = settings.address
    }

    if (! address) {
      throw new Error('No address provided.')
    }

    /**
    * Board address (ip or hostname).
    * @type {String}
    * @protected
    */
    this.address = address.trim()

    /**
    * Board settings.
    * @type {Object}
    * @protected
    */
    this.timeout = settings.timeout || 2000
  }

  /**
  * Subscribe to topic.
  *
  * @param  {String}      topic          Topic name.
  * @param  {Function}    callback       Function to call on topic message.
  * @param  {Object|null} [context=null] Callback context to apply on call.
  * @return {String} Unique identifier (uuid/v4)
  */
  subscribe(topic, callback, context = null) {
    return Board.subscribe(this.address + '/' + topic, callback, context)
  }

  /**
  * Unsubscribe from specific topic.
  *
  * @param  {String} uuid Subscription uuid.
  * @return {Boolean} False if not found.
  */
  unsubscribe(uuid) {
    return Board.unsubscribe(uuid)
  }

  /**
  * Publish on topic.
  *
  * @param {String} topic        Topic name.
  * @param {Mixed}  [data=null]  Topic data.
  * @param {Mixed}  [async=true] Async publication.
  * @return {Promise}
  */
  publish(topic, data = null, async = true) {
    return Board.publish(this.address + '/' + topic, data, async)
  }

  /**
  * Send an arbitrary command to the board.
  *
  * @param  {String|Object} command            Command to send or command settings object.
  * @param  {Object}        [settings={}]      Command settings (see {@link Request} for more details).
  * @param  {String}        [settings.command] Command to send.
  * @return {Request}
  */
  send(command, settings = {}) {
    // settings provided on first argument
    if (typeof command === 'object') {
        settings = command
        command  = settings.command
    }
    else {
      settings.command = command
    }

    // create the command request
    let boardCommand = new BoardCommand(this, settings)

    this.publish(events.COMMAND, boardCommand)

    return boardCommand.send().then(event => {
      this.publish(events.RESPONSE, event)
      return Promise.resolve(event)
    })
  }
}

// Exports
export default Board
export { Board }
