import { persistence } from '../../common/store/persistence'
import proxyWithPersist from '../../common/store/valtio-persist'
import { INITIAL } from './initial'

const store = proxyWithPersist({
  name: 'theme',
  initialState: INITIAL,
  version: 0,
  migrations: {},
  ...persistence,
})

export default store
