import sh from '../src'

export default function ({ address, path }) {
  sh.commands.mkdir({
    address, // @esdoc address: '192.168.1.121',
    path, // @esdoc path: '/sd/gcodes',
    recursive: true
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "paths": [
      //     "/sd/gcodes"
      //   ]
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
