import { MAX_PARTICLES, PARTICLE_MAX_HORIZONTAL_SPEED } from '../constants'
import { getAccelerationFromTemperature } from '../utils'
import positionStore from './store'

export const randomizeLocations = (): {
  positions: number[]
  temperatures: number[]
  velocities: number[]
} => {
  const positions = []
  const temperatures = []
  const velocities = []

  for (let i = 0; i < MAX_PARTICLES; i++) {
    const randomY =
      Math.random() * positionStore.viewport.height -
      positionStore.viewport.top -
      positionStore.viewport.height / 2

    const randomX = Math.random() * positionStore.viewport.width - positionStore.viewport.width / 2
    positions.push(randomX, randomY, 0)

    const randomTemperature = Math.random() * 100
    temperatures.push(randomTemperature)
    velocities.push(
      Math.random() * PARTICLE_MAX_HORIZONTAL_SPEED - PARTICLE_MAX_HORIZONTAL_SPEED / 2,
      getAccelerationFromTemperature(randomTemperature),
    )
  }

  if (positionStore.pointsRef.current) {
    const pps = positionStore.pointsRef.current.geometry.getAttribute('position')
    const pts = positionStore.pointsRef.current.geometry.getAttribute('temperature')
    const pvs = positionStore.pointsRef.current.geometry.getAttribute('velocity')

    for (let i = 0; i < MAX_PARTICLES; i++) {
      pps.setXYZ(i, positions[i * 3], positions[i * 3 + 1], 0)
      pts.setXY(i, temperatures[i * 2], temperatures[i * 2 + 1])
      pvs.setX(i, velocities[i])
    }

    positionStore.pointsRef.current.geometry.setAttribute('position', pps)
    positionStore.pointsRef.current.geometry.setAttribute('temperature', pts)
    positionStore.pointsRef.current.geometry.setAttribute('velocity', pvs)
    positionStore.pointsRef.current.geometry.attributes.position.needsUpdate = true
    positionStore.pointsRef.current.geometry.attributes.temperature.needsUpdate = true
    positionStore.pointsRef.current.geometry.attributes.velocity.needsUpdate = true
  }

  return {
    positions,
    temperatures,
    velocities,
  }
}
