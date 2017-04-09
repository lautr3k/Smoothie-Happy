import { get_temp } from './get_temp'
import { get_pos } from './get_pos'

/**
* Get command `temp|pos|wcs|state|status|fk|ik`.
*
* - get temp [bed|hotend]
* - get fk|ik [-m] x[,y,z]
*
* ### on success
* ```
* return "..."
* ```
* ### on error
* ```
* throw 'Unknown option "xxx".'
* throw 'Sorry! The "get xxx" command is not (yet) implemented.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#741
*/
export function get(raw, args) {
  // raw response
  raw = raw.trim()

  // option
  let option = (args.shift() || '').toLowerCase()

  // file not found
  if (raw.startsWith('error:unknown option')) {
    throw new Error('Unknown option "' + option + '".')
  }

  let func

  switch (option) {
    case 'temp':
      func = get_temp
      break
    case 'pos':
      func = get_pos
      break
      default:
     throw new Error('Sorry! The "get ' + option + '" command is not (yet) implemented.')
  }

  return func(raw, args)
}
