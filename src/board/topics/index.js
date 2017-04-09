/**
* Board topics.
*
* @type {Object<String, String>}
*/
const boardTopics = {
  INFO_UPDATE    : 'info.update',     // payload: {BoardInfo}
  FILETREE_UPDATE: 'filetree.update', // payload: {BoardFileList}

  COMMAND_QUEUE_ADD   : 'command.queue.add'   , // payload: {BoardCommand}
  COMMAND_QUEUE_SEND  : 'command.queue.send'  , // payload: {BoardCommand}
  COMMAND_QUEUE_EMPTY : 'command.queue.empty' , // payload: {null}
  COMMAND_QUEUE_PAUSE : 'command.queue.pause' , // payload: {Board.commandQueue}
  COMMAND_QUEUE_RESUME: 'command.queue.resume', // payload: {Board.commandQueue}
  COMMAND_QUEUE_CLEAR : 'command.queue.clear' , // payload: {Board.commandQueue}

  COMMAND_CREATE  : 'command.create',   // payload: {BoardCommand}
  COMMAND_SEND    : 'command.send',     // payload: {BoardCommand}
  COMMAND_ERROR   : 'command.error',    // payload: {RequestEvent}
  COMMAND_RESPONSE: 'command.response', // payload: {RequestEvent}

  // COMMAND_XXX payload: {RequestEvent}
  COMMAND_RETRY       : 'command.retry',       // on retry planned
  COMMAND_RETRY_SEND  : 'command.retry.send',  // juste before retry
  COMMAND_RETRY_LIMIT : 'command.retry.limit', // on too many attemps

  COMMAND_DOWNLOAD_LOAD    : 'command.download.load',
  COMMAND_DOWNLOAD_ABORT   : 'command.download.abort',
  COMMAND_DOWNLOAD_ERROR   : 'command.download.error',
  COMMAND_DOWNLOAD_TIMEOUT : 'command.download.timeout',
  COMMAND_DOWNLOAD_PROGRESS: 'command.download.progress',

  COMMAND_UPLOAD_LOAD    : 'command.upload.load',
  COMMAND_UPLOAD_ABORT   : 'command.upload.abort',
  COMMAND_UPLOAD_ERROR   : 'command.upload.error',
  COMMAND_UPLOAD_TIMEOUT : 'command.upload.timeout',
  COMMAND_UPLOAD_PROGRESS: 'command.upload.progress',

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
