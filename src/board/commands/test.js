import { test_jog } from './test_jog'
import { test_circle } from './test_circle'
import { test_square } from './test_square'
import { test_raw } from './test_raw'

/**
* Parse `break` command response.
*
* !!! Smoothie never respond when calling this command.
*
* ### on success
* ```
* return 'Entering MRI debug mode...'
* ```
* ### on error
* ```
* return Error: 'Usage: test <jog|circle|square|raw> <options>'
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L958
*/
export function cmd_test(raw, args) {
  raw = raw.trim()

  if (raw.startsWith('usage:')) {
    return new Error('Usage: test jog|circle|square|raw options')
  }

  // option
  let option = (args.shift() || '').toLowerCase()

  let func

  switch (option) {
    case 'jog':
    func = test_jog
    break
    case 'circle':
    func = test_circle
    break
    case 'square':
    func = test_square
    break
    case 'raw':
    func = test_raw
    break
    default:
    return new Error('Sorry! The "test ' + option + '" command is not (yet) implemented.')
  }

  return func(raw, args)
}
