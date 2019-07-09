import sh from '../src'

export default function ({ address, option, value }) {
  sh.commands.configCache({
    address, // @esdoc address: '192.168.1.121',
    option, // @esdoc option: 'checksum',
    value, // @esdoc value: '42',
    timeout: 0
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // [option = 'load'] >>> {
      //   "message": "config cache loaded"
      // }
      // [option = 'unload'] >>> {
      //   "message": "config cache unloaded"
      // }
      // [option = 'dump'] >>> {
      //   "dump": "Too long to print here..."
      // }
      // [option = 'checksum'] >>> {
      //   "value": "42",
      //   "checksum": "9A66 00 00"
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
