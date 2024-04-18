import { Point2d } from '../types'
import {
  GRAVITY,
  LAMP_TEMPERATURE,
  PARTICLE_COLLISION_RADIUS,
  PARTICLE_CONVECTION_COEFFICIENT,
} from './constants'
import store from './position-store'
import lavaLampSettings from './settings-store'

export const scaleSetting = ({ base, scale }: { base: number; scale: number }): number =>
  base * (scale > 0 ? scale : 1 / -scale)

export const getTemperatureAtCoordinate = ({ x, y }: Point2d): number => {
  const normalizedY = (y + store.viewport.height / 2) / store.viewport.height // y from 0 to 1
  const yStrength = 0.5 * 7.6 ** (-2.1 * normalizedY + 0.9)

  const normalizedX = Math.abs(x) / store.viewport.width / 2 // x from 0 to 1
  const xStrength = 4 * normalizedX ** 2 - 4 * normalizedX

  const totalStrength = yStrength * 0.8 + xStrength * 0.2

  return (
    scaleSetting({ base: LAMP_TEMPERATURE, scale: lavaLampSettings.lampTempScale }) * totalStrength
  )
}

// Q = hc ∙ A ∙ (Ts – Tf)
export const getConvectionHeatTransferPerFrame = (
  { x, y }: Point2d,
  temperature: number,
): number => {
  const fluidTemperature = getTemperatureAtCoordinate({ y, x })
  const particleArea =
    Math.PI *
    scaleSetting({ base: PARTICLE_COLLISION_RADIUS, scale: lavaLampSettings.particleScale }) ** 2
  return (
    scaleSetting({
      base: PARTICLE_CONVECTION_COEFFICIENT,
      scale: lavaLampSettings.convectionCoefficientScale,
    }) *
    particleArea *
    (temperature - fluidTemperature)
  )
}

export const getAccelerationFromTemperature = (temperature: number) => {
  const accelerationStrength = temperature / 500000 // 0.004 * temperature ** 2 - 0.016 * temperature - 1
  return GRAVITY + accelerationStrength
}
