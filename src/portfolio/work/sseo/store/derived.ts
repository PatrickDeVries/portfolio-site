import { derive } from 'valtio/utils'
import { getDecided } from '../utils'
import sseo from './store'

export const derived = derive({
  decided: get => getDecided(get(sseo).roles),
})
