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
// examples.cd({ address, path: '/' })
// examples.pwd({ address })
// examples.mkdir({ address, path: '/sd/gcodes/level-1/level-2/level-3' })
// examples.reset({ address })
// examples.dfu({ address })
// examples.mri({ address })
// examples.mem({ address })
// examples.getTemp({ address, device: 'all' })
// examples.kinematics({ address, x: 20, y: 50, z: 10, move: true })
// examples.getPosition({ address })
// examples.getWCS({ address })
// examples.getState({ address })
// examples.getStatus({ address })
// examples.setTemp({ address, device: 'hotend', value: 190 })
// examples.setSwitch({ address, name: 'fan', value: true })
// examples.getSwitch({ address, name: 'fan' })
// examples.network({ address })
// examples.loadConfig({ address })
// examples.loadConfig({ address, file: '/sd/custom-config.txt' })
// examples.saveConfig({ address })
// examples.saveConfig({ address, file: '/sd/custom-config.txt' })
// examples.remount({ address })
// examples.calculateThermistor({ address, save: 0, values: [25, 100000.0, 150, 1655.0, 240, 269.0] })
// examples.printThermistors({ address })
// examples.md5sum({ address, file: '/sd/config.txt' })
// examples.testJog({ address, axis: 'x', distance: 10, iterations: 10, feedrate: 3000 })
examples.testCircle({ address, radius: 10, iterations: 10, feedrate: 3000 })
