/**
* Parse `config_load` command response.
*
* ### on success
* ```
* return '...'
* ```
* ### on error
* ```
* return Error: 'Usage: config-load load|unload|dump|checksum'
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L263
* @see https://github.com/Smoothieware/Smoothieware/blob/08e30d628e00333e274757bb6feac8b5e5541125/src/modules/utils/configurator/Configurator.cpp#L106
*/
export function cmd_config_load(raw, args) {
  raw = raw.trim()

  if (raw.startsWith('unsupported option:')) {
    return new Error('Usage: config-load load|unload|dump|checksum')
  }

  if (raw.startsWith('config cache loaded') || raw.startsWith('config cache unloaded')) {
    return true
  }

  let matches = raw.match(/^checksum of (.*) = (.*)/)

  if (matches) {
    return {
      setting : matches[1].trim(),
      checksum: matches[2].trim()
    }
  }

  let config = []
  let lines  = raw.split('\n')

  lines.forEach(line => {
    line    = line.trim()
    matches = line.match(/^([0-9]+) - (.*) : '(.*)' - found: (.*), default: (.*), default-double: (.*), default-int: (.*)/)

    if (! matches) {
      return new Error('Unknown response string.')
    }

    config.push({
      checksum     : matches[2],
      value        : matches[3],
      found        : matches[4],
      default      : matches[5],
      defaultDouble: matches[6],
      defaultInt   : matches[7]
    })
  })

  if (config.length) {
    return config
  }

  return new Error('Unknown response string.')
}
