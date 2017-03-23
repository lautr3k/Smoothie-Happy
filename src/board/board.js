/**
* Board class.
*/
class Board {
  /**
  * @param {String|Object}      address|settings         Board address or settings.
  * @param {Object}             [settings]               Board settings.
  * @param {String}             [settings.address]       Board address (ip or hostname).
  * @param {Integer}            [settings.timeout]       Default response timeout in milliseconds for all commands.
  * @param {Integer|null|false} [settings.retryInterval] Retry interval in milliseconds for all commands.
  */
  constructor(address, settings = {}) {
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
    this.settings = settings
  }
}

// Exports
export default Board
export { Board }
