import sh from '../src'

console.log(`smoothie-happy v${sh.version}`, sh)

// sh.command({
//   address: '192.168.1.121',
//   command: 'version'
// })
//   .then(response => {
//     console.log('response:', response)
//   })
//   .catch(error => {
//     console.log('error:', error)
//   })

// sh.commands.version({
//   address: '192.168.1.121'
// })
//   .then(response => {
//     console.log('response:', response)
//   })
//   .catch(error => {
//     console.log('error:', error)
//   })

sh.commands.ls({
  address: '192.168.1.121',
  path: '/sd',
  getSize: true,
  recursive: true,
  onFile (file) {
    console.log('file:', file)
  }
})
  .then(response => {
    console.log('response:', response)
    console.log(response.data.map(file => file.path))
  })
  .catch(error => {
    console.log('error:', error)
  })
