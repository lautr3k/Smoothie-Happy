/**
* Parse "test square" response.
*
* ### on success
* ```
* return [gcode, gcode, ..., 'done']
* ```
* ### on error
* ```
* return Error: 'Usage: test square size iterations [feedrate]'
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#1030
*/
export function test_square(raw, args) {
  if (raw.startsWith('error:')) {
    return new Error('Usage: test square size iterations [feedrate]')
  }

  return raw.split('\n')
}
