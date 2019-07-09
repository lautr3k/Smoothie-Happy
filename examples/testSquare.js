import sh from '../src'

export default function ({ address, size, iterations, feedrate }) {
  sh.commands.testSquare({
    address, // @esdoc address: '192.168.1.121',
    size, // @esdoc size: 10,
    iterations, // @esdoc iterations: 5,
    feedrate, // @esdoc feedrate: 3000,
    timeout: 0
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "millis": 998,
      //   "gcode": [
      //     "G91 G0 X10.000000 F3000.000000",
      //     "G0 Y10.000000",
      //     "G0 X-10.000000",
      //     "G0 Y-10.000000 G90",
      //     "G91 G0 X10.000000 F3000.000000",
      //     "G0 Y10.000000",
      //     "G0 X-10.000000",
      //     "G0 Y-10.000000 G90",
      //     "G91 G0 X10.000000 F3000.000000",
      //     "G0 Y10.000000",
      //     "G0 X-10.000000",
      //     "G0 Y-10.000000 G90",
      //     "G91 G0 X10.000000 F3000.000000",
      //     "G0 Y10.000000",
      //     "G0 X-10.000000",
      //     "G0 Y-10.000000 G90",
      //     "G91 G0 X10.000000 F3000.000000",
      //     "G0 Y10.000000",
      //     "G0 X-10.000000",
      //     "G0 Y-10.000000 G90"
      //   ]
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
