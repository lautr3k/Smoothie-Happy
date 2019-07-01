import command from '../command'

/**
* Send version command.
*
* @param {Object} settings - command settings
* @param {string} settings.address - ip or hostname (without protocle http://)
* @param {number} [settings.timeout = 2000] - connexion timeout
* @param {string} [settings.axiosConfig = {}] - axios config ([documentation ](https://github.com/axios/axios#axiosconfig))
*
* @return {Promise}
*
* @example
* version({
*   address: '192.168.1.121'
* })
*   .then(response => {
*     console.log(response)
*   })
*   .catch(error => {
*     console.log(error)
*   })
*
*/
export default function version ({ ...params }) {
  // command settings
  const settings = {
    timeout: 2000,
    ...params,
    command: 'version'
  }
  return command(settings)
    .then(response => {
      // trim response data
      let data = response.data.trim()
      // split on new lines
      const lines = data.split('\n')
      // version pattern
      const pattern = /^Build version: (.*), Build date: (.*), MCU: (.*), System Clock: (.*)$/
      // multiline response
      if (lines.length === 2) {
        data = lines[0].trim()
      }
      // test the pattern
      const matches = data.match(pattern)
      // positive match
      if (matches) {
        // split branch-hash on dash
        const branch = matches[1].split('-')
        // resolve
        data = {
          branch: branch[0].trim(),
          hash: branch[1].trim(),
          date: matches[2].trim(),
          mcu: matches[3].trim(),
          clock: matches[4].trim()
        }
        // multiline response
        if (lines.length === 2) {
          // axis pattern
          const axisPattern = /^([0-5]) axis$/
          // axis pattern
          const axisMatches = lines[1].match(axisPattern)
          if (axisMatches) {
            data.axis = parseInt(axisMatches[1].trim())
          }
        }
        // allaways return an object with settings and data properties
        return { settings, data }
      }
      // throw an Error if somthing gose wrong
      throw new Error('Unknown response string.')
    })
}
