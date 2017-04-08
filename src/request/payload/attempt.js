/**
* Attempt payload.
*/
class RequestAttemptPayload {
  /**
  * @param {Request} request
  */
  constructor(request) {
    /**
    * Number of executed attempts.
    * @type {Integer}
    * @protected
    */
    this.done = request.attempts

    /**
    * Attempts number.
    * @type {Integer}
    * @protected
    */
    this.num = this.done + 1

    /**
    * Maximum number of attempts.
    * @type {Integer}
    * @protected
    */
    this.max = request.settings.maxAttempts

    /**
    * Delay between two attempt.
    * @type {Integer}
    * @protected
    */
    this.delay = request.settings.attemptDelay
  }
}

// Exports
export default RequestAttemptPayload
export { RequestAttemptPayload }
