/**
* Parse `config_get` command response.
*
* ### on success
* ```
* return {
*   "source" : "sd", // or cache
*   "setting": "default_feed_rate",
*   "value"  : "4000"
* }
* ```
* ### on error
* ```
* return Error: 'Undefined "xxx" setting in "yyy".'
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L257
* @see https://github.com/Smoothieware/Smoothieware/blob/08e30d628e00333e274757bb6feac8b5e5541125/src/modules/utils/configurator/Configurator.cpp#L30
* @see https://github.com/Smoothieware/Smoothieware/blob/08e30d628e00333e274757bb6feac8b5e5541125/src/libs/Config.cpp#L31
*/
export function cmd_config_get(raw, args) {
  raw = raw.trim()

  let matches = raw.match(/(.*): (.*) is not in config/)

  if (matches) {
    let source  = matches[1].trim()
    let setting = matches[2].trim()

    if (source === 'cached') {
      source = 'cache'
    }

    return new Error('Undefined "' + setting + '" setting in "' + source + '".')
  }

  matches = raw.match(/(.*): (.*) is set to (.*)/)

  if (! matches) {
    return new Error('Unknown response string.')
  }

  let source = matches[1].trim()

  if (source === 'cached') {
      source = 'cache'
    }

  return {
    source,
    setting: matches[2].trim(),
    value  : matches[3].trim()
  }
}
