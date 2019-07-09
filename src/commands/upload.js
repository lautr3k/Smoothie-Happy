import { normalizePath, requiredParam, requiredTypes } from '../utils'
import { COULD_NOT_UPLOAD } from './error-types'
import { errorFactory } from '../request/factory'
import { fileFactory } from './factory'
import post from '../request/post'

/**
 * Upload a file to the SD card.
 *
 * - See {@link post} and {@link request}  for more details.
 *
 * @param  {Object}      params                - Params...
 * @param  {String}      params.address        - Board address without protocol
 * @param  {String|Blob} params.file           - File contents as String or Blob
 * @param  {String}      params.name           - File name, optional if the file param contains the file name
 * @param  {String}      [params.path = '/sd'] - File path
 * @param  {...any}      ...rest               - Optional params passed to {@link command} request
 *
 * @return {Promise<responsePayload|RequestError>}
 *
 * @throws {RequestError} {@link COULD_NOT_UPLOAD}
 *
 * @see https://github.com/Smoothieware/Smoothieware/blob/d82d66f550ce6bdd7f33e8f4998ac6d963fd7376/src/libs/Network/uip/webserver/httpd.c#L340
 * @see https://github.com/Smoothieware/Smoothieware/blob/d82d66f550ce6bdd7f33e8f4998ac6d963fd7376/src/libs/Network/uip/webserver/httpd.c#L543
 *
 * @example
 * [EXAMPLE ../../examples/upload.js]
 */
export default function upload ({
  address = requiredParam('address'),
  file = requiredParam('file'),
  name = requiredParam('name'),
  path = '/sd',
  ...rest
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('file', file, ['string', Blob])
  requiredTypes('name', name, ['string'])
  requiredTypes('path', path, ['string'])
  // file is a string, make a Blob
  if (typeof file === 'string') {
    // normalize line endding
    file = file.replace(/\r\n/g, '\n')
    // force EOF
    if (file[file.length - 1] !== '\n') {
      file += '\n'
    }
    // convert to Blob object
    file = new Blob([file], { 'type': 'text/plain' })
  }
  // normalize path
  path = normalizePath(path).replace(/^sd\/?/, '')
  name = normalizePath(name)
  // extract path from name
  if (name.includes('/')) {
    let parts = name.split('/')
    name = parts.pop()
    path += `/${parts.join('/')}`
  }
  let fileName = normalizePath(`${path}/${name}`)
  path = '/' + normalizePath(`sd/${path}`)
  // set params
  const params = {
    ...rest,
    address,
    file,
    name,
    path,
    headers: [[ 'X-Filename', fileName ]],
    url: `http://${address}/upload`,
    data: file
  }
  // post upload
  return post(params).then(response => {
    if (!response.text.startsWith('OK')) {
      throw errorFactory({
        ...response,
        type: COULD_NOT_UPLOAD,
        message: `Could not upload file [ ${fileName} ]`
      })
    }
    response.data.file = fileFactory({ path, line: `${name} ${file.size}` })
    return response
  })
}
