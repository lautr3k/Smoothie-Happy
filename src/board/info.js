/**
* Board info.
*/
class BoardInfo {
  /**
  * @param {Object} info Object from the `version` command.
  */
  constructor(info) {
    /**
    * @type {String}
    * @protected
    */
    this.branch = null

    /**
    * @type {String}
    * @protected
    */
    this.hash = null

    /**
    * @type {String}
    * @protected
    */
    this.date = null

    /**
    * @type {String}
    * @protected
    */
    this.mcu = null

    /**
    * @type {String}
    * @protected
    */
    this.clock = null

    // merge info object
    Object.assign(this, info)
  }
}

// Exports
export default BoardInfo
export { BoardInfo }
