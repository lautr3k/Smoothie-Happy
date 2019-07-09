import sh from '../src'

export default function ({ address, setting, source }) {
  sh.commands.getConfig({
    address, // @esdoc address: '192.168.1.121',
    setting, // @esdoc setting: 'extruder.hotend.steps_per_mm',
    source, // @esdoc source: 'sd',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "source": "sd",
      //   "setting": "extruder.hotend.steps_per_mm",
      //   "value": "140"
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}
