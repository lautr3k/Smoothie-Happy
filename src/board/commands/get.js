import { get_temp } from './get_temp'
import { get_pos } from './get_pos'
import { get_wcs } from './get_wcs'
import { get_state } from './get_state'
import { get_status } from './get_status'
import { get_ik } from './get_ik'
import { get_fk } from './get_fk'

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
* @return {Mixed}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#741
*/
export function cmd_get(raw, args) {
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
    case 'wcs':
      func = get_wcs
      break
    case 'state':
      func = get_state
      break
    case 'status':
      func = get_status
      break
    case 'ik':
      func = get_ik
      break
    case 'fk':
      func = get_fk
      break
    default:
     throw new Error('Sorry! The "get ' + option + '" command is not (yet) implemented.')
  }

  return func(raw, args)
}
