import sh from '../src'

export default function ({ address }) {
  sh.commands.getPosition({
    address, // @esdoc address: '192.168.1.121',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> [
      //   {
      //     "key": "last_c",
      //     "coords": {
      //       "x": 20,
      //       "y": 50,
      //       "z": 10
      //     },
      //     "command": "M114",
      //     "description": "Position of all axes"
      //   },
      //   {
      //     "key": "realtime_wcs",
      //     "coords": {
      //       "x": 20,
      //       "y": 50,
      //       "z": 10
      //     },
      //     "command": "M114.1",
      //     "description": "Real time position of all axes"
      //   },
      //   {
      //     "key": "mcs",
      //     "coords": {
      //       "x": 20,
      //       "y": 50,
      //       "z": 10,
      //       "a": 0
      //     },
      //     "command": "M114.2",
      //     "description": "Real time machine position of all axes"
      //   },
      //   {
      //     "key": "apos",
      //     "coords": {
      //       "x": 20,
      //       "y": 50,
      //       "z": 10,
      //       "a": 0
      //     },
      //     "command": "M114.3",
      //     "description": "Real time actuator position of all actuators"
      //   },
      //   {
      //     "key": "mp",
      //     "coords": {
      //       "x": 20,
      //       "y": 50,
      //       "z": 10,
      //       "a": 0
      //     },
      //     "command": "M114.4",
      //     "description": "Last milestone"
      //   },
      //   {
      //     "key": "cmp",
      //     "coords": {
      //       "x": 20,
      //       "y": 50,
      //       "z": 10
      //     },
      //     "command": "M114.5",
      //     "description": "Last machine position"
      //   }
      // ]
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
