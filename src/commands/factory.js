/**
 * Folder factory.
 *
 * @param  {Object} params
 * @param  {String} params.path
 * @param  {String} params.line
 * @return {boardFolder}
 * @private
 */
export function folderFactory ({ path, line }) {
  const name = line.slice(0, -1)
  const folderPath = `${path}/${name}`
  /**
   * @typedef  {Object} boardFolder - Board folder
   * @property {String} type        - Allaways === 'folder'
   * @property {String} name        - Folder name
   * @property {String} path        - Folder path
   * @property {String} parent      - Folder parent
   */
  return {
    type: 'folder',
    name,
    path: folderPath,
    parent: path
  }
}

/**
 * File factory.
 *
 * @param  {Object} params
 * @param  {String} params.path
 * @param  {String} params.line
 * @return {boardFile}
 * @private
 */
export function fileFactory ({ path, line }) {
  let name = line
  let parts = line.split(' ')
  let size = parseInt(parts.pop())
  name = parts.join(' ')
  /**
   * @typedef  {Object} boardFile - Board file
   * @property {String} type      - Allaways === 'file'
   * @property {String} name      - File name
   * @property {Number} size      - File size
   * @property {String} path      - File path
   * @property {String} parent    - File parent
   * @property {String} extension - File extension
   */
  return {
    name,
    size,
    type: 'file',
    parent: path,
    path: `${path}/${name}`,
    extension: name.split('.').pop()
  }
}
