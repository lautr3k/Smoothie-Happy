/**
 * Return a normalized path.
 *
 * @param  {String} path
 * @return {String}
 */
export function normalizePath (path) {
  return path.replace(/\/+/g, '/').replace(/^\/|\/$/g, '').toLowerCase()
}

/**
* Used in function declaration to validate required parameters.
*
* @param {string} name - param name
*
* @throws {ReferenceError} in any case
*/
export function requiredParam (name) {
  const error = new ReferenceError(`Required parameter [ ${name} ] is missing`)
  if (typeof Error.captureStackTrace === 'function') {
    // preserve original stack trace
    Error.captureStackTrace(error, requiredParam)
  }
  throw error
}

/**
* Used in function to validate parameters type.
*
* - Throw an error if no types match.
*
* @param {string}        name  - param name
* @param {mixed}         value - param value
* @param {Array<string>} types - types
*
* @throws {TypeError} if no types match
*/
export function requiredTypes (name, value, types) {
  const receivedType = typeof value
  const success = types.some(type => {
    if (type === 'null' && value === null) {
      return true
    }
    if (type === 'array' && Array.isArray(value)) {
      return true
    }
    if (receivedType === type) {
      return true
    }
    if (typeof type === 'function' && (value instanceof type)) {
      return true
    }
    return false
  })
  if (success) return
  const error = new TypeError(`The [ ${name} ] parameter must be of type [ ${types.join(', ')} ], received type [ ${receivedType} ]`)
  if (typeof Error.captureStackTrace === 'function') {
    // preserve original stack trace
    Error.captureStackTrace(error, requiredTypes)
  }
  throw error
}
