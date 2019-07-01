const { exit, removeFile, makeIndex } = require('../commons')

const usage = 'tools remove example <name>'

module.exports.default = function (args) {
  if (!args.length) {
    exit('Required parameter <name> is missing.', usage)
  }

  const name = args.shift()

  if (removeFile('../examples', name)) {
    makeIndex('../examples/index.js', '../examples')
  }
}
