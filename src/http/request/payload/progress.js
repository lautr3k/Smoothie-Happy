/**
* Progression payload.
*/
class Progress {
  /**
  * @param {ProgressEvent} event Original progress event.
  */
  constructor(event) {
    /**
    * Total bytes.
    * @type {Integer}
    * @protected
    */
    this.total = event.total || 0

    /**
    * Loaded bytes.
    * @type {Integer}
    * @protected
    */
    this.loaded = event.loaded || 0

    /**
    * Is computable.
    * @type {Boolean}
    * @protected
    */
    this.computable = event.lengthComputable

    /**
    * Loaded percent.
    * @type {Integer}
    * @protected
    */
    this.percent = this.computable ? parseInt(this.loaded / this.total * 100) : 0
  }
}

// Exports
export default Progress
export { Progress }
