import { UNKNOWN_RESPONSE, FILE_NOT_FOUND } from './error-types'
import { errorFactory } from '../request/factory'
import { requiredParam, requiredTypes } from '../utils'
import command from '../command'

/** @ignore */
function parse (response) {
  let text = response.text.trim()
  let lines = text.split('\n')
  let header = lines.shift()
  let footer = lines.pop()
  let configText = lines.join('\n').trim()
  if (!header.startsWith('Loading config override file: ')) {
    throw new Error(`Undefined response header`)
  }
  if (!footer.startsWith('config override file executed')) {
    throw new Error(`Undefined response footer`)
  }
  let config = []
  let description = []
  lines.forEach(line => {
    line = line.trim()
    if (line.startsWith(';')) {
      description.push(line.slice(1).trim().replace(/:$/, ''))
    } else {
      config.push({
        gcode: line,
        description: description.join('\n')
      })
      description = []
    }
    console.log(line)
  })
  return { file: header.slice(30, -3), configText, config }
}

/**
 * Send [ load <file> ] command.
 *
 * - See {@link post}, {@link request} and {@link command} for more details.
 *
 * @param {Object} params               - Params...
 * @param {String} params.address       - Board address without protocol
 * @param {String} [params.file = null] - File path (default '/sd/config-override')
 * @param {...any} ...rest              - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link FILE_NOT_FOUND}
 * @throws {RequestError} {@link UNKNOWN_RESPONSE}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/9e5477518b1c85498a68e81be894faea45d6edca/src/modules/utils/simpleshell/SimpleShell.cpp#L533
 *
 * @example
 * [EXAMPLE ../../examples/loadConfig.js]
 */
export default function loadConfig ({
  address = requiredParam('address'),
  file = null,
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('file', file, ['null', 'string'])
  const params = {
    ...rest,
    address,
    file,
    command: `load ${file || ''}`
  }
  return command(params).then(response => {
    let text = response.text.trim()
    if (text.startsWith('File not found: ')) {
      throw errorFactory({
        ...response,
        type: FILE_NOT_FOUND,
        message: `File not found [ ${file} ]`
      })
    }
    try {
      response.data = parse(response)
    } catch (error) {
      throw errorFactory({
        ...response,
        type: UNKNOWN_RESPONSE,
        message: error.message
      })
    }
    // allaways return the response
    return response
  })
}
