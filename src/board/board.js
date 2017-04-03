import uuid from 'uuid/v4'
import boardSettings from './settings'
import BoardRequest from './request'
import BoardCommand from './command'
import { normalizePath } from './util'
import boardTopics from './topics'
import BoardInfo from './info'

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
    * @type {Object|null}
    * @default null
    * @protected
    */
    this.info = null

    /**
    * Flat files tree.
    * @type {BoardFolder}
    * @protected
    */
    this.fileTree = new BoardFolder('/')
  }

  /**
  * Publish an event, see {@link src/board/topics/index.js} for the topics list.
  *
  * @param {String} topic See {@link src/board/topics/index.js} for possible values.
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

  /**
  * Get the board informations.
  *
  * @param  {Boolean} [refresh = false]
  * @return {Promise<Object|RequestEvent>}
  */
  getInfo(refresh = false) {
    return new Promise((resolve, reject) => {
      if (! refresh && this.info) {
        resolve(this.info)
      }

      return this.sendCommand('version').then(event => {
        this.info = new BoardInfo(event.payload.data)
        this.publish(boardTopics.INFO_UPDATE, this.info)
        resolve(this.info)
      })
      .catch(reject)
    })
  }

  /**
  * Get the files tree (recursive).
  *
  * @param  {String}  [path    = '/']
  * @param  {Boolean} [refresh = false]
  * @return {Promise<BoardFolder|RequestEvent>}
  */
  listFiles(path = '/', refresh = false) {
    // execute all commands in a promise
    return new Promise((resolve, reject) => {
      // get first directory contents
      return this.sendCommand('ls -s ' + path).then(event => {
        // create main folder
        let folder = new BoardFolder(path)

        // add direct children
        let children = folder.addChildren(event.payload.data)

        // scan sub-directories
        let promises = []

        children.forEach(child => {
          if (child instanceof BoardFolder) {
            promises.push(this.sendCommand('ls -s ' + child.path).then(f => {
              child.addChildren(f.payload.data)
            }))
          }
        })

        // wait for all promises done
        return Promise.all(promises).then(results => {
          // update board file tree
          if (folder.path === '/') {
            this.fileTree = folder
            this.publish(boardTopics.FILETREE_UPDATE, folder)
          }

          resolve(folder)
        })
      })
      // rejected promise
      .catch(reject)
    })
  }
}

class BoardFile {
  constructor(file, parent) {
    this.parent    = parent
    this.size      = file.size
    this.path      = file.path
    this.name      = file.name
    this.extension = file.extension
  }
}

class BoardFolder {
  constructor(path, parent = null) {
    this.path     = normalizePath(path)
    this.name     = this.path.split('/').pop()
    this.parent   = parent
    this.children = []
    this.size     = 0
  }

  addFile(file) {
    // update folder size
    this.size += file.size

    // update parent folder size
    if (this.parent) {
      this.parent.size += file.size
    }

    // create, add and return the new file
    let boardFile = new BoardFile(file, this)

    this.children.push(boardFile)

    return boardFile
  }

  addFolder(folder) {
    // create, add and return the new folder
    let boardFolder = new BoardFolder(folder.path, this)

    this.children.push(boardFolder)

    return boardFolder
  }

  addChild(child) {
    if (child.type === 'file') {
      return this.addFile(child)
    }

    return this.addFolder(child)
  }

  addChildren(children) {
    let results = []

    children.forEach(child => {
      results.push(this.addChild(child))
    })

    return results
  }
}

// Exports
export default Board
export { Board }
