import sh from '../src'

export default function ({ address, file }) {
  sh.commands.md5sum({
    address, // @esdoc address: '192.168.1.121',
    file, // @esdoc file: '/sd/config.txt',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "file": "/sd/config.txt",
      //   "hash": "08792b396dbe28b076961ff4e2f45088"
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
