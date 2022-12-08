import throttle from 'lodash/throttle'
import { PersistStrategy, ProxyPersistStorageEngine } from './valtio-persist'

const STORAGE: ProxyPersistStorageEngine = {
  getItem: name => window.localStorage.getItem(name),
  setItem: (name, value) => window.localStorage.setItem(name, value),
  removeItem: name => window.localStorage.removeItem(name),
  getAllKeys: () => Object.keys(window.localStorage),
}

export const persistence = {
  persistStrategies: PersistStrategy.SingleFile,
  getStorage: () => STORAGE,
  onBeforeBulkWrite: throttle(bulkWrite => bulkWrite(), 1000),
}
