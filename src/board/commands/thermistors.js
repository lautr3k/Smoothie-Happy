/**
* Get the predefined thermistors.
*
* ### on success
* ```
* return {
*   "table": {
*     "EPCOS100K"    : 1,
*     "Vishay100K"   : 2,
*     "Honeywell100K": 3,
*     "Semitec"      : 4,
*     "Honeywell-QAD": 5
*   },
*   "beta": {
*     "EPCOS100K"    : 129,
*     "RRRF100K"     : 130,
*     "RRRF10K"      : 131,
*     "Honeywell100K": 132,
*     "Semitec"      : 133,
*     "HT100K"       : 134
*   }
* }
* ```
* ### on error
* ```
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L272
*/
export function cmd_thermistors(raw, args) {
  let lines   = raw.trim().split('\n')
  let result  = { table: {}, beta: {} }
  let pointer = result.table

  let matches, name, value

  lines.shift() // remove "S/H table"

  lines.forEach(line => {
    line = line.trim()

    if (line.startsWith('Beta table')) {
      pointer = result.beta
    }
    else {
      matches = line.match(/^([0-9]+) - (.*)/)

      if (! matches) {
        return new Error('Unknown response string.')
      }

      name  = matches[2].trim()
      value = parseFloat(matches[1].trim())

      pointer[name] = value
    }
  })

  return result
}
