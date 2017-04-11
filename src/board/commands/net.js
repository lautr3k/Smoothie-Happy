/**
* Get network config.
*
* ### on success
* ```
* return {
*   "ip"     : "192.168.1.102",
*   "gateway": "192.168.1.1",
*   "mask"   : "255.255.255.0",
*   "mac"    : "00:00:00:00:00:00"
* }
* ```
* ### on error
* ```
* throw 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#616
*/
export function cmd_net(raw, args) {
  let matches = raw.trim().match(/IP Addr:([^\n]+)\nIP GW:([^\n]+)\nIP mask:([^\n]+)\nMAC Address:([^\n]+)/)

  if (! matches) {
    throw new Error('Unknown response string.')
  }

  return {
    ip     : matches[1].trim(),
    gateway: matches[2].trim(),
    mask   : matches[3].trim(),
    mac    : matches[4].trim()
  }
}
