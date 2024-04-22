import { proxy } from 'valtio'
import { INITIAL_POSITION_STORE } from './initial'

const lavaLampPositionStore = proxy(INITIAL_POSITION_STORE)

export default lavaLampPositionStore
