import { proxy } from 'valtio'
import { INITIAL_POSITION_STORE } from './initial'

const positionStore = proxy(INITIAL_POSITION_STORE)

export default positionStore
