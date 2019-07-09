import sh from '../src'

export default function ({ address, device, value }) {
  sh.commands.setTemp({
    address, // @esdoc address: '192.168.1.121',
    device, // @esdoc device: 'hotend',
    value, // @esdoc value: 190,
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "device": "hotend",
      //   "value": 190
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
