import sh from '../src'

export default function ({ address, path }) {
  sh.commands.cd({
    address, // @esdoc address: '192.168.1.121',
    path, // @esdoc path: '/sd',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   path: '/sd'
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
