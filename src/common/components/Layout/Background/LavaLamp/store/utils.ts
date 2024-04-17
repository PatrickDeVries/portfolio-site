import { MAX_PARTICLES } from '../constants'
import { getAccelerationFromTemperature } from '../utils'
import positionStore from './store'

export const randomizeLocations = (): {
  positions: number[]
  temperatures: number[]
  velocities: number[]
  angles: number[]
} => {
  const positions = []
  const temperatures = []
  const velocities = []
  const angles = []

  for (let i = 0; i < MAX_PARTICLES; i++) {
    const randomY =
      (Math.random() * positionStore.viewport.height) / 4 -
      positionStore.viewport.top -
      positionStore.viewport.height / 2

    const randomX = Math.random() * positionStore.viewport.width - positionStore.viewport.width / 2
    positions.push(randomX, randomY, 0)

    const randomTemperature = Math.random() * 100
    temperatures.push(randomTemperature)
    velocities.push(getAccelerationFromTemperature(randomTemperature))

    let newA = Math.random() * 2 * Math.PI
    if (
      newA < 0.01 ||
      newA > Math.PI - 0.01 ||
      (newA < Math.PI / 2 + 0.01 && newA > Math.PI / 2 - 0.01) ||
      (newA < Math.PI / 4 + 0.01 && newA > Math.PI / 4 - 0.01) ||
      (newA < (Math.PI * 3) / 4 + 0.01 && newA > (Math.PI * 3) / 4 - 0.01)
    ) {
      newA += 0.03
    }
    angles.push(newA)
  }

  if (positionStore.pointsRef.current) {
    const pps = positionStore.pointsRef.current.geometry.getAttribute('position')
    const pts = positionStore.pointsRef.current.geometry.getAttribute('temperature')
    const pvs = positionStore.pointsRef.current.geometry.getAttribute('velocity')
    const pas = positionStore.pointsRef.current.geometry.getAttribute('angle')

    for (let i = 0; i < MAX_PARTICLES; i++) {
      pps.setXYZ(i, positions[i * 3], positions[i * 3 + 1], 0)
      pts.setX(i, temperatures[i])
      pas.setX(i, angles[i])
    }
    positionStore.pointsRef.current.geometry.setAttribute('position', pps)
    positionStore.pointsRef.current.geometry.setAttribute('temperature', pts)
    positionStore.pointsRef.current.geometry.setAttribute('velocity', pvs)
    positionStore.pointsRef.current.geometry.setAttribute('angle', pas)
    positionStore.pointsRef.current.geometry.attributes.position.needsUpdate = true
    positionStore.pointsRef.current.geometry.attributes.temperature.needsUpdate = true
    positionStore.pointsRef.current.geometry.attributes.velocity.needsUpdate = true
    positionStore.pointsRef.current.geometry.attributes.angle.needsUpdate = true
  }

  return {
    positions,
    temperatures,
    velocities,
    angles,
  }
}
