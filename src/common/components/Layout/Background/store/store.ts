import { persistence } from '@/common/store/persistence'
import proxyWithPersist from '@/common/store/valtio-persist'
import { INITIAL } from './initial'

const backgroundStore = proxyWithPersist({
  name: 'background',
  initialState: INITIAL,
  version: 0,
  migrations: {},
  ...persistence,
})

export default backgroundStore
