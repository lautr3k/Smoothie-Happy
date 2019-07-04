import sh from '../src'

export default function (address) {
  sh.commands.__dummyCommandName__({
    address // @esdoc address: '192.168.1.121'
  })
    .then(payload => {
      if (payload.error) {
        console.error('Command error:', payload.error)
        return
      }
      console.log('Command:', payload.settings.command)
      console.log('Raw data:', payload.responseString)
      console.log('Data:', payload.data)
    })
    .catch(error => {
      console.error('Network error:', error)
    })
}
