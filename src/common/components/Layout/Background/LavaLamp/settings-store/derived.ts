import { derive } from 'valtio/utils'
import { scaleSetting } from '../../utils'
import {
  LAMP_TEMPERATURE,
  PARTICLE_COLLISION_RADIUS,
  PARTICLE_CONDUCTION_COEFFICIENT,
  PARTICLE_CONVECTION_COEFFICIENT,
  PARTICLE_VISIBLE_RADIUS,
} from '../constants'
import lavaLampSettings from './store'

export const derivedLavaLampSettings = derive({
  scaledParticleVisibleRadius: get =>
    scaleSetting({
      base: PARTICLE_VISIBLE_RADIUS,
      scale: get(lavaLampSettings).particleScale,
    }),
  scaledParticleCollisionRadius: get =>
    scaleSetting({
      base: PARTICLE_COLLISION_RADIUS,
      scale: get(lavaLampSettings).particleScale,
    }),
  scaledParticleCollisionArea: get =>
    Math.PI *
    scaleSetting({
      base: PARTICLE_COLLISION_RADIUS,
      scale: get(lavaLampSettings).particleScale,
    }) **
      2,
  scaledCoefficientOfConvection: get =>
    scaleSetting({
      base: PARTICLE_CONVECTION_COEFFICIENT,
      scale: get(lavaLampSettings).convectionCoefficientScale,
    }),
  scaledCoefficientOfConduction: get =>
    scaleSetting({
      base: PARTICLE_CONDUCTION_COEFFICIENT,
      scale: get(lavaLampSettings).conductionCoefficientScale,
    }),
  scaledLampTemperature: get =>
    scaleSetting({ base: LAMP_TEMPERATURE, scale: get(lavaLampSettings).lampTempScale }),
})
