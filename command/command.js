// import { UNSUPPORTED_COMMAND } from './error-types'
// import { errorFactory } from '../request/factory'
import post from '../request/post'

export default function command ({
  address,
  command,
  ...params
} = {}) {
  return new Promise(function (resolve, reject) {
    post({
      ...params,
      url: `http://${address}/command`,
      data: `${command}\n`
    })
      .then(response => {
        const responseText = response.text.trim()
        if (responseText.startsWith('error:Unsupported command')) {
          // throw errorFactory({
          //   ...response,
          //   type: UNSUPPORTED_COMMAND,
          //   message: `Unsupported command [ ${command} ]`
          // })
        }
        resolve(response)
      })
      .catch(reject)
  })
}
