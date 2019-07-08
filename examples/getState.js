import sh from '../src'

export default function ({ address }) {
  sh.commands.getState({
    address, // @esdoc address: '192.168.1.121',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "modal": "G0",
      //   "wcs": "G54",
      //   "planeSelection": "G17",
      //   "unit": "G21",
      //   "distanceMode": "G90",
      //   "pathControl": "G94",
      //   "programPause": "M0",
      //   "stopTool": "M5",
      //   "stopCoolant": "M9",
      //   "tool": "T0",
      //   "feedRate": "F4000.0000",
      //   "sValue": "S0.8000"
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
