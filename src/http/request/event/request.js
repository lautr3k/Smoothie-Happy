/**
* @external {ProgressEvent} https://developer.mozilla.org/fr/docs/Web/API/ProgressEvent
*/

/**
* Request event.
*/
class RequestEvent {
  /**
  * @param {String}                  type    Event type, see {@link src/http/request/event/types.js} for possible values.
  * @param {ProgressEvent}           event   Original progress event.
  * @param {Request}                 request Request instance.
  * @param {Progress|Response|Error} payload Request payload.
  */
  constructor(type, event, request, payload = null) {
    /**
    * Event type, see {@link src/http/request/event/types.js} for possible values.
    * @type {String}
    * @protected
    */
    this.type = type

    /**
    * Original progress event.
    * @type {ProgressEvent}
    * @protected
    */
    this.event = event

    /**
    * Request instance.
    * @type {Request}
    * @protected
    */
    this.request = request

    /**
    * Event payload.
    * @type {Mixed}
    * @protected
    */
    this.payload = payload
  }
}

// Exports
export default RequestEvent
export { RequestEvent }
