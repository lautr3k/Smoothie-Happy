import sh from '../src'

export default function ({ address, data }) {
  sh.request({
    method: 'POST',
    url: `http://${address}/command`, // @esdoc url: 'http://192.168.1.121/command',
    data, // @esdoc data: 'version\n',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
