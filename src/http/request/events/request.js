import ResponsePayload from '../payload/response'

/**
* Request event.
*/
class RequestEvent {
  /**
  * @param {String}  name    Event name, possible values is `[upload.]load`, `[upload.]timeout`, `[upload.]abort` or `[upload.]error`.
  * @param {Request} request Original request.
  */
  constructor(name, request) {
    /**
    * Possible values is `[upload.]load`, `[upload.]timeout`, `[upload.]abort` or `[upload.]error`.
    * @type {String}
    * @protected
    */
    this.name = name

    /**
    * Request instance.
    * @type {Request}
    * @protected
    */
    this.request = request

    /**
    * Response instance.
    * @type {Response}
    * @protected
    */
    this.response = new ResponsePayload(request.xhr)
  }
}

// Exports
export default RequestEvent
export { RequestEvent }
