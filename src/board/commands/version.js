/**
* Parse version command response.
*
* ### on success
* ```
* return {
*   branch: "edge",
*   hash  : "9ab4538",
*   date  : "Oct 10 2016 04:09:42",
*   mcu   : "LPC1769",
*   clock : "120MHz"
* }
* ```
* ### on error
* ```
* throw "Unknown version string"
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
*/
export function cmd_version(raw, args) {
  // version pattern
  let pattern = /Build version: (.*), Build date: (.*), MCU: (.*), System Clock: (.*)/

  // test the pattern
  let info = raw.trim().match(pattern)

  if (info) {
    // split branch-hash on dash
    let branch = info[1].split('-')

    // resolve
    return {
      branch: branch[0].trim(),
      hash  : branch[1].trim(),
      date  : info[2].trim(),
      mcu   : info[3].trim(),
      clock : info[4].trim()
    }
  }

  // reject
  throw new Error('Unknown version string')
}
