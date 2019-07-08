import sh from '../src'

export default function ({ address, path, name, file }) {
  sh.commands.upload({
    address, // @esdoc address: '192.168.1.121',
    path, // @esdoc path: '/sd',
    name, // @esdoc name: 'upload.txt',
    file, // @esdoc file: 'File contents...',
    onUploadProgress (progress) {
      console.log('progress:', progress)
    },
    timeout: 0
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
