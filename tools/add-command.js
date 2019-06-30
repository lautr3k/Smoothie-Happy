const { resolve } = require('path')
const {
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync
} = require('fs')
const readlineSync = require('readline-sync')

const args = process.argv.slice(2)
const usageString = 'add-command <command-name>'
const srcPath = resolve(__dirname, `../src`)
const commandsPath = resolve(srcPath, `commands`)
const templatesPath = resolve(__dirname, `templates`)

function exit (message, usage = true) {
  console.error(`Error: ${message}`)
  usage && console.error(`\nUsage: ${usageString}`)
  process.exit(1)
}

if (!existsSync(commandsPath)) {
  exit(`Command path "${commandsPath}" not found.`, false)
}

if (!args.length) {
  exit('First argument <command-name> required.')
}

if (args.length > 1) {
  exit('Too many arguments.')
}

const commandName = args[0]
const commandPath = `${commandsPath}/${commandName}.js`

if (existsSync(commandPath)) {
  console.warn(`Warrning: Command file "${commandName}.js" already exists !`)
  const answer = readlineSync.question(`> Remove file ${commandName}.js ? (y/n) `)
  if (answer.toLowerCase() === 'n') {
    process.exit(1)
  }
}

const template = readFileSync(resolve(templatesPath, 'command.js'), 'utf8')
const commandFile = template.replace(/__dummyCommandName__/g, commandName)

writeFileSync(commandPath, commandFile)

let _import = []
let _export = []

readdirSync(commandsPath).forEach(file => {
  const fileName = file.slice(0, -3)
  _import.push(`import ${fileName} from './commands/${fileName}'`)
  _export.push(`  ${fileName}`)
})

_import = _import.join('\n')
_export = _export.join(',\n')

const commandsFile = `${_import}\n\nexport {\n${_export}\n}\n`
writeFileSync(resolve(srcPath, `commands.js`), commandsFile)

console.log(`Created command [${commandName}] at [${commandPath}].`)
