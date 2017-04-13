import { normalizePath } from '../util'

// -----------------------------------------------------------------------------
// List of commands (12/2016)
// http://smoothieware.org/console-commands
// https://github.com/Smoothieware/Smoothieware/blob/d79254323f4bb951426c6add29a4451130eaa018/src/modules/utils/simpleshell/SimpleShell.cpp
// -----------------------------------------------------------------------------
// # DONE
// - TODO
// -----------------------------------------------------------------------------
// # abort
// # break
// # calc_thermistor
// # cat
// # cd
// - config-load
// - config-get
// - config-set
// # dfu
// # fire
// # get
// # help
// # load
// # ls
// # md5sum
// # mem
// # mv
// # mkdir
// # net
// # ok
// # play
// # progress
// # pwd
// # remount
// # reset
// # resume
// # rm
// # save
// # set_temp
// # suspend
// # switch
// # test
// # thermistors
// - upload (<- not handled by BoardCommand)
// # version
//
// # M999
// -----------------------------------------------------------------------------

export { cmd_abort } from './abort'
export { cmd_break } from './break'
export { cmd_calc_thermistor } from './calc_thermistor'
export { cmd_cat } from './cat'
export { cmd_cd } from './cd'
export { cmd_dfu } from './dfu'
export { cmd_fire } from './fire'
export { cmd_get } from './get'
export { cmd_help } from './help'
export { cmd_load } from './load'
export { cmd_ls } from './ls'
export { cmd_md5sum } from './md5sum'
export { cmd_mem } from './mem'
export { cmd_mv } from './mv'
export { cmd_mkdir } from './mkdir'
export { cmd_net } from './net'
export { cmd_ok } from './ok'
export { cmd_play } from './play'
export { cmd_progress } from './progress'
export { cmd_pwd } from './pwd'
export { cmd_remount } from './remount'
export { cmd_reset } from './reset'
export { cmd_resume } from './resume'
export { cmd_rm } from './rm'
export { cmd_save } from './save'
export { cmd_set_temp } from './set_temp'
export { cmd_suspend } from './suspend'
export { cmd_switch } from './switch'
export { cmd_test } from './test'
export { cmd_thermistors } from './thermistors'
export { cmd_version } from './version'

export { cmd_M999 } from './M999'
