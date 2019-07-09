import sh from '../src'

export default function ({ address, axis, steps, speed }) {
  sh.commands.testRaw({
    address, // @esdoc address: '192.168.1.121',
    axis, // @esdoc axis: 'x',
    steps, // @esdoc steps: 100,
    speed, // @esdoc speed: 5000,
    timeout: 0
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
