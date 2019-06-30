import { requiredParam, requiredTypes } from './utils.js'
import axios from 'axios'

/**
* Sends an arbitrary command to the board over HTTP protocol.
*
* - This function is based on the [axios](https://github.com/axios/axios) library,
* please read the axios documentation if you wish to go further.
* - The [ method, url, data, timeout ] params can not be overwritten in axios config param.
*
* @param {Object} settings - command settings
* @param {string} settings.address - ip or hostname (without protocle http://)
* @param {string} settings.command - raw command (without trailing LF char)
* @param {number} [settings.timeout = 0] - connexion timeout
* @param {Object} [settings.axiosConfig = {}] - axios config ([documentation ](https://github.com/axios/axios#axiosconfig))
*
* @return {Promise} return a Promise with the axios response
*
* @see https://github.com/axios/axios#axiosconfig
*
* @example
* command({
*   address: '192.168.1.121',
*   command: 'version'
* })
*   .then(response => {
*     console.log(response)
*   })
*   .catch(error => {
*     console.log(error)
*   })
*
*/
export default function command ({
  address = requiredParam('address'),
  command = requiredParam('command'),
  timeout = 0,
  axiosConfig = {}
} = {}) {
  requiredTypes('address', address, ['string'])
  requiredTypes('command', command, ['string'])
  requiredTypes('axiosConfig', axiosConfig, ['object'])
  requiredTypes('timeout', timeout, ['number'])
  return axios({
    ...axiosConfig,
    timeout,
    method: 'POST',
    data: `${command}\n`,
    url: `http://${address}/command`
  })
}
