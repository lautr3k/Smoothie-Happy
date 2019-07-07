import sh from '../src'

export default function ({ address, command }) {
  sh.command({
    address, // @esdoc address: '192.168.1.121',
    command, // @esdoc data: 'version',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
