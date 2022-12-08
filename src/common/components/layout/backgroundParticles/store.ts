import React from 'react'
import { proxy } from 'valtio'
import { MAX_PARTICLES } from './constants'

export type Positions = {
  viewport: { width: number; height: number; top: number }
  pointsRef: React.MutableRefObject<THREE.Points | null>
}

const DEFAULT_POSITIONS: Positions = {
  viewport: { width: 0, height: 0, top: 0 },
  pointsRef: React.createRef(),
}

const particlePositions = proxy(DEFAULT_POSITIONS)

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
      Math.random() * particlePositions.viewport.width - particlePositions.viewport.width / 2,
      Math.random() * particlePositions.viewport.height -
        particlePositions.viewport.height / 2 -
        particlePositions.viewport.top,
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

  if (particlePositions.pointsRef.current) {
    const pps = particlePositions.pointsRef.current.geometry.getAttribute('position')
    const pvs = particlePositions.pointsRef.current.geometry.getAttribute('velocity')
    const pas = particlePositions.pointsRef.current.geometry.getAttribute('angle')

    for (let i = 0; i < MAX_PARTICLES; i++) {
      pps.setXYZ(i, newPositions[i * 3], newPositions[i * 3 + 1], 0)
      pvs.setXYZ(i, newVelocities[i * 3], newVelocities[i * 3 + 1], 0)
      pas.setX(i, newAngles[i])
    }
    particlePositions.pointsRef.current.geometry.setAttribute('position', pps)
    particlePositions.pointsRef.current.geometry.setAttribute('velocity', pvs)
    particlePositions.pointsRef.current.geometry.setAttribute('angle', pas)
    particlePositions.pointsRef.current.geometry.attributes.position.needsUpdate = true
    particlePositions.pointsRef.current.geometry.attributes.velocity.needsUpdate = true
    particlePositions.pointsRef.current.geometry.attributes.angle.needsUpdate = true
  }

  return { positions: newPositions, velocities: newVelocities, angles: newAngles }
}

export default particlePositions
