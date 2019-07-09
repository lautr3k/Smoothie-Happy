import sh from '../src'

export default function ({ address, name }) {
  sh.commands.getSwitch({
    address, // @esdoc address: '192.168.1.121',
    name, // @esdoc name: 'fan',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "name": "fan",
      //   "value": false
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
