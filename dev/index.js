import { VERSION } from '../src'
import * as examples from '../examples'

console.log(`smoothie-happy v${VERSION}`)

const address = '192.168.1.121'

// examples.request({ address, data: 'version\n' })
// examples.command({ address, command: 'version' })
// examples.version({ address })
// examples.ls({ address, path: '/sd' })
// examples.upload({ address, path: '/sd', name: 'upload.txt', file: 'UPLOAD...\n' })
// const file = new Blob(['hahahaha...\n'], { 'type': 'text/plain' })
// examples.upload({ address, path: '/sd/front', name: 'upload2.txt', file })
// examples.rm({ address, path: '/sd/upload2.txt' })
examples.cd({ address, path: '/' })
