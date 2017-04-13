/**
* Parse "test circle" response.
*
* ### on success
* ```
* return [gcode, gcode, ..., 'done']
* ```
* ### on error
* ```
* return Error: 'Usage: test circle radius iterations [feedrate]'
* return Error: 'Unknown response string.'
* ```
* @param  {String}   raw  Raw command response string.
* @param  {String[]} args Command arguments.
* @return {Object|Error}
* @see https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp#989
*/
export function test_circle(raw, args) {
  if (raw.startsWith('error:')) {
    return new Error('Usage: test circle radius iterations [feedrate]')
  }

  return raw.split('\n')
}
