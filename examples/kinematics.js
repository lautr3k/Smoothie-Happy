import sh from '../src'

export default function ({ address, ...rest }) {
  sh.commands.kinematics({
    address, // @esdoc address: '192.168.1.121',
    // @esdoc type: 'forward',
    // @esdoc move: false,
    ...rest // @esdoc x: 20
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "type": "forward",
      //   "move": false,
      //   "x": 20,
      //   "y": 20,
      //   "z": 20
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
