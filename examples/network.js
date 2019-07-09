import sh from '../src'

export default function ({ address }) {
  sh.commands.network({
    address, // @esdoc address: '192.168.1.121',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "address": "192.168.1.121",
      //   "gateway": "192.168.1.1",
      //   "mask": "255.255.255.0",
      //   "MAC": "00:1F:11:02:04:19"
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
