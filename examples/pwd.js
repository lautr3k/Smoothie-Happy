import sh from '../src'

export default function ({ address }) {
  sh.commands.pwd({
    address, // @esdoc address: '192.168.1.121',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   path: '/'
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
