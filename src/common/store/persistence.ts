import throttle from 'lodash/throttle'
import { PersistStrategy, ProxyPersistStorageEngine } from 'valtio-persist'

const storage: ProxyPersistStorageEngine = {
  getItem: name => window.localStorage.getItem(name),
  setItem: (name, value) => window.localStorage.setItem(name, value),
  removeItem: name => window.localStorage.removeItem(name),
  getAllKeys: () => Object.keys(window.localStorage),
}

export const persistence = {
  persistStrategies: PersistStrategy.SingleFile,
  getStorage: () => storage,
  onBeforeBulkWrite: throttle(bulkWrite => bulkWrite(), 1000),
}
