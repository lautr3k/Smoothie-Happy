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
      // [ device: 'all' ] >>> {
      //   "devices": [
      //     {
      //       "currentTemp": null,
      //       "targetTemp": 0,
      //       "pwm": 0,
      //       "id": 57988,
      //       "designator": "T"
      //     },
      //     {
      //       "currentTemp": null,
      //       "targetTemp": 0,
      //       "pwm": 0,
      //       "id": 22060,
      //       "designator": "B"
      //     }
      //   ]
      // }
      // [ device: 'bed' ] >>> {
      //   "currentTemp": null,
      //   "targetTemp": 0,
      //   "pwm": 0,
      //   "name": "bed"
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
