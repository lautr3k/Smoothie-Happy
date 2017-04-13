import BoardRequest from './request'
import * as boardCommands from './commands'
import boardTopics from './topics'

/**
* Board request.
* @extends {BoardRequest}
*/
class BoardCommand extends BoardRequest {
  /**
  * @param {Board}  board       Board instance.
  * @param {Board}  commandLine Command line, see {@link src/board/commands/index.js} for a list of implemented commands.
  * @param {Object} settings    See {@link src/board/settings.js~boardSettings}.request for defaults keys/values.
  * @param {Object} [settings.parseResponse = true] See {@link src/board/settings.js~boardSettings}.request for defaults keys/values.
  */
  constructor(board, commandLine, settings = {}) {
    // Normalize and split the command line
    commandLine = commandLine.trim().replace(/ +/g, ' ')

    let commandArgs = commandLine.split(' ')
    let commandName = commandArgs.shift().toLowerCase()

    // parse response by default
    if (settings.parseResponse === undefined) {
      settings.parseResponse = true
    }

    // response...
    let response = r => {
      let raw = r.trim()

      if (raw.startsWith('error:Unsupported command')) {
        throw new Error('Unsupported command "' + commandName + '".')
      }

      // alarm/error ?
      let test = raw.slice(0, 30).toLowerCase()

      // ! fire return empty string if laser module not enabled, even if state is not in alarm mode... !
      if (! raw.length && ['fire', 'play', 'progress', 'abort', 'suspend', 'resume'].includes(commandName)) {
        test = '!!'
      }

      if (test === '!!' || test.startsWith('alarm') || test.startsWith('error')) {
        if (! board.alarm) {
          board.alarm = true
          board.publish(boardTopics.STATE_ALARM)
        }

        throw new Error('Alarm! System probably halted.')
      }

      if (commandName === 'M999') {
        board.publish(boardTopics.STATE_CLEAR, test !== 'ok')
      }

      // response parser
      let responseParser = boardCommands['cmd_' + commandName]

      if (! responseParser && settings.parseResponse) {
        throw new Error('Sorry! The "' + commandName + '" command is not (yet) implemented.')
      }

      // return (parsed) response
      let args = [].concat(commandArgs) // make a copy

      return settings.parseResponse ? responseParser(r, args) : r
    }

    // call parent constructor
    super(board, Object.assign({}, board.settings.request, settings, {
      data   : commandLine + '\n',
      url    : 'command',
      method : 'POST',
      filters: { response }
    }))

    /**
    * Board instance.
    * @type {Board}
    * @protected
    */
    this.board = board

    /**
    * Command line.
    * @type {String}
    * @protected
    */
    this.commandLine = commandLine

    /**
    * Command name.
    * @type {String}
    * @protected
    */
    this.commandName = commandName

    /**
    * Command arguments.
    * @type {Array}
    * @protected
    */
    this.commandArgs = commandArgs
  }

  /**
  * Send the request and return a Promise.
  *
  * @return {Promise<RequestEvent>}
  */
  send() {
    if (this.commandName === 'break') {
      this.board.MRIMode = true
      this.board.publish(boardTopics.STATE_MRI)
      // Fix for break command never respond
      this.settings.timeout     = 5000 // 5 seconds
      this.settings.maxAttempts = 1
    }

    return super.send()
  }
}

// Exports
export default BoardCommand
export { BoardCommand }
