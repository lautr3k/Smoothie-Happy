const { exit, makeTemplate, makeIndex } = require('../commons')
const readlineSync = require('readline-sync')
const addExample = require('./add-example').default

const usage = 'tools add command <name>'

module.exports.default = function (args) {
  if (!args.length) {
    exit('Required parameter <name> is missing.', usage)
  }

  const name = args.shift()

  makeTemplate('command', '../src/commands', name, [
    { name: '__dummyCommandName__', value: name }
  ])

  makeIndex('../src/commands/index.js', '../src/commands')

  const answer = readlineSync.question(`> Add example file ? (y/n) `)
  if (answer.toLowerCase() === 'y') {
    addExample([ name ])
  }
}
