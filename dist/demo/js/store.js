var store = JSON.parse(localStorage.getItem('smoothie-happy') || '{}');

function storeSet(key, value) {
  store[key] = value;
  localStorage.setItem('smoothie-happy', JSON.stringify(store));
}

function storeGet(key, defaultValue = undefined) {
  if (store[key] !== undefined) {
    return store[key]
  }

  if (defaultValue !== undefined) {
    storeSet(key, defaultValue)
  }

  return defaultValue
}
