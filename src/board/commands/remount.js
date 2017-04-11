/**
* Remount SD card.
*
* ### on success
* ```
* return "remounted"
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {String}
* @throws {Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#324
*/
export function cmd_remount(raw, args) {
  return raw.trim()
}
