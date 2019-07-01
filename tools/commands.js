const addCommand = require('./commands/add-command')
const addExample = require('./commands/add-example')
const removeCommand = require('./commands/remove-command')
const removeExample = require('./commands/remove-example')

module.exports = {
  add: {
    command: addCommand.default,
    example: addExample.default
  },
  remove: {
    command: removeCommand.default,
    example: removeExample.default
  }
}
