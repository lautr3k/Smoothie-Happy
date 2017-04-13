/**
* Parse `config_set` command response.
*
* ### on success
* ```
* return return {
*   "source" : "sd",
*   "setting": "default_feed_rate",
*   "value"  : "4000"
* }
* ```
* ### on error
* ```
* return Error: 'Usage: config-set source setting value.'
* return Error: 'Undefined source "xxx".'
* return Error: 'Not enough space in "xxx" to overwrite "yyy" setting.'
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L260
* @see https://github.com/Smoothieware/Smoothieware/blob/08e30d628e00333e274757bb6feac8b5e5541125/src/modules/utils/configurator/Configurator.cpp#L68
*/
export function cmd_config_set(raw, args) {
  raw = raw.trim()

  if (raw.startsWith('Usage: config-set')) {
    return new Error('Usage: config-set source setting value')
  }

  let matches = raw.match(/(.*): (.*) has been set to (.*)/)

  if (matches) {
    return {
      source : matches[1].trim(),
      setting: matches[2].trim(),
      value  : matches[3].trim()
    }
  }

  matches = raw.match(/(.*) source does not exist/)

  if (matches) {
    return new Error('Undefined source "' + matches[1] + '".')
  }

  matches = raw.match(/(.*): (.*) not enough space/)

  if (matches) {
    return new Error('Not enough space in "' + matches[1].trim() + '" to overwrite "' + matches[2].trim() + '" setting.')
  }

  return new Error('Unknown response string.')
}
