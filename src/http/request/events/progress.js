import RequestEvent from './request'
import ProgressPayload from '../payload/progress'

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
    * @type {String} name
    * @protected
    * @override
    */
    this.name = name

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
export default ProgressEvent
export { ProgressEvent }
