import { MAX_PARTICLES } from '../constants'
import positionStore from './store'

export const randomizeLocations = (): {
  positions: number[]
  velocities: number[]
  angles: number[]
} => {
  const newPositions = []
  const newVelocities = []
  const newAngles = []

  for (let i = 0; i < MAX_PARTICLES; i++) {
    newPositions.push(
      Math.random() * positionStore.viewport.width - positionStore.viewport.width / 2,
      Math.random() * positionStore.viewport.height -
        positionStore.viewport.height / 2 -
        positionStore.viewport.top,
      0,
    )
    newVelocities.push(Math.random(), Math.random(), 0)
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
    newAngles.push(newA)
  }

  if (positionStore.pointsRef.current) {
    const pps = positionStore.pointsRef.current.geometry.getAttribute('position')
    const pvs = positionStore.pointsRef.current.geometry.getAttribute('velocity')
    const pas = positionStore.pointsRef.current.geometry.getAttribute('angle')

    for (let i = 0; i < MAX_PARTICLES; i++) {
      pps.setXYZ(i, newPositions[i * 3], newPositions[i * 3 + 1], 0)
      pvs.setXYZ(i, newVelocities[i * 3], newVelocities[i * 3 + 1], 0)
      pas.setX(i, newAngles[i])
    }
    positionStore.pointsRef.current.geometry.setAttribute('position', pps)
    positionStore.pointsRef.current.geometry.setAttribute('velocity', pvs)
    positionStore.pointsRef.current.geometry.setAttribute('angle', pas)
    positionStore.pointsRef.current.geometry.attributes.position.needsUpdate = true
    positionStore.pointsRef.current.geometry.attributes.velocity.needsUpdate = true
    positionStore.pointsRef.current.geometry.attributes.angle.needsUpdate = true
  }

  return { positions: newPositions, velocities: newVelocities, angles: newAngles }
}
