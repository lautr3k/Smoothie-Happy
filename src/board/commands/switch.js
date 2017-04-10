import { normalizePath } from '../util'

/**
* Switch module.
*
* `switch fan on` or `switch fan 150`
*
* ### on success
* ```
* return {
*   "device": "fan",
*   "value" : "on"
* }
* ```
* ### on error
* ```
* throw '"xxx" is not a known switch device.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L916
*/
export function cmd_switch(raw, args) {
  // raw response
  raw = raw.trim()

  // device
  let device = args.shift() || ''

  // error
  if (raw.endsWith('is not a known switch device')) {
    throw new Error('"' + device + '" is not a known switch device.')
  }

  return { device, value: args.shift() || '' }
}
