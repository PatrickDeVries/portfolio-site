import { MAX_PARTICLES, PARTICLE_MAX_HORIZONTAL_SPEED } from '../constants'
import { getAccelerationFromTemperature } from '../utils'
import lavaLampPositionStore from './store'

export const generateRandomLavaLampData = (): {
  positions: number[]
  temperatures: number[]
  velocities: number[]
} => {
  const positions = []
  const temperatures = []
  const velocities = []

  for (let i = 0; i < MAX_PARTICLES; i++) {
    const randomY =
      Math.random() * lavaLampPositionStore.viewport.height -
      lavaLampPositionStore.viewport.top -
      lavaLampPositionStore.viewport.height / 2

    const randomX =
      Math.random() * lavaLampPositionStore.viewport.width -
      lavaLampPositionStore.viewport.width / 2
    positions.push(randomX, randomY, 0)

    const randomTemperature = Math.random() * 100
    temperatures.push(randomTemperature)
    velocities.push(
      Math.random() * PARTICLE_MAX_HORIZONTAL_SPEED - PARTICLE_MAX_HORIZONTAL_SPEED / 2,
      getAccelerationFromTemperature(randomTemperature),
    )
  }

  return {
    positions,
    temperatures,
    velocities,
  }
}

export const randomizeLavaLampData = () => {
  const { positions, temperatures, velocities } = generateRandomLavaLampData()

  if (lavaLampPositionStore.pointsRef.current) {
    const pps = lavaLampPositionStore.pointsRef.current.geometry.getAttribute('position')
    const pts = lavaLampPositionStore.pointsRef.current.geometry.getAttribute('temperature')
    const pvs = lavaLampPositionStore.pointsRef.current.geometry.getAttribute('velocity')

    for (let i = 0; i < MAX_PARTICLES; i++) {
      pps.setXYZ(i, positions[i * 3], positions[i * 3 + 1], 0)
      pts.setXY(i, temperatures[i * 2], temperatures[i * 2 + 1])
      pvs.setX(i, velocities[i])
    }

    lavaLampPositionStore.pointsRef.current.geometry.setAttribute('position', pps)
    lavaLampPositionStore.pointsRef.current.geometry.setAttribute('temperature', pts)
    lavaLampPositionStore.pointsRef.current.geometry.setAttribute('velocity', pvs)
    lavaLampPositionStore.pointsRef.current.geometry.attributes.position.needsUpdate = true
    lavaLampPositionStore.pointsRef.current.geometry.attributes.temperature.needsUpdate = true
    lavaLampPositionStore.pointsRef.current.geometry.attributes.velocity.needsUpdate = true
  }
}
