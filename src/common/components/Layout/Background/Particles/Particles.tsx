import { useFrame, useThree } from '@react-three/fiber'
import { useWindowListener } from '@yobgob/too-many-hooks'
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
  useWindowListener('keyup', event => {
    if (event.key === '=') {
      particleSettings.mouseSize =
        particleSettings.mouseSize + 0.5 < 5 ? particleSettings.mouseSize + 0.5 : 5
    } else if (event.key === '-') {
      particleSettings.mouseSize =
        particleSettings.mouseSize - 0.5 > 0 ? particleSettings.mouseSize - 0.5 : 0
    }
  })

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

        if (xNeedsInversion || yNeedsInversion) {
          angle = Math.atan2(
            yNeedsInversion ? -yVelocity : yVelocity,
            xNeedsInversion ? -xVelocity : xVelocity,
          )
          pas.setX(i, angle)
        } else if (particleSettings.freeThinkers === 0) {
          let goalAngle = 0
          if (i === 0) {
            goalAngle = Math.atan2(
              pps.getY(particleSettings.particleCount - 1) - pps.getY(i),
              pps.getX(particleSettings.particleCount - 1) - pps.getX(i),
            )
          } else {
            goalAngle = Math.atan2(pps.getY(i - 1) - pps.getY(i), pps.getX(i - 1) - pps.getX(i))
          }
          const newAngle = getNewAngle(angle, goalAngle, turnVelocity)

          pas.setX(i, newAngle)
        } else if (
          i % Math.ceil(particleSettings.particleCount / particleSettings.freeThinkers) !== 0 &&
          i > 0
        ) {
          // non-free particles
          const goalAngle = Math.atan2(pps.getY(i - 1) - pps.getY(i), pps.getX(i - 1) - pps.getX(i))
          const newAngle = getNewAngle(angle, goalAngle, turnVelocity)

          pas.setX(i, newAngle)
        }
      }

      pointsRef.current.geometry.setAttribute('position', pps)
      pointsRef.current.geometry.setAttribute('velocity', pvs)
      pointsRef.current.geometry.setAttribute('angle', pas)
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.geometry.attributes.velocity.needsUpdate = true
      pointsRef.current.geometry.attributes.angle.needsUpdate = true
    }
  }

  useFrame(() => {
    updatePositions()

    if (pointsRef.current) {
      particlesPositionStore.pointsRef = pointsRef
      pointsRef.current.geometry.setDrawRange(0, particleSettings.particleCount)
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
