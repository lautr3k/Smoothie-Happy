import sh from '../src'

export default function ({ address, axis, distance, iterations, feedrate }) {
  sh.commands.testJog({
    address, // @esdoc address: '192.168.1.121',
    axis, // @esdoc axis: 'x',
    distance, // @esdoc distance: 10,
    iterations, // @esdoc iterations: 10,
    feedrate, // @esdoc feedrate: 3000,
    timeout: 0
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "millis": 9906,
      //   "gcode": [
      //     "G91 G0 X10.000000 F3000.000000 G90",
      //     "G91 G0 X-10.000000 F3000.000000 G90",
      //     "G91 G0 X10.000000 F3000.000000 G90",
      //     "G91 G0 X-10.000000 F3000.000000 G90",
      //     "G91 G0 X10.000000 F3000.000000 G90",
      //     "G91 G0 X-10.000000 F3000.000000 G90",
      //     "G91 G0 X10.000000 F3000.000000 G90",
      //     "G91 G0 X-10.000000 F3000.000000 G90",
      //     "G91 G0 X10.000000 F3000.000000 G90",
      //     "G91 G0 X-10.000000 F3000.000000 G90"
      //   ]
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
