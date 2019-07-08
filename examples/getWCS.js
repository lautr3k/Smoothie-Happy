import sh from '../src'

export default function ({ address }) {
  sh.commands.getWCS({
    address, // @esdoc address: '192.168.1.121',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "current": "G54",
      //   "G54": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "G55": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "G56": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "G57": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "G58": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "G59": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "G59.1": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "G59.2": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "G59.3": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "G28": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "G30": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "G92": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "tool": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   },
      //   "prob": {
      //     "x": 0,
      //     "y": 0,
      //     "z": 0
      //   }
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
