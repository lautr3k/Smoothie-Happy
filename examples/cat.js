import sh from '../src'

export default function ({ address, file }) {
  sh.commands.cat({
    address, // @esdoc address: '192.168.1.121',
    file, // @esdoc file: '/sd/config.txt',
    timeout: 0
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "text": "# Smoothieboard configuration file..."
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
