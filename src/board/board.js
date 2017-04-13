import uuid from 'uuid/v4'
import boardSettings from './settings'
import BoardRequest from './request'
import requestEventTypes from '../request/event/types'
import BoardCommand from './command'
import boardTopics from './topics'
import BoardInfo from './info'
import BoardFileTree from './filetree'
import { normalizePath } from './util'

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

    /**
    * Board info parsed from version command.
    * ```
    * {
    *   branch: "edge",
    *   hash  : "9ab4538",
    *   date  : "Oct 10 2016 04:09:42",
    *   mcu   : "LPC1769",
    *   clock : "120MHz"
    * }
    * ```
    * @type {BoardInfo|null}
    * @default null
    * @protected
    */
    this.info = null

    /**
    * Flat files tree.
    * @type {BoardFileTree}
    * @protected
    */
    this.fileTree = new BoardFileTree()

    /**
    * Topic subscriptions.
    * @type {Map}
    * @protected
    */
    this.subscriptions = new Map()

    /**
    * Command queue.
    * @type {Array}
    * @protected
    */
    this.commandQueue = []

    /**
    * Command queue locked ?.
    * @type {Boolean}
    * @protected
    */
    this.commandQueueLocked = false

    /**
    * Command queue in pause ?.
    * @type {Boolean}
    * @protected
    */
    this.commandQueuePaused = false

    /**
    * Pending command (from command queue).
    * @type {BoardCommand|null}
    * @protected
    */
    this.pendingCommand = null

    /**
    * Is system halted ?
    * @type {Boolean}
    * @protected
    */
    this.alarm = false

    /**
    * Is system in MRI debug mode ?
    * @type {Boolean}
    * @protected
    */
    this.MRIMode = false
  }

  /**
  * @typedef  {Object} BoardMessage
  * @property {Board}  board   Board instance.
  * @property {String} topic   Topic name, see {@link src/board/topics/index.js} for the topics list.
  * @property {Mixed}  payload Message payload.
  */

  /**
  * Publish message to topic, see {@link src/board/topics/index.js} for the topics list.
  *
  * @param  {String} topic See {@link src/board/topics/index.js} for possible values.
  * @param  {Mixed}  [payload = null]
  * @see {@link Board#subscribe}
  * @see {@link Board#unsubscribe}
  * @see {@link Board#deleteTopic}
  */
  publish(topic, payload = null) {
    // fix topic case
    topic = topic.trim().toLowerCase()

    // if topic found
    if (this.subscriptions.has(topic)) {
      // message payload
      let message = { board: this, topic, payload }

      // call each registrered callback
      this.subscriptions.get(topic).forEach(subscription => {
        subscription.callback.call(subscription.context, message)
      })
    }
  }

  /**
  * @typedef  {Object} BoardSubscription
  * @property {String}        uuid     Unique identifier (uuid/v4).
  * @property {Function}      callback A function that takes as single parameter an {@link BoardMessage} object.
  * @property {Function|null} context  Callback context to apply on call.
  */

  /**
  * Subscribe to topic, see {@link src/board/topics/index.js} for the topics list.
  *
  * @param  {String}      topic          Topic name, see {@link src/board/topics/index.js} for the topics list.
  * @param  {Function}    callback       A function that takes as single parameter an {@link BoardMessage} object.
  * @param  {Object|null} [context=null] Callback context to apply on call.
  * @return {BoardSubscription}
  * @see {@link Board#publish}
  * @see {@link Board#unsubscribe}
  * @see {@link Board#deleteTopic}
  */
  subscribe(topic, callback, context = null) {
    // fix topic case
    topic = topic.trim().toLowerCase()

    // if first subscription, create new topic
    if (! this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Map())
    }

    // fix callback context
    context = context || callback

    // create new subscription
    let subscription = { uuid: uuid(), callback, context }

    // register new subscription
    this.subscriptions.get(topic).set(subscription.uuid, subscription)

    // return the subscription
    return subscription
  }

  /**
  * Unsubscribe from topic.
  *
  * @param  {BoardSubscription|String|Array} uuid Subscription, subscription uuid or callback function.
  * @return {Integer} Number of callback removed.
  * @see {@link Board#publish}
  * @see {@link Board#subscribe}
  * @see {@link Board#deleteTopic}
  */
  unsubscribe(uuid) {
    let removed = 0

    // unsubscribe an array of uuid or function
    if (Array.isArray(uuid)) {
      uuid.forEach(id => {
        removed += this.unsubscribe(id)
      })

      return removed
    }

    // unsubscribe from function
    if (typeof uuid === 'function') {
      for (let subscriptions of this.subscriptions.values()) {
        subscriptions.forEach(subscription => {
          if (subscription.callback === uuid) {
            removed += this.unsubscribe(subscription.uuid)
          }
        })
      }

      return removed
    }

    // unsubscribe from uuid string
    for (let topic of this.subscriptions.keys()) {
      if (this.subscriptions.get(topic).has(uuid)) {
        removed += this.subscriptions.get(topic).delete(uuid)

        if (this.subscriptions.get(topic).size === 0) {
          this.deleteTopic(topic)
        }

        return removed
      }
    }

    return removed
  }

  /**
  * Delete entire topic.
  *
  * @param  {String} topic Topic name, see {@link src/board/topics/index.js} for the topics list.
  * @return {Boolean} False if not found.
  * @see {@link Board#publish}
  * @see {@link Board#subscribe}
  * @see {@link Board#unsubscribe}
  */
  deleteTopic(topic) {
    if (this.subscriptions.get(topic)) {
      return this.subscriptions.delete(topic)
    }

    return false
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
  * var board = new Board({ address: '192.168.1.102' });
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
    // wrap request events
    settings.on = settings.on || {}

    for (let key in requestEventTypes) {
      let topic    = requestEventTypes[key]
      let callback = settings.on[topic]

      settings.on[topic] = event => {
        this.publish('command.' + topic, event)
        callback && callback(event)
      }
    }

    let boardCommand = new BoardCommand(this, command, settings)
    this.publish(boardTopics.COMMAND_CREATE, boardCommand)
    return boardCommand
  }

  /**
  * Send an command to the board.
  *
  * @param  {String} boardCommand
  * @return {Promise<RequestEvent>}
  */
  _sendCommand(boardCommand) {
    this.publish(boardTopics.COMMAND_SEND, boardCommand)

    return boardCommand.send()
    .then(event => {
      this.publish(boardTopics.COMMAND_RESPONSE, event)
      return Promise.resolve(event)
    })
    .catch(event => {
      this.publish(boardTopics.COMMAND_ERROR, event)
      return Promise.reject(event)
    })
  }

  /**
  * Create and send an command to the board.
  *
  * ```
  * var board = new Board({ address: '192.168.1.102' });
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
  * @see {@link Board#addCommand}
  * @see {@link Board#pushCommand}
  */
  sendCommand(command, settings = {}) {
    return this._sendCommand(this.createCommand(command, settings))
  }

  /**
  * Create and add the command in command queue.
  *
  * @param  {String} command         Command line.
  * @param  {Object} [settings = {}] Request settings (see {@link BoardCommand} for more details).
  * @return {BoardCommand}
  * @see {@link Board#sendCommand}
  * @see {@link Board#pushCommand}
  */
  addCommand(command, settings = {}) {
    let boardCommand = this.createCommand(command, settings)
    this.publish(boardTopics.COMMAND_QUEUE_ADD, boardCommand)
    this.commandQueue.push(boardCommand)
    return boardCommand
  }

  /**
  * Create and add the command in command queue,
  * then process the command queue if not in pause or locked.
  *
  * @param  {String} command         Command line.
  * @param  {Object} [settings = {}] Request settings (see {@link BoardCommand} for more details).
  * @return {BoardCommand}
  * @see {@link Board#sendCommand}
  * @see {@link Board#addCommand}
  */
  pushCommand(command, settings = {}) {
    let boardCommand = this.addCommand(command, settings)
    this.processCommandQueue()
    return boardCommand
  }

  /**
  * Process command queue.
  * @see {@link Board#pauseCommandQueue}
  * @see {@link Board#stopCommandQueue}
  * @see {@link Board#resumeCommandQueue}
  * @see {@link Board#clearCommandQueue}
  */
  processCommandQueue() {
    // command queue locked or empty ?
    if (this.commandQueueLocked
    || this.commandQueuePaused
    || ! this.commandQueue.length) {
      return
    }

    // lock the command queue
    this.commandQueueLocked = true

    // get the older command
    this.pendingCommand = this.commandQueue.shift()

    // end of queue
    if (! this.pendingCommand) {
      this.publish(boardTopics.COMMAND_QUEUE_EMPTY)
      return
    }

    this.publish(boardTopics.COMMAND_QUEUE_SEND, this.pendingCommand)

    this._sendCommand(this.pendingCommand)
    .then(event => event)
    .catch(event => event)
    .then(event => {
      // reset pending command
      this.pendingCommand = null

      // unlock the command queue
      this.commandQueueLocked = false

      // process next command in queue
      this.processCommandQueue()
    })
  }

  /**
  * Pause command queue but let the pending command terminate.
  * @see {@link Board#processCommandQueue}
  * @see {@link Board#stopCommandQueue}
  * @see {@link Board#resumeCommandQueue}
  * @see {@link Board#clearCommandQueue}
  */
  pauseCommandQueue() {
    this.commandQueuePaused = true
    this.publish(boardTopics.COMMAND_QUEUE_PAUSE, this.commandQueue)
  }

  /**
  * Abort the pending command.
  */
  abortPendingCommand() {
    if (this.pendingCommand) {
      this.pendingCommand.abort()
      this.pendingCommand = null
    }
  }

  /**
  * Pause command queue and abort the pending command.
  * @see {@link Board#processCommandQueue}
  * @see {@link Board#pauseCommandQueue}
  * @see {@link Board#resumeCommandQueue}
  * @see {@link Board#clearCommandQueue}
  */
  stopCommandQueue() {
    this.abortPendingCommand()
    this.pauseCommandQueue()
  }

  /**
  * Resume command queue.
  * @see {@link Board#processCommandQueue}
  * @see {@link Board#pauseCommandQueue}
  * @see {@link Board#stopCommandQueue}
  * @see {@link Board#clearCommandQueue}
  */
  resumeCommandQueue() {
    this.commandQueuePaused = false
    this.publish(boardTopics.COMMAND_QUEUE_RESUME, this.commandQueue)
    this.processCommandQueue()
  }

  /**
  * Clear command queue and abort the pending command.
  * @see {@link Board#processCommandQueue}
  * @see {@link Board#pauseCommandQueue}
  * @see {@link Board#stopCommandQueue}
  * @see {@link Board#resumeCommandQueue}
  */
  clearCommandQueue() {
    this.abortPendingCommand()
    this.publish(boardTopics.COMMAND_QUEUE_CLEAR, this.commandQueue)

    this.commandQueueLocked = false
    this.commandQueuePaused = false
    this.commandQueue       = []
  }

  /**
  * Get the board informations.
  *
  * @param  {Boolean} [refresh = false]
  * @return {Promise<BoardInfo|RequestEvent|Error>}
  */
  getInfo(refresh = false) {
    return new Promise((resolve, reject) => {
      if (! refresh && this.info) {
        resolve(this.info)
      }

      return this.sendCommand('version').then(event => {
        if (event.payload.data instanceof Error) {
          reject(event.payload.data)
        }

        this.info = new BoardInfo(event.payload.data)
        this.publish(boardTopics.INFO_UPDATE, this.info)
        resolve(this.info)
      })
      .catch(reject)
    })
  }

  /** @typedef {Map<String, BoardFolder|BoardFile>} BoardFileList */

  /**
  * Return a flat file tree for the given path.
  *
  * @param  {String}  [path    = '/']    Path to list file from.
  * @param  {Boolean} [refresh = false]  Force refresh (no cache).
  * @param  {Boolean} [firstCall = true] Used internaly for recursion.
  * @return {Promise<BoardFileList|RequestEvent|Error>}
  */
  listFiles(path = '/', refresh = false, firstCall = true) {
    // from cache
    path = normalizePath(path)

    let tree = path === '/' ? this.fileTree : this.fileTree.list(path)

    if (tree.size && ! refresh) {
      return Promise.resolve(tree)
    }

    // try to get the directory contents
    return this.sendCommand('ls -s ' + path).then(event => {
      // recursion...
      let promises = []

      if (event.payload.data instanceof Error) {
        return Promise.reject(event.payload.data)
      }

      // children collection (file or directory)
      event.payload.data.forEach(child => {
        // set new child
        this.fileTree.set(child)

        // get sub-directory contents
        if (child.type === 'folder') {
          promises.push(this.listFiles(child.path, true, false))
        }
      })

      // wait for all promises done
      return Promise.all(promises).then(results => {
        let tree = this.fileTree.list(path)

        if (firstCall) {
          this.publish(boardTopics.FILETREE_UPDATE, tree)
        }

        return Promise.resolve(tree)
      })
    })
  }

  /**
  * Clear state (M999).
  *
  * @return {Promise<RequestEvent>}
  */
  clearState() {
    return this.sendCommand('M999').then(event => {
      this.alarm = false
      return Promise.resolve(event)
    })
  }
}

// Exports
export default Board
export { Board }
