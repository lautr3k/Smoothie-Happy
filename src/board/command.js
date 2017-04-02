import BoardRequest from './request'
import * as boardCommands from './commands'

/**
* Board request.
* @extends {BoardRequest}
*/
class BoardCommand extends BoardRequest {
  /**
  * @param {Board}  board       Board instance.
  * @param {Board}  commandLine Command line, see {@link src/board/commands/index.js} for a list of implemented commands.
  * @param {Object} settings    See {@link src/board/settings.js~boardSettings}.request for defaults keys/values.
  */
  constructor(board, commandLine, settings = {}) {
    // Normalize and split the command line
    commandLine = commandLine.trim().replace(/ +/g, ' ')

    let commandArgs = commandLine.split(' ')
    let commandName = commandArgs.shift()

    // not yet implemented
    let response

    if (! boardCommands[commandName]) {
      response = response => { throw new Error('Sorry! The "' + commandName + '" command is not (yet) implemented.') }
    }
    else {
      response = response => boardCommands[commandName](response, commandArgs)
    }

    // call parent constructor
    super(board, Object.assign({}, board.settings.request, settings, {
      data   : commandLine + '\n',
      url    : 'command',
      method : 'POST',
      filters: { response }
    }))

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
}

// Exports
export default BoardCommand
export { BoardCommand }
