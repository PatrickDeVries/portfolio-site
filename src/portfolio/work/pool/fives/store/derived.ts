import { derive } from 'valtio/utils'

const derived = derive({
  // decided: get => getDecided(get(fives).roles),
  // quarters: get => getQuarters(get(fives).roles),
})

export default derived
