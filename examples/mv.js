import sh from '../src'

export default function ({ address, source, target }) {
  sh.commands.mv({
    address, // @esdoc address: '192.168.1.121',
    source, // @esdoc source: '/sd/test.txt',
    target, // @esdoc target: '/sd/test2.txt',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "source": "/sd/test.txt",
      //   "target": "/sd/test2.txt"
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
