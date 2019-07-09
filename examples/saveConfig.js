import sh from '../src'

export default function ({ address, file }) {
  sh.commands.saveConfig({
    address, // @esdoc address: '192.168.1.121',
    file, // @esdoc file: 'custom-config.txt',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "file": "/sd/custom-config.txt"
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
