import { Point2d } from '../types'
import {
  DRAG,
  GRAVITY,
  PARTICLE_MAX_HORIZONTAL_SPEED,
  PARTICLE_MAX_VERTICAL_SPEED,
} from './constants'
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
  const accelerationStrength = temperature / 500000
  return GRAVITY + accelerationStrength
}

export const getHorizontalAcceleration = (
  initialHorizontalVelocity: number,
  horizontalVelocity: number,
) => {
  const difference = initialHorizontalVelocity - horizontalVelocity
  if (Math.abs(difference) < DRAG) return 0
  if (difference < 0) {
    return -DRAG
  } else {
    return DRAG
  }
}

export const getBoundedHorizontalVelocity = (horizontalVelocity: number) =>
  horizontalVelocity > PARTICLE_MAX_HORIZONTAL_SPEED
    ? PARTICLE_MAX_HORIZONTAL_SPEED
    : horizontalVelocity < -PARTICLE_MAX_HORIZONTAL_SPEED
      ? -PARTICLE_MAX_HORIZONTAL_SPEED
      : horizontalVelocity

export const getBoundedVerticalVelocity = (verticalVelocity: number) => {
  if (verticalVelocity > PARTICLE_MAX_VERTICAL_SPEED) {
    return PARTICLE_MAX_VERTICAL_SPEED
  } else if (verticalVelocity < -PARTICLE_MAX_VERTICAL_SPEED) {
    return -PARTICLE_MAX_VERTICAL_SPEED
  } else {
    return verticalVelocity
  }
}
