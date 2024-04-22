import { proxy } from 'valtio'
import { INITIAL_POSITION_STORE } from './initial'

const particlesPositionStore = proxy(INITIAL_POSITION_STORE)

export default particlesPositionStore
