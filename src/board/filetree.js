import { normalizePath, filename } from './util'

/**
* Board file class.
*/
class BoardFile {
  constructor(file) {
    /**
    * Parent folder path `/sd/my_folder`.
    * @type {String}
    */
    this.parent = file.parent

    /**
    * File size (bytes).
    * @type {Integer}
    */
    this.size = file.size

    /**
    * File path `/sd/my_folder/my_file.ext`.
    * @type {String}
    */
    this.path = file.path

    /**
    * File name with extension `my_file.ext`.
    * @type {String}
    */
    this.name = file.name

    /**
    * File extension with starting dot `.gcode`.
    * @type {String}
    */
    this.extension = file.extension
  }
}

/**
* Board folder class.
*/
class BoardFolder {
  constructor(folder) {
    /**
    * Parent folder path `/sd`.
    * @type {String}
    */
    this.parent = file.parent

    /**
    * Folder size (bytes).
    * @type {Integer}
    */
    this.size = file.size

    /**
    * Folder path `/sd/my_folder`.
    * @type {String}
    */
    this.path = file.path

    /**
    * Folder name `my_folder`.
    * @type {String}
    */
    this.name = file.name
  }
}

/**
* Board file tree class.
*/
class BoardFileTree {
  /**
  * Constructor...
  */
  constructor() {
    /**
    * Flat file tree.
    * @type {Map}
    */
    this.tree = new Map()

    /**
    * File tree size (bytes).
    * @type {Integer}
    */
    this.size = 0
  }

  /**
  * Make and return a child object.
  *
  * @param  {Object} child Child object from `ls -s` command.
  * @return {BoardFile|BoardFolder}
  * @protected
  */
  makeChild(child) {
    return child.type === 'file' ? new BoardFile(child) : new BoardFolder(child)
  }

  /**
  * Update tree size.
  *
  * @param  {BoardFile|BoardFolder} child
  * @param  {Integer} size
  * @protected
  */
  updateSize(child, size) {
    this.size += size

    let parent = this.tree.get(child.parent)

    while (parent) {
      parent.size += size
      parent = this.tree.get(parent.parent)
    }
  }

  /**
  * Remove a child and all of his children.
  *
  * @param  {BoardFile|BoardFolder} child Child name or object to remove.
  * @return {Integer|null} Number of child removed.
  */
  remove(child) {
    let path = child.path || normalizePath(child)
    let file = this.tree.get(path)

    if (! file) {
      return null
    }

    let removed = 1

    this.tree.delete(file.path)
    this.updateSize(file, -file.size)

    if (file instanceof BoardFolder) {
      for (let childPath of this.tree.keys()) {
        if (childPath.startsWith(file.path + '/')) {
          this.tree.delete(childPath)
          removed++
        }
      }
    }

    return removed
  }

  /**
  * Set a new child.
  *
  * @param {Object} child Child object from `ls -s` command.
  */
  set(child) {
    let file = this.makeChild(child)

    this.remove(file.path)
    this.tree.set(file.path, file)
    this.updateSize(file, file.size)
  }

  /**
  * Return if child path exists.
  *
  * @param  {String} path
  * @return {Boolean}
  */
  has(path) {
    return this.tree.has(normalizePath(path))
  }

  /**
  * Return a child from path if exists.
  *
  * @param  {String} path
  * @return {BoardFile|BoardFolder|null}
  */
  get(path) {
    return this.tree.get(normalizePath(path))
  }

  /**
  * Return all children from path.
  *
  * @param  {String} path
  * @return {Map}
  */
  list(path) {
    let tree = new Map()

    path = normalizePath(path)

    if (path !== '/') {
      path += '/'
    }

    for (let childPath of this.tree.keys()) {
      if (childPath.startsWith(path)) {
        tree.set(childPath, this.tree.get(childPath))
      }
    }

    return tree
  }
}

// Exports
export default BoardFileTree
export { BoardFileTree }
