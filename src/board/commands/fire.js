/**
* Fire laser.
*
* ! fire return empty string if laser module not enabled, even if state is not in alarm mode... !
* This parser will never called in this case...
*
* ### on success
* ```
* return "..."
* ```
* ### on error
* ```
* return Error: 'Usage: Usage: fire power|off.'
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L269
* @see https://github.com/Smoothieware/Smoothieware/blob/dcf0252ef5d048f22949c07224e10cc8dde341cc/src/modules/tools/laser/Laser.cpp#L134
*/
export function cmd_fire(raw, args) {
  raw = raw.trim()

  if (raw.startsWith('Usage: fire power')) {
    return new Error('Usage: fire power|off.')
  }

  if (raw.startsWith('turning laser off')) {
    return { fire: false, power: 0 }
  }

  // WARNING: Firing laser at %1.2f%% power, entering manual mode use fire off to return to auto mode
  let matches = raw.match(/^WARNING: Firing laser at ([0-9\.]+)%/)

  if (! matches) {
    return new Error('Unknown response string.')
  }

  return { fire: true, power: parseInt(matches[1]) }
}
