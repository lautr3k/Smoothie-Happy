import { normalizePath } from '../util'

// -----------------------------------------------------------------------------
// List of commands (12/2016)
// http://smoothieware.org/console-commands
// https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp
// -----------------------------------------------------------------------------
// # DONE
// - TODO
// -----------------------------------------------------------------------------
// - abort
// - break
// - calc_thermistor
// # cat
// # cd
// - config-load
// - config-get
// - config-set
// - dfu
// - fire
// # get
// # help
// - load
// # ls
// - md5sum
// # mem
// # mv
// - mkdir
// - net
// # ok
// - play
// - progress
// # pwd
// - remount
// # reset
// - resume
// # rm
// - save
// # set_temp
// - suspend
// - switch
// - test
// - thermistors
// - upload
// # version
//
// # M999
// -----------------------------------------------------------------------------

export { cat } from './cat'
export { cd } from './cd'
export { get } from './get'
export { help } from './help'
export { ls } from './ls'
export { mem } from './mem'
export { mv } from './mv'
export { ok } from './ok'
export { pwd } from './pwd'
export { reset } from './reset'
export { rm } from './rm'
export { set_temp } from './set_temp'
export { version } from './version'

export { M999 } from './M999'
