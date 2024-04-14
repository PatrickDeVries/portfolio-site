import { persistence } from '@/common/store/persistence'
import proxyWithPersist from '@/common/store/valtio-persist'
import { INITIAL_SETTINGS } from './initial'

const particleSettings = proxyWithPersist({
  name: 'particleSettings',
  initialState: INITIAL_SETTINGS,
  version: 0,
  migrations: {},
  ...persistence,
})

export default particleSettings
