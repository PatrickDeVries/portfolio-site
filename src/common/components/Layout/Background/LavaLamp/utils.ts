import { Point2d } from '../types'
import { GRAVITY } from './constants'
import store from './position-store'
import { derivedLavaLampSettings } from './settings-store'

export const getTemperatureAtCoordinate = ({ x, y }: Point2d): number => {
  const normalizedY = (y + store.viewport.height / 2) / store.viewport.height // y from 0 to 1
  const yStrength = 0.5 * 7.6 ** (-2.1 * normalizedY + 0.9)

  const normalizedX = Math.abs(x) / store.viewport.width / 2 // x from 0 to 1
  const xStrength = 4 * normalizedX ** 2 - 4 * normalizedX

  const totalStrength = yStrength * 0.8 + xStrength * 0.2

  return derivedLavaLampSettings.scaledLampTemperature * totalStrength
}

// Q = [K ∙ A ∙ (Thot – Tcold)] / d
export const getConductionHeatTransferPerFrame = ({
  tHot,
  tCold,
}: {
  tHot: number
  tCold: number
}): number => {
  const {
    scaledParticleCollisionRadius,
    scaledParticleCollisionArea,
    scaledCoefficientOfConduction,
  } = derivedLavaLampSettings

  const areaOfHeatTransfer = scaledParticleCollisionArea / 10
  const particleThickness = scaledParticleCollisionRadius * 2
  return (scaledCoefficientOfConduction * areaOfHeatTransfer * (tHot - tCold)) / particleThickness
}

// Q = hc ∙ A ∙ (Ts – Tf)
export const getConvectionHeatTransferPerFrame = (
  { x, y }: Point2d,
  temperature: number,
): number => {
  const fluidTemperature = getTemperatureAtCoordinate({ y, x })

  const { scaledParticleCollisionArea, scaledCoefficientOfConvection } = derivedLavaLampSettings

  return (
    scaledCoefficientOfConvection * scaledParticleCollisionArea * (temperature - fluidTemperature)
  )
}

export const getAccelerationFromTemperature = (temperature: number) => {
  const accelerationStrength = temperature / 500000 // 0.004 * temperature ** 2 - 0.016 * temperature - 1
  return GRAVITY + accelerationStrength
}
