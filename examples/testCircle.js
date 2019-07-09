import sh from '../src'

export default function ({ address, radius, iterations, feedrate }) {
  sh.commands.testCircle({
    address, // @esdoc address: '192.168.1.121',
    radius, // @esdoc radius: 15,
    iterations, // @esdoc iterations: 10,
    feedrate, // @esdoc feedrate: 3000,
    timeout: 0
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "millis": 12829,
      //   "gcode": [
      //     "G91 G0 X-10.000000 F3000.000000 G90",
      //     "G2 I10.000000 J0 F3000.000000",
      //     "G2 I10.000000 J0 F3000.000000",
      //     "G2 I10.000000 J0 F3000.000000",
      //     "G2 I10.000000 J0 F3000.000000",
      //     "G2 I10.000000 J0 F3000.000000",
      //     "G2 I10.000000 J0 F3000.000000",
      //     "G2 I10.000000 J0 F3000.000000",
      //     "G2 I10.000000 J0 F3000.000000",
      //     "G2 I10.000000 J0 F3000.000000",
      //     "G2 I10.000000 J0 F3000.000000",
      //     "G91 G0 X10.000000 F3000.000000 G90"
      //   ]
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
