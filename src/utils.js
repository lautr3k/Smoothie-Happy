/**
* Used in function declaration to validate required parameters.
*
* @param {string} name - param name
*
* @throws {Error} in any case
*/
export function requiredParam (name) {
  const error = new Error(`Required parameter, "${name}" is missing.`)
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
* @param {string} name - param name
* @param {mixed} value - param value
* @param {Array<string>} types - types
*
* @throws {Error} if no types match
*/
export function requiredTypes (name, value, types) {
  const receivedType = typeof value
  const success = types.some(type => {
    return receivedType === type
  })
  if (success) {
    return
  }
  const error = new Error(`The "${name}" parameter must be of type "${types.join(', ')}", received type "${receivedType}".`)
  if (typeof Error.captureStackTrace === 'function') {
    // preserve original stack trace
    Error.captureStackTrace(error, requiredTypes)
  }
  throw error
}
