import { derive } from 'valtio/utils'
import { getDecided } from '../utils'
import sseo from './store'

const derived = derive({
  decided: get => getDecided(get(sseo).roles),
})

export default derived
