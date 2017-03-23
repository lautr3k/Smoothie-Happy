/**
* XMLHttpRequest response abstraction class.
*/
class Response {
  /**
  * @param {XMLHttpRequest} xhr An `XMLHttpRequest` instance.
  */
  constructor(xhr) {
    /**
    * Response time.
    * @type {Integer}
    * @protected
    */
    this.time = Date.now()

    // text/xml response available ?
    let responseText = null
    let responseXML  = null

    if (xhr.responseType === '' || xhr.responseType === 'document') {
      responseText = xhr.responseText
      responseXML  = xhr.responseXML
    }

    /**
    * Response status code.
    * @type {Integer}
    * @protected
    */
    this.code = xhr.status

    /**
    * Respons status text.
    * @type {String}
    * @protected
    */
    this.message = xhr.statusText

    /**
    * Response type.
    * @type {String}
    * @protected
    */
    this.type = xhr.responseType

    /**
    * Response url.
    * @type {String}
    * @protected
    */
    this.url = xhr.responseURL

    /**
    * Response XML.
    * @type {String}
    * @protected
    */
    this.xml = responseXML

    /**
    * Response text.
    * @type {String}
    * @protected
    */
    this.text = responseText

    /**
    * Raw response.
    * @type {Mixed}
    * @protected
    */
    this.raw = xhr.response
  }
}

// Exports
export default Response
export { Response }
