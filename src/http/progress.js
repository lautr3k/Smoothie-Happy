/**
* Progress event abstraction class.
*/
class Progress {
  /**
  * @param {window.ProgressEvent} event Original progress event.
  */
  constructor(event) {
    /**
    * Total bytes.
    * @type {Integer}
    * @protected
    */
    this.total = event.total

    /**
    * Loaded bytes.
    * @type {Integer}
    * @protected
    */
    this.loaded = event.loaded

    /**
    * Loaded percent.
    * @type {Integer}
    * @protected
    */
    this.percent = parseInt(event.loaded / event.total * 100)
  }
}

// Exports
export default Progress
export { Progress }
