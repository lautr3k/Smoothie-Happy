/**
* Board topics.
*
* @type {Object<String, String>}
*/
const boardTopics = {
  INFO_UPDATE    : 'info.update',     // payload: {BoardInfo}
  FILETREE_UPDATE: 'filetree.update', // payload: {BoardFileList}

  // REQUEST_XXX payload: {RequestEvent}
  REQUEST_RETRY       : 'request.retry',       // on retry planned
  REQUEST_RETRY_SEND  : 'request.retry.send',  // juste before retry
  REQUEST_RETRY_LIMIT : 'request.retry.limit', // on too many attemps

  REQUEST_DOWNLOAD_LOAD    : 'request.download.load',
  REQUEST_DOWNLOAD_ABORT   : 'request.download.abort',
  REQUEST_DOWNLOAD_ERROR   : 'request.download.error',
  REQUEST_DOWNLOAD_TIMEOUT : 'request.download.timeout',
  REQUEST_DOWNLOAD_PROGRESS: 'request.download.progress',

  REQUEST_UPLOAD_LOAD    : 'request.upload.load',
  REQUEST_UPLOAD_ABORT   : 'request.upload.abort',
  REQUEST_UPLOAD_ERROR   : 'request.upload.error',
  REQUEST_UPLOAD_TIMEOUT : 'request.upload.timeout',
  REQUEST_UPLOAD_PROGRESS: 'request.upload.progress'
}

export default boardTopics
export { boardTopics }
