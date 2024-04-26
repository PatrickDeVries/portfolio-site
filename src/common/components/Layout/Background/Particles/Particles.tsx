import { useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Points } from 'three'
import { useSnapshot } from 'valtio'
import { usePoint2dMouse } from '../hooks'
import {
  getAngleFromPoint,
  getMouseShape,
  getNewAngle,
  getRepellentFromShape,
  getRepellentInfo,
  getWindowBoundsCollisions,
  isPointInShape,
} from '../utils'
import { ParticleShaderMaterial } from './ParticleShaderMaterial'
import { MAX_PARTICLES } from './constants'
import particlesPositionStore, { generateRandomParticleData } from './position-store'
import particleSettings from './settings-store'

type Props = {
  top: number
}

const Particles: React.FC<Props> = ({ top }) => {
  const viewport = useThree(rootState => rootState.viewport)
  const viewportTop = top * (viewport.height / window.innerHeight)
  const viewportScale = useMemo(
    () => ({
      xMin: -viewport.width / 2,
      xMax: viewport.width / 2,
      yMin: -viewport.height / 2,
      yMax: viewport.height / 2,
    }),
    [viewport.height, viewport.width],
  )

  particlesPositionStore.viewport = {
    width: viewport.width,
    height: viewport.height,
    top: viewportTop,
  }
  const {
    positions: initialPositions,
    velocities: initialVelocities,
    angles: initialAngles,
  } = useMemo(generateRandomParticleData, [])

  const pointsRef = useRef<Points | null>(null)

  const mouse = usePoint2dMouse(viewport)
  const { mouseShape, mouseSize } = useSnapshot(particleSettings)
  const { pathname } = useLocation()

  const updatePositions = () => {
    // get current mouse repellent information
    const mouseRepellentShape = getMouseShape({
      position: mouse.current,
      shape: mouseShape,
      size: mouseSize,
    })
    const mouseRepellent = getRepellentFromShape(mouseRepellentShape)

    // get other repellent information
    const repellents = getRepellentInfo(pathname, viewport, viewportScale)

    const allRepellents = [mouseRepellent, ...repellents]

    if (pointsRef.current) {
      // get current three.js versions of point data
      const pps = pointsRef.current.geometry.getAttribute('position')
      const pvs = pointsRef.current.geometry.getAttribute('velocity')
      const pas = pointsRef.current.geometry.getAttribute('angle')

      // update each particle's position
      for (let i = 0, l = particleSettings.particleCount; i < l; i++) {
        let angle = pas.getX(i)
        const velocity = pvs.getX(i) * particleSettings.vVar + particleSettings.baseV
        const turnVelocity = pvs.getY(i) * particleSettings.turnVar + particleSettings.baseTurnV
        const previousPosition = { x: pps.getX(i), y: pps.getY(i) }

        const newPosition = {
          x: previousPosition.x + velocity * Math.cos(angle),
          y: previousPosition.y + velocity * Math.sin(angle),
        }

        // update point position
        pps.setXY(i, newPosition.x, newPosition.y)

        const particleWasRepelled = allRepellents.some(({ shape, mins, maxes, center }) => {
          const pointIsInRepellent = isPointInShape({
            point: newPosition,
            shape,
            shapeMins: mins,
            shapeMaxes: maxes,
          })

          if (pointIsInRepellent) {
            angle = getAngleFromPoint({
              point: newPosition,
              fromPoint: center,
            })

            pas.setX(i, angle)

            return true
          }

          return false
        })
        if (particleWasRepelled) continue

        const xVelocity = velocity * Math.cos(angle)
        const yVelocity = velocity * Math.sin(angle)

        // check for crossing window boundaries
        const {
          hasCollidedWithTop,
          hasCollidedWithRight,
          hasCollidedWithBottom,
          hasCollidedWithLeft,
        } = getWindowBoundsCollisions({
          viewport,
          viewportTop,
          position: newPosition,
          xVelocity,
          yVelocity,
        })

        const xNeedsInversion = hasCollidedWithRight || hasCollidedWithLeft
        const yNeedsInversion = hasCollidedWithTop || hasCollidedWithBottom

        // update angle
        // if particle was reflected by a window boundary
        if (xNeedsInversion || yNeedsInversion) {
          angle = Math.atan2(
            yNeedsInversion ? -yVelocity : yVelocity,
            xNeedsInversion ? -xVelocity : xVelocity,
          )
        }
        // if not reflected and there are no free thinkers
        else if (particleSettings.freeThinkers === 0) {
          const targetParticleIndex = i === 0 ? particleSettings.particleCount - 1 : i - 1
          const targetParticleLocation = {
            x: pps.getX(targetParticleIndex),
            y: pps.getY(targetParticleIndex),
          }
          const goalAngle = Math.atan2(
            targetParticleLocation.y - newPosition.y,
            targetParticleLocation.x - newPosition.x,
          )
          angle = getNewAngle(angle, goalAngle, turnVelocity)
        }
        // if not reflected, there are free thinkers, and this particle is not one
        else if (
          i > 0 &&
          i % Math.ceil(particleSettings.particleCount / particleSettings.freeThinkers) !== 0
        ) {
          const targetParticleLocation = {
            x: pps.getX(i - 1),
            y: pps.getY(i - 1),
          }
          const goalAngle = Math.atan2(
            targetParticleLocation.y - newPosition.y,
            targetParticleLocation.x - newPosition.x,
          )
          angle = getNewAngle(angle, goalAngle, turnVelocity)
        }

        pas.setX(i, angle)
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.geometry.attributes.velocity.needsUpdate = true
      pointsRef.current.geometry.attributes.angle.needsUpdate = true
    }
  }

  useFrame(() => {
    updatePositions()

    if (pointsRef.current) {
      particlesPositionStore.pointsRef = pointsRef
      pointsRef.current.geometry.setDrawRange(0, particleSettings.particleCount) // only draw particles [0-`particleCount`)
    }
  })

  const points = useMemo(
    () => (
      <points ref={pointsRef}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={MAX_PARTICLES}
            array={new Float32Array(initialPositions)}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-velocity"
            count={MAX_PARTICLES}
            array={new Float32Array(initialVelocities)}
            itemSize={2}
          />
          <bufferAttribute
            attach="attributes-angle"
            count={MAX_PARTICLES}
            array={new Float32Array(initialAngles)}
            itemSize={1}
          />
        </bufferGeometry>
        <ParticleShaderMaterial viewportScale={viewportScale} />
      </points>
    ),
    [initialPositions, initialVelocities, initialAngles, viewportScale],
  )

  return points
}

export default Particles
