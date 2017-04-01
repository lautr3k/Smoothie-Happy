/**
* Attempt payload.
*/
class Attempt {
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
export default Attempt
export { Attempt }
