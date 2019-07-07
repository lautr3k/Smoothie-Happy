import sh from '../src'

export default function ({ address }) {
  sh.commands.version({
    address, // @esdoc address: '192.168.1.121',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "branch": "edge",
      //   "hash": "5829d90",
      //   "date": "Mar  3 2019 14:54:42",
      //   "mcu": "LPC1769",
      //   "clock": "120MHz",
      //   "axis": 5
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
