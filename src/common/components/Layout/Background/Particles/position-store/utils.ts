import { MAX_PARTICLES } from '../constants'
import particlesPositionStore from './store'

export const generateRandomParticleData = (): {
  positions: number[]
  velocities: number[]
  angles: number[]
} => {
  const positions = []
  const velocities = []
  const angles = []

  for (let i = 0; i < MAX_PARTICLES; i++) {
    positions.push(
      Math.random() * particlesPositionStore.viewport.width -
        particlesPositionStore.viewport.width / 2,
      Math.random() * particlesPositionStore.viewport.height -
        particlesPositionStore.viewport.height / 2 -
        particlesPositionStore.viewport.top,
    )
    velocities.push(Math.random(), Math.random())
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

  return { positions, velocities, angles }
}

export const randomizeParticleData = () => {
  const { positions, velocities, angles } = generateRandomParticleData()

  if (particlesPositionStore.pointsRef.current) {
    const pps = particlesPositionStore.pointsRef.current.geometry.getAttribute('position')
    const pvs = particlesPositionStore.pointsRef.current.geometry.getAttribute('velocity')
    const pas = particlesPositionStore.pointsRef.current.geometry.getAttribute('angle')

    for (let i = 0; i < MAX_PARTICLES; i++) {
      pps.setXY(i, positions[i * 2], positions[i * 2 + 1])
      pvs.setXY(i, velocities[i * 2], velocities[i * 2 + 1])
      pas.setX(i, angles[i])
    }
    particlesPositionStore.pointsRef.current.geometry.setAttribute('position', pps)
    particlesPositionStore.pointsRef.current.geometry.setAttribute('velocity', pvs)
    particlesPositionStore.pointsRef.current.geometry.setAttribute('angle', pas)
    particlesPositionStore.pointsRef.current.geometry.attributes.position.needsUpdate = true
    particlesPositionStore.pointsRef.current.geometry.attributes.velocity.needsUpdate = true
    particlesPositionStore.pointsRef.current.geometry.attributes.angle.needsUpdate = true
  }
}
