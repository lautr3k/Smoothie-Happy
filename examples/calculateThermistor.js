import sh from '../src'

export default function ({ address, values, save }) {
  sh.commands.calculateThermistor({
    address, // @esdoc address: '192.168.1.121',
    values, // @esdoc values: [25, 100000.0, 150, 1655.0, 240, 269.0],
    save, // @esdoc save: 0,
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "message": "Setting Thermistor 0 to those settings, save with M500",
      //   "I": "0.000722376862540841",
      //   "J": "0.000216302098124288",
      //   "K": "0.000000092640163984"
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
