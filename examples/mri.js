import sh from '../src'

export default function ({ address }) {
  sh.commands.mri({
    address, // @esdoc address: '192.168.1.121',
    timeout: 2000
  })
    .then(response => {
      // never reached
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
    })
    .catch(error => {
      // throw a RequestError REQUEST_TIMOUT
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
