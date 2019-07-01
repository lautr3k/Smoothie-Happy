import sh from '../src'

export default function (address) {
  sh.commands.__dummyExampleName__({
    address,
    command: '__dummyExampleName__'
  })
    .then(response => {
      console.log('response:', response)
    })
    .catch(error => {
      console.error('error:', error)
    })
}
