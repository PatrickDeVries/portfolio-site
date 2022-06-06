import { derive } from 'valtio/utils'
import { getDecided, getQuarters } from '../utils'
import sseo from './store'

const derived = derive({
  decided: get => getDecided(get(sseo).roles),
  quarters: get => getQuarters(get(sseo).roles),
})

export default derived
