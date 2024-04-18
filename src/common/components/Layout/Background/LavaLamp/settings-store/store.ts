import { persistence } from '@/common/store/persistence'
import proxyWithPersist from '@/common/store/valtio-persist'
import { INITIAL_SETTINGS } from './initial'

const lavaLampSettings = proxyWithPersist({
  name: 'lava-lamp-settings',
  initialState: INITIAL_SETTINGS,
  version: 0,
  migrations: {},
  ...persistence,
})

export default lavaLampSettings
