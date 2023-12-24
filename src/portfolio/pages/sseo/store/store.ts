import { persistence } from '@/common/store/persistence'
import proxyWithPersist from '@/common/store/valtio-persist'
import { INITIAL_STATE } from './initial'

const sseo = proxyWithPersist({
  name: 'sseo',
  initialState: INITIAL_STATE,
  version: 0,
  migrations: {},
  ...persistence,
})

export default sseo
