const { exit } = require('./commons')
const commands = require('./commands')

const args = process.argv.slice(2)
const usage = 'tools <command> [...args]'

if (!args.length) {
  exit('First argument <command> required.', usage)
}

const command = args.shift()
const type = args.shift()

if (!commands[command]) {
  exit(`Unsupported command : ${command} ${type}`, usage)
}

const commandTypes = commands[command]

if (!commandTypes[type]) {
  exit(`Unsupported command : ${command} ${type}`, usage)
}

commands[command][type](args)
