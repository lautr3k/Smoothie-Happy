import { requiredParam, requiredTypes } from '../utils.js'
import command from '../command'

/**
* Send __dummyCommandName__ command.
*
* @param {Object} settings - command settings
* @param {string} settings.address - ip or hostname (without protocle http://)
* @param {string} settings.customParam - Custom param description...
* @param {number} [settings.timeout = 2000] - connexion timeout
* @param {Object} [settings.axiosConfig = {}] - axios config ([documentation ](https://github.com/axios/axios#axiosconfig))
*
* @return {Promise}
*
* @example
* __dummyCommandName__({
*   address: '192.168.1.121',
*   customParam: 'customValue'
* })
*   .then(response => {
*     console.log(response)
*   })
*   .catch(error => {
*     console.log(error)
*   })
*
*/
export default function __dummyCommandName__ ({
  customParam = requiredParam('customParam'),
  ...params
} = {}) {
  // type check
  requiredTypes('customParam', customParam, ['string'])
  // command settings
  const settings = {
    // overwritable settings
    timeout: 2000,
    // user settings
    ...params,
    // fixed settings
    command: '__dummyCommandName__'
  }
  // send command
  return command(settings)
    .then(response => {
      // trim response data
      const data = response.data.trim()
      // do somthing with data
      if (data.length) {
        // allaways return an object with settings and data properties
        return { settings, data }
      }
      // throw an Error if somthing gose wrong
      throw new Error('Unknown response string.')
    })
}
