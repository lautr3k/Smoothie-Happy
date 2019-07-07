import sh from '../src'

export default function ({ address, path }) {
  sh.commands.ls({
    address, // @esdoc address: '192.168.1.121',
    path, // @esdoc path: '/sd',
    timeout: 5000,
    recursive: true,
    onFile (file) {
      console.log('onFile:', JSON.stringify(file, null, 2))
      // onFile: {
      //   "name": "config.txt",
      //   "size": 28934,
      //   "type": "file",
      //   "parent": "/sd",
      //   "path": "/sd/config.txt",
      //   "extension": "txt"
      // }
    }
  })
    .then(response => {
      console.log('command:', response.params.command)
      console.log('response:', response)
      console.log('data:', JSON.stringify(response.data, null, 2))
      // data: {
      //   "files": [
      //     {
      //       "name": "config.txt",
      //       "size": 28934,
      //       "type": "file",
      //       "parent": "/sd",
      //       "path": "/sd/config.txt",
      //       "extension": "txt"
      //     },
      //     {
      //       "name": "firmware.cur",
      //       "size": 382752,
      //       "type": "file",
      //       "parent": "/sd",
      //       "path": "/sd/firmware.cur",
      //       "extension": "cur"
      //     },
      //     {
      //       "type": "folder",
      //       "name": "gcodes",
      //       "path": "/sd/gcodes",
      //       "parent": "/sd"
      //     }
      //   ]
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
