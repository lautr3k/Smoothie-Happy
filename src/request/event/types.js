/**
* Request event types.
*
* ```
* // Custom Request events
* RETRY       = 'retry'       // on retry planned
* RETRY_SEND  = 'retry.send'  // juste before retry
* RETRY_LIMIT = 'retry.limit' // on too many attemps
*
* // XMLHttpRequest events
* DOWNLOAD_LOAD     = 'download.load'
* DOWNLOAD_ABORT    = 'download.abort'
* DOWNLOAD_ERROR    = 'download.error'
* DOWNLOAD_TIMEOUT  = 'download.timeout'
* DOWNLOAD_PROGRESS = 'download.progress'
*
* UPLOAD_LOAD     = 'upload.load'
* UPLOAD_ABORT    = 'upload.abort'
* UPLOAD_ERROR    = 'upload.error'
* UPLOAD_TIMEOUT  = 'upload.timeout'
* UPLOAD_PROGRESS = 'upload.progress'
* ```
*
* @type {Object<String, String>}
*/
const requestEventTypes = {
  RETRY       : 'retry',
  RETRY_SEND  : 'retry.send',
  RETRY_LIMIT : 'retry.limit',

  DOWNLOAD_LOAD    : 'download.load',
  DOWNLOAD_ABORT   : 'download.abort',
  DOWNLOAD_ERROR   : 'download.error',
  DOWNLOAD_TIMEOUT : 'download.timeout',
  DOWNLOAD_PROGRESS: 'download.progress',

  UPLOAD_LOAD    : 'upload.load',
  UPLOAD_ABORT   : 'upload.abort',
  UPLOAD_ERROR   : 'upload.error',
  UPLOAD_TIMEOUT : 'upload.timeout',
  UPLOAD_PROGRESS: 'upload.progress'
}

export default requestEventTypes
export { requestEventTypes }