import sh from '../src'

export default function ({ address, device }) {
  sh.commands.getTemp({
    address, // @esdoc address: '192.168.1.121',
    device, // @esdoc device: 'all',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "devices": [
      //     {
      //       "name": "hotend",
      //       "currentTemp": 0,
      //       "targetTemp": 0,
      //       "pwm": 0
      //     },
      //     {
      //       "name": "bed",
      //       "currentTemp": 0,
      //       "targetTemp": 0,
      //       "pwm": 0
      //     }
      //   ]
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
