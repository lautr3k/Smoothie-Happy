import Response from './response'

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
    this.response = new Response(request.xhr)
  }
}

/**
* Progress event paylod.
*/
class ProgressPayload {
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

/**
* Custom progress event.
*/
class ProgressEvent extends RequestEvent {
  /**
  * @param   {String}               name    Event name, possible values is `progress` or `upload.progress`.
  * @param   {Request}              request Original request.
  * @param   {window.ProgressEvent} event   Original progress event.
  */
  constructor(name, request, event) {
    // call parent constructor
    super(name, request)

    /**
    * Possible values is `progress` or `upload.progress`.
    * @type {String}
    * @protected
    */

    /**
    * Original `ProgressEvent` instance.
    * @type {window.ProgressEvent}
    * @protected
    */
    this.originalEvent = event

    /**
    * Progress event payload or null if not computable.
    * @type {ProgressPayload|null}
    * @protected
    */
    this.data = ! event.lengthComputable ? null : new ProgressPayload(event)
  }
}

// Exports
export { RequestEvent, ProgressEvent, ProgressPayload }
