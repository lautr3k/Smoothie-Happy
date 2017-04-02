/**
* Response payload.
*/
class RequestResponsePayload {
  /**
  * @param {XMLHttpRequest} xhr    An `XMLHttpRequest` instance.
  * @param {Function}       filter Response filter.
  */
  constructor(xhr, filter = null) {
    /**
    * Response status code.
    * @type {Integer}
    * @protected
    */
    this.status = xhr.status

    /**
    * Respons status text.
    * @type {String}
    * @protected
    */
    this.message = xhr.statusText

    /**
    * Response data.
    * @type {Mixed}
    * @protected
    */
    this.data = xhr.response

    if (typeof filter === 'function') {
      this.data = filter(this.data)
    }
  }
}

// Exports
export default RequestResponsePayload
export { RequestResponsePayload }
