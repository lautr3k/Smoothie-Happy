import sh from '../src'

export default function ({ address, path }) {
  sh.commands.rm({
    address, // @esdoc address: '192.168.1.121',
    path, // @esdoc path: '/sd/file.ext',
    recursive: false
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "files": [
      //     "/sd/file.ext"
      //   ]
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
