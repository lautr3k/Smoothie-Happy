import { normalizePath, filename } from './util'

/**
* Board file class.
*/
class BoardFile {
  constructor(file) {
    this.parent    = file.parent
    this.size      = file.size
    this.path      = file.path
    this.name      = file.name
    this.extension = file.extension
  }
}

/**
* Board folder class.
*/
class BoardFolder {
  constructor(folder) {
    this.parent = folder.parent
    this.size   = folder.size
    this.path   = folder.path
    this.name   = folder.name
  }
}

/**
* Board file tree class.
*/
class BoardFileTree {
  constructor() {
    this.tree = new Map()
    this.size = 0
  }

  makeChild(child) {
    return child.type === 'file' ? new BoardFile(child) : new BoardFolder(child)
  }

  updateSize(child, size) {
    this.size += size

    let parent = this.tree.get(child.parent)

    while (parent) {
      parent.size += size
      parent = this.tree.get(parent.parent)
    }
  }

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

  set(child) {
    let file = this.makeChild(child)

    this.remove(file.path)
    this.tree.set(file.path, file)
    this.updateSize(file, file.size)
  }

  has(path) {
    return this.tree.has(normalizePath(path))
  }

  get(path) {
    return this.tree.get(normalizePath(path))
  }

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
