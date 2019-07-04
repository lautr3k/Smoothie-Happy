// https://medium.com/trabe/having-fun-with-esdoc-plugins-49bd644b99e2
const path = require('path')
const fs = require('fs')

const inject = (content, sourcePath, format) => {
  return content.replace(/\[EXAMPLE (.*)\]/g, (_, injectPath) => {
    const all = injectPath.startsWith('-a')
    if (all) {
      injectPath = injectPath.slice(3)
    }
    const codePath = path.resolve(path.dirname(sourcePath), injectPath)
    try {
      let code = fs.readFileSync(codePath).toString()
      if (!all) {
        code = code.replace(/sh\.(commands\.)?/g, '')
        code = code.split('\n').slice(3, -1)
        code = code.map(line => {
          line = line.slice(2)
          const matches = line.match(/( +)?(.*) \/\/ @esdoc (.*)/)
          if (matches) {
            return (matches[1] || '') + matches[3].trim()
          }
          return line
        })
        code = code.filter(line => line.length).join('\n')
      }
      return format(code)
    } catch (e) {
      console.log(e)
      console.error(`[ERROR] CANNOT INJECT EXAMPLE ${codePath}`, sourcePath)
      return `[EXAMPLE  ERROR! ${injectPath}]`
    }
  })
}

module.exports = {
  onHandleCode (event) {
    const commentsFormatter = code => {
      const lines = code.split('\n')
      return [lines[0], ...lines.slice(1).map(line => ` * ${line}`)].join('\n')
    }
    event.data.code = inject(event.data.code, event.data.filePath, commentsFormatter)
  },
  onHandleDocs (event) {
    event.data.docs.forEach(doc => {
      const fencesFormatter = code => `\`\`\`\n${code}\n\`\`\``
      if (doc.longname.match(/\.md$/)) {
        doc.content = inject(doc.content, doc.longname, fencesFormatter)
      }
    })
  }
}
