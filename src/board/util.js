/**
* Return normalized path `sd/My///File.ext/   ` => `/sd/my/file.ext`.
*
* @param  {String} path
* @return {String}
*/
export function normalizePath(path) {
  return '/' + path.trim()
  .replace(/\/+/, '/')
  .replace(/^\/|\/$/, '')
  .toLowerCase()
}

/**
* Return filename from path.
*
* @param  {String} path
* @return {String}
*/
export function filename(path) {
  return path.split('/').pop()
}
