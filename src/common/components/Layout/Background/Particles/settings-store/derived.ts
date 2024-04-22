import { derive } from 'valtio/utils'
import { scaleSetting } from '../../utils'
import { PARTICLE_VISIBLE_RADIUS } from '../constants'
import particleSettings from './store'

export const derivedParticleSettings = derive({
  scaledParticleVisibleRadius: get =>
    scaleSetting({
      base: PARTICLE_VISIBLE_RADIUS,
      scale: get(particleSettings).particleScale,
    }),
})
