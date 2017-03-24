import uuid from 'uuid/v4'

// Cross-tab communication
let CROSS_TAB_COMMUNICATION_ENABLED   = false
let CROSS_TAB_COMMUNICATION_STORE_KEY = '__PubSubCrossTabCommunication__'

// On message received from tab
function onCrossTabMessage(event) {
  if (event.newValue && event.key === CROSS_TAB_COMMUNICATION_STORE_KEY) {
    let { topic, data, async, crossTab } = JSON.parse(event.newValue)
    publish(topic, data, async, true)
  }
}

// Topics subscriptions
const SUBSCRIPTIONS = new Map()

// Sync. call
function syncCall(payload) {
  payload.subscription.callback.call(payload.subscription.context, payload)
}

// Async. call
function asyncCall(payload) {
  setTimeout(() => syncCall(payload), 0)
}

// Call ...
function call(subscription, event) {
  return new Promise(resolve => {
    let payload = { subscription, event }
    event.async ? asyncCall(payload) : syncCall(payload)
    resolve(payload)
  })
}

// Return all sub path for a topic
function subpath(topic) {
  let topics   = []
  let paths    = topic.split('/')

  while (paths.length > 1) {
    paths.pop()
    topics.push(paths.join('/') + '/')
  }

  return topics
}

// Publish to topic
function publish(topic, data, async = true, crossTab = false) {
  return new Promise((resolve, reject) => {
    let event = { topic, data, async, crossTab, uuid: uuid() }

    // relay topic to other tabs
    if (CROSS_TAB_COMMUNICATION_ENABLED && ! event.crossTab) {
      localStorage.setItem(CROSS_TAB_COMMUNICATION_STORE_KEY, JSON.stringify(event))
      localStorage.removeItem(CROSS_TAB_COMMUNICATION_STORE_KEY)
    }

    let promises = []

    if (SUBSCRIPTIONS.has(topic)) {
      SUBSCRIPTIONS.get(topic).forEach(subscription => {
        promises.push(call(subscription, event))
      })
    }

    return Promise.all(promises).then(results => {
      return resolve(results)
    })
  })
}

function publishAll(topic, data, async) {
  return new Promise((resolve, reject) => {
    let promises = []

    SUBSCRIPTIONS.forEach((value, key) => {
      if (topic !== key && key.startsWith(topic)) {
        promises.push(PubSub.publish(key, data, async))
      }
    })

    return Promise.all(promises).then(subscriptions => {
      return resolve([].concat.apply([], subscriptions))
    })
  })
}

/**
* PubSub class.
*/
class PubSub {
  /**
  * Enable/Disable cross-tab communication.
  *
  * @param {Boolean} enable True for enable, False for disable, Null to get the current value.
  * @return {Boolean} Return True if enabled.
  */
  static crossTabCommunication(enable = null) {
    if (enable !== null) {
      if (! CROSS_TAB_COMMUNICATION_ENABLED && enable) {
        window.addEventListener('storage', onCrossTabMessage, false)
        CROSS_TAB_COMMUNICATION_ENABLED = true
      }
      else if (CROSS_TAB_COMMUNICATION_ENABLED && ! enable) {
        window.removeEventListener('storage', onCrossTabMessage, false)
        CROSS_TAB_COMMUNICATION_ENABLED = false
      }
    }

    return CROSS_TAB_COMMUNICATION_ENABLED
  }

  /**
  * Subscribe to topic.
  *
  * @param  {String}      topic          Topic name.
  * @param  {Function}    callback       Function to call on topic message.
  * @param  {Object|null} [context=null] Callback context to apply on call.
  * @return {String} Unique identifier (uuid/v4).
  */
  static subscribe(topic, callback, context = null) {
    // first subscription
    if (! SUBSCRIPTIONS.has(topic)) {
      // create new topic
      SUBSCRIPTIONS.set(topic, new Map())
    }

    // create new subscription
    let subscription = { uuid: uuid(), callback, context: context || callback }

    // register new subscription
    SUBSCRIPTIONS.get(topic).set(subscription.uuid, subscription)

    // return the subscription uuid
    return subscription.uuid
  }

  /**
  * Publish on topic.
  *
  * @param {String} topic        Topic name.
  * @param {Mixed}  [data=null]  Topic data.
  * @param {Mixed}  [async=true] Async publication.
  * @return {Promise}
  */
  static publish(topic, data = null, async = true) {
    if (topic[topic.length - 1] === '/') {
      return publishAll(topic, data, async)
    }

    let topics   = subpath(topic)
    let promises = [publish(topic, data, async)]

    topics.forEach(topic => {
      promises.push(publish(topic, data, async))
    })

    return Promise.all(promises).then(s => {
      return Promise.resolve([].concat.apply([], s))
    })
  }

  /**
  * Unsubscribe from topic.
  *
  * @param  {String|Array} uuid Subscription uuid or function.
  * @return {Integer} Number of callback removed.
  */
  static unsubscribe(uuid) {
    let removed = 0

    // unsubscribe an array of uuid or function
    if (Array.isArray(uuid)) {
      uuid.forEach(id => {
        removed += this.unsubscribe(id)
      })

      return removed
    }

    // unsubscribe from function
    if (typeof uuid === 'function') {
      for (let subscriptions of SUBSCRIPTIONS.values()) {
        subscriptions.forEach(subscription => {
          if (subscription.callback === uuid) {
            removed += this.unsubscribe(subscription.uuid)
          }
        })
      }

      return removed
    }

    // unsubscribe from uuid string
    for (let topic of SUBSCRIPTIONS.keys()) {
      if (SUBSCRIPTIONS.get(topic).has(uuid)) {
        removed += SUBSCRIPTIONS.get(topic).delete(uuid)

        if (SUBSCRIPTIONS.get(topic).size === 0) {
          this.deleteTopic(topic)
        }

        return removed
      }
    }

    return removed
  }

  /**
  * Delete entire topic.
  *
  * @param  {String} topic Topic name.
  * @return {Boolean} False if not found.
  */
  static deleteTopic(topic) {
    if (SUBSCRIPTIONS.get(topic)) {
      return SUBSCRIPTIONS.delete(topic)
    }

    return false
  }
}

// Exports
export default PubSub
export { PubSub }
