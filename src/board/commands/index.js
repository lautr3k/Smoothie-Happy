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
// - cat
// - cd
// - config-load
// - config-get
// - config-set
// - dfu
// - fire
// - get
// - help
// - load
// # ls
// - md5sum
// - mem
// # mv
// - mkdir
// - net
// # ok
// - play
// - progress
// - pwd
// - remount
// - reset
// - resume
// - rm
// - save
// - set_temp
// - suspend
// - switch
// - test
// - thermistors
// - upload
// # version
// -----------------------------------------------------------------------------

export { ls } from './ls'
export { mv } from './mv'
export { ok } from './ok'
export { version } from './version'
