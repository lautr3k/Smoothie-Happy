import { normalizePath } from '../util'

/**
* Reset the board.
*
* ### on success
* ```
* return "Smoothie out. Peace. Rebooting in 5 seconds...\r\n"
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#L647
*/
export function cmd_reset(raw, args) {
  return raw.trim()
}
