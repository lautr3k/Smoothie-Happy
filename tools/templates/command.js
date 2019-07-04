import { requiredParam, requiredTypes } from '../utils.js'
import command from '../command'

/**
* Send [ __dummyCommandName__ ] command.
*
* @param {Object} settings - command settings
* @param {string} settings.address - ip or hostname (without protocle http://)
* @param {string} settings.customParam - Custom param description...
* @param {number} [settings.timeout = 2000] - connexion timeout
* @param {Object} [settings.axiosConfig = {}] - axios config ([documentation ](https://github.com/axios/axios#axiosconfig))
*
* @return {Promise<CommandPayload|Error>}
*
* @example
* [EXAMPLE ../../examples/__dummyCommandName__.js]
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
  return command(settings).then(payload => {
    // do somthing with the response string
    if (payload.responseString.length) {
      // set some data
      payload.data = { hello: 'world' }
    } else {
      // set an Error if somthing gose wrong
      // and return the payload
      payload.error = new Error('Unknown response string')
    }
    // allaways return the payload
    return payload
  })
}
