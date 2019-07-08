const { resolve, relative, dirname } = require('path')
const {
  existsSync,
  readdirSync,
  writeFileSync,
  readFileSync,
  unlinkSync
} = require('fs')
const readlineSync = require('readline-sync')

function exit (message, usage = null) {
  message && console.error(`Error: ${message}`)
  usage && console.error(`Usage: ${usage}`)
  process.exit(1)
}

function makeIndex (filePath, fromPath) {
  filePath = resolve(__dirname, filePath)
  fromPath = resolve(__dirname, fromPath)

  if (!existsSync(fromPath)) {
    exit(`Command path "${fromPath}" not found.`)
  }

  let relativePath = relative(dirname(filePath), fromPath)
  let _imports = []
  let _exports = []
  const ignores = ['index.js', 'error-types.js', 'factory.js']

  readdirSync(fromPath).forEach(file => {
    if (ignores.includes(file)) {
      return // skip index
    }
    const fileName = file.slice(0, -3)
    const from = [relativePath, fileName].filter(f => f.length).join('/')
    _imports.push(`import ${fileName} from './${from}'`)
    _exports.push(`  ${fileName}`)
  })

  _imports = _imports.join('\n')
  _exports = _exports.join(',\n')

  console.info(`Writing: ${filePath}`)
  writeFileSync(filePath, `${_imports}\n\nexport {\n${_exports}\n}\n`)
  console.info('Done!')
}

function makeTemplate (templateName, targetPath, targetName, tokens) {
  const templatePath = resolve(__dirname, 'templates', `${templateName}.js`)
  if (!existsSync(templatePath)) {
    exit(`Template file "${templatePath}" not found.`)
  }

  targetPath = resolve(__dirname, targetPath)

  if (!existsSync(targetPath)) {
    exit(`Target path "${targetPath}" not found.`)
  }

  const targetFile = resolve(targetPath, `${targetName}.js`)

  if (existsSync(targetFile)) {
    console.warn(`WARNING: File "${targetName}.js" already exists !`)
    const answer = readlineSync.question(`> Remove file ${targetName}.js ? (y/n) `)
    if (answer.toLowerCase() === 'n') {
      process.exit(1)
    }
  }

  let template = readFileSync(templatePath, 'utf8')
  tokens.forEach(token => {
    template = template.replace(new RegExp(`${token.name}`, 'g'), token.value)
  })

  console.info(`Writing: ${targetFile}`)
  writeFileSync(targetFile, template)
  console.info('Done!')
}

function removeFile (targetPath, targetName) {
  targetPath = resolve(__dirname, targetPath)

  if (!existsSync(targetPath)) {
    exit(`Target path "${targetPath}" not found.`)
  }

  const targetFile = resolve(targetPath, `${targetName}.js`)

  if (existsSync(targetFile)) {
    unlinkSync(targetFile)
    return true
  }
  return false
}

module.exports = {
  exit,
  makeIndex,
  makeTemplate,
  removeFile
}
