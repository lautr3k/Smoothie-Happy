const { exit, makeTemplate, makeIndex } = require('../commons')

const usage = 'tools add command <name>'

module.exports.default = function (args) {
  if (!args.length) {
    exit('Required parameter <name> is missing.', usage)
  }

  const name = args.shift()

  makeTemplate('command', '../src/commands', name, [
    { name: '__dummyCommandName__', value: name }
  ])

  makeIndex('../src/commands.js', '../src/commands')
}
