/**
* Calculate the Steinhart Hart coefficients for a thermistor.
*
* ### on success
* ```
* return {
*   "saved": false, // true if -s param provided, else false
*   "target": null, // termistor num if -s param provided, else null
*   "I"     : 0.000722376862540841,
*   "J"     : 0.000722376862540841,
*   "K"     : 0.000722376862540841
* }
* ```
* ### on error
* ```
* throw 'Usage: calc_thermistor [-s0] T1,R1,T2,R2,T3,R3.'
* throw 'Unknown response string.'
* throw 'Invalid input values.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
* @see http://smoothieware.org/steinharthart
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#878
*/
export function cmd_calc_thermistor(raw, args) {
  raw = raw.trim()

  if (raw.startsWith('Usage: calc_thermistor')) {
    throw new Error('Usage: calc_thermistor [-s0] T1,R1,T2,R2,T3,R3.')
  }

  let matches = raw.match(/Steinhart Hart coefficients: *I(.*)J(.*)K(.*)/);

  if (! matches) {
    throw new Error('Unknown response string.');
  }

  matches.shift()

  matches = matches.map(match => parseFloat(match.trim()))

  if (matches.includes(NaN)) {
    throw new Error('Invalid input values.');
  }

  let saved  = args[0].startsWith('-s')
  let target = (saved && args[0][2]) || null

  return { saved, target, I: matches[0], J: matches[0], K: matches[0] }
}
