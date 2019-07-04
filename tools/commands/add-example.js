const { exit, makeTemplate, makeIndex } = require('../commons')

const usage = 'tools add example <name>'

module.exports.default = function (args) {
  if (!args.length) {
    exit('Required parameter <name> is missing.', usage)
  }

  const name = args.shift()

  makeTemplate('example', '../examples', name, [
    { name: '__dummyCommandName__', value: name }
  ])

  makeIndex('../examples/index.js', '../examples')
}
