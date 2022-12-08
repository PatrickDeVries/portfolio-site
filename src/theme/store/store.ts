import { persistence } from '../../common/store/persistence'
import proxyWithPersist from '../../common/store/valtio-persist'
import { INITIAL_THEME } from './initial'

const themeStore = proxyWithPersist({
  name: 'theme',
  initialState: INITIAL_THEME,
  version: 0,
  migrations: {},
  ...persistence,
})

export default themeStore
