import sh from '../src'

export default function ({ address }) {
  sh.commands.getStatus({
    address, // @esdoc address: '192.168.1.121',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "state": "Idle",
      //   "idle": true,
      //   "alarm": false,
      //   "homming": false,
      //   "holding": false,
      //   "running": false,
      //   "machine": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0,
      //     "a": 0
      //   },
      //   "workspace": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "feedrate": {
      //     "current": 4000,
      //     "requested": 100
      //   },
      //   "heaters": [
      //     {
      //       "designator": "T",
      //       "currentTemp": Infinity,
      //       "targetTemp": 0
      //     },
      //     {
      //       "designator": "B",
      //       "currentTemp": Infinity,
      //       "targetTemp": 0
      //     }
      //   ]
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
