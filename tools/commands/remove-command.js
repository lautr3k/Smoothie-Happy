const { exit, removeFile, makeIndex } = require('../commons')

const usage = 'tools remove command <name>'

module.exports.default = function (args) {
  if (!args.length) {
    exit('Required parameter <name> is missing.', usage)
  }

  const name = args.shift()

  if (removeFile('../src/commands', name)) {
    makeIndex('../src/commands.js', '../src/commands')
  }
}
