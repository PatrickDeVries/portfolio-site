import { proxy } from 'valtio'
import { INITIAL_LAYOUT_STORE } from './initial'

const layoutStore = proxy(INITIAL_LAYOUT_STORE)

export default layoutStore
