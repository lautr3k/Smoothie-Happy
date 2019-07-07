import { VERSION } from '../src'
import * as examples from '../examples'

console.log(`smoothie-happy v${VERSION}`)

const address = '192.168.1.121'

// examples.request({ address, data: 'version\n' })
// examples.command({ address, command: 'version' })
// examples.version({ address })
examples.ls({ address, path: '/sd' })
