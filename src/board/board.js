import uuid from 'uuid/v4'
import boardSettings from './settings'
import BoardRequest from './request'
import BoardCommand from './command'

/**
* Board class.
*/
class Board {
  /**
  * @param {Object} settings See {@link src/board/settings.js~boardSettings} for defaults keys/values.
  */
  constructor(settings = {}) {
    /**
    * Board settings, see {@link src/board/settings.js~boardSettings} for defaults keys/values.
    * @type {Object}
    * @protected
    */
    this.settings = Object.assign({}, boardSettings, settings)

    if (! this.settings.address || typeof this.settings.address !== 'string') {
      throw new Error('An address must be specified.')
    }

    /**
    * Board address.
    * @type {String}
    * @protected
    */
    this.address = this.settings.address.trim()

    if (this.address.startsWith('http://')) {
      this.address = this.address.replace('http://')
    }

    if (this.address.endsWith('/')) {
      this.address = this.address.replace(/\/+$/g, '')
    }

    /**
    * Unique identifier (uuid/v4).
    * @type {String}
    * @protected
    */
    this.uuid = uuid()
  }

  /**
  * Publish an event.
  *
  * @param {String} topic
  * @param {Mixed}  [payload = null]
  */
  publish(topic, payload = null) {
    console.log('publish:', { board: this, topic, payload })
  }

  /**
  * Create an request.
  *
  * @param  {Object} [settings = {}] Request settings (see {@link BoardRequest} for more details).
  * @return {BoardRequest}
  */
  createRequest(settings = {}) {
    return new BoardRequest(this, settings)
  }

  /**
  * Send an request to the board (GET by default).
  *
  * ```
  * var board = new sh.board.Board({ address: '192.168.1.102' });
  *
  * board.sendRequest({ url: 'sd/config' })
  * .then(function(event) {
  *   console.info('then:', event);
  * })
  * .catch(function(event) {
  *   console.error('catch:', event);
  * });
  * ```
  *
  * @param  {Object} [settings = {}] Request settings (see {@link BoardRequest} for more details).
  * @return {Promise<RequestEvent>}
  */
  sendRequest(settings = {}) {
    return this.createRequest(settings).send()
  }

  /**
  * Create an command.
  *
  * @param  {String} command         Command line.
  * @param  {Object} [settings = {}] Request settings (see {@link BoardCommand} for more details).
  * @return {BoardCommand}
  */
  createCommand(command, settings = {}) {
    return new BoardCommand(this, command, settings)
  }

  /**
  * Send an command to the board.
  *
  * ```
  * var board = new sh.board.Board({ address: '192.168.1.102' });
  *
  * board.sendCommand('ls -s sd/')
  * .then(function(event) {
  *   console.info('then:', event);
  *   console.info('data:', event.payload.data);
  * })
  * .catch(function(event) {
  *   console.error('catch:', event);
  * });
  * ```
  *
  * @param  {String} command         Command line.
  * @param  {Object} [settings = {}] Request settings (see {@link BoardCommand} for more details).
  * @return {Promise<RequestEvent>}
  */
  sendCommand(command, settings = {}) {
    return this.createCommand(command, settings).send()
  }
}

// Exports
export default Board
export { Board }
