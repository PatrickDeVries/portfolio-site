import { useFrame, useThree } from '@react-three/fiber'
import { useWindowListener } from '@yobgob/too-many-hooks'
import React, { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Points, Sphere, Vector3 } from 'three'
import { useSnapshot } from 'valtio'
import { usePoint2dMouse } from '../hooks'
import { Circle, Polygon } from '../types'
import {
  getMouseShape,
  getRadiusEscapeVelocities,
  getRepellentFromShape,
  getRepellentInfo,
  getWindowBoundsCollisions,
  isPointInShape,
} from '../utils'
import LavaShaderMaterial from './LavaShaderMaterial'
import {
  MAX_PARTICLES,
  PARTICLE_MAX_HORIZONTAL_SPEED,
  PARTICLE_MAX_VERTICAL_SPEED,
} from './constants'
import lavaLampPositionStore, { generateRandomLavaLampData } from './position-store'
import lavaLampSettings, { derivedLavaLampSettings } from './settings-store'
import {
  getAccelerationFromTemperature,
  getBoundedHorizontalVelocity,
  getBoundedVerticalVelocity,
  getConductionHeatTransferPerFrame,
  getConvectionHeatTransferPerFrame,
  getHorizontalAcceleration,
} from './utils'

type Props = {
  top: number
}

const LavaLamp: React.FC<Props> = ({ top }) => {
  useWindowListener('keyup', event => {
    if (event.key === '=') {
      lavaLampSettings.mouseSize =
        lavaLampSettings.mouseSize + 0.5 < 5 ? lavaLampSettings.mouseSize + 0.5 : 5
    } else if (event.key === '-') {
      lavaLampSettings.mouseSize =
        lavaLampSettings.mouseSize - 0.5 > 0 ? lavaLampSettings.mouseSize - 0.5 : 0
    }
  })

  const viewport = useThree(rootState => rootState.viewport)
  const viewportTop = top * (viewport.height / window.innerHeight)
  const viewportScale = {
    xMin: -viewport.width / 2,
    xMax: viewport.width / 2,
    yMin: -viewport.height / 2,
    yMax: viewport.height / 2,
  }
  lavaLampPositionStore.viewport = {
    width: viewport.width,
    height: viewport.height,
    top: viewportTop,
  }

  const {
    positions: initialPositions,
    temperatures: initialTemperatures,
    velocities: initialVelocities,
  } = generateRandomLavaLampData()

  const pointsRef = useRef<Points | null>(null)

  const mouse = usePoint2dMouse(viewport)
  const { mouseShape, mouseSize } = useSnapshot(lavaLampSettings)
  const { pathname } = useLocation()

  const updatePositions = () => {
    // get current mouse repellent information
    const mouseRepellentShape: Circle | Polygon = getMouseShape({
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
      const pts = pointsRef.current.geometry.getAttribute('temperature')
      const pvs = pointsRef.current.geometry.getAttribute('velocity')
      const pgvs = pointsRef.current.geometry.getAttribute('goalVelocity')

      const pointBoundingSpheres = Array.from(
        { length: lavaLampSettings.particleCount },
        (_, index) =>
          new Sphere(
            new Vector3(pps.getX(index), pps.getY(index), pps.getZ(index)),
            derivedLavaLampSettings.scaledParticleCollisionRadius,
          ),
      )

      // update each particle's position
      for (let i = 0, l = lavaLampSettings.particleCount; i < l; i++) {
        let temperature = pts.getX(i)
        const particleGoalHorizontalVelocity = pgvs.getX(i)

        let horizontalVelocity = pvs.getX(i)
        let verticalVelocity = pvs.getY(i)
        let horizontalAcceleration = getHorizontalAcceleration(
          particleGoalHorizontalVelocity,
          horizontalVelocity,
        )
        let verticalAcceleration = getAccelerationFromTemperature(temperature)

        const currentPoint = { x: pps.getX(i), y: pps.getY(i) }

        // check for collisions with repellents
        const repellentContainingParticle = allRepellents.find(({ shape, mins, maxes, center }) => {
          const pointIsInRepellent = isPointInShape({
            point: currentPoint,
            shape,
            shapeMins: mins,
            shapeMaxes: maxes,
          })

          if (pointIsInRepellent) {
            const {
              horizontalVelocity: escapeHorizontalVelocity,
              verticalVelocity: escapeVerticalVelocity,
            } = getRadiusEscapeVelocities({
              point: currentPoint,
              shapeCenter: center,
              shapeMins: mins,
              shapeMaxes: maxes,
              horizontalMaxSpeed: PARTICLE_MAX_HORIZONTAL_SPEED,
              verticalMaxSpeed: PARTICLE_MAX_VERTICAL_SPEED,
            })

            horizontalVelocity = escapeHorizontalVelocity
            verticalVelocity = escapeVerticalVelocity

            return true
          }

          return false
        })

        // check for particle collisions
        const particleBoundingSphere = pointBoundingSpheres[i]
        let particleCollisionIndex = pointBoundingSpheres
          .slice(i + 1)
          .findIndex(sphere => particleBoundingSphere.intersectsSphere(sphere))
        const hasCollidedWithParticle = particleCollisionIndex !== -1
        if (hasCollidedWithParticle) {
          particleCollisionIndex += i + 1

          // update velocities of particles
          const collidedParticleHorizontalVelocity = pvs.getX(particleCollisionIndex)
          const averageHorizontalVelocity =
            (collidedParticleHorizontalVelocity + horizontalVelocity) / 2
          pvs.setX(particleCollisionIndex, averageHorizontalVelocity)
          horizontalVelocity = averageHorizontalVelocity

          const collidedParticleVerticalVelocity = pvs.getY(particleCollisionIndex)
          const averageVerticalVelocity = (collidedParticleVerticalVelocity + verticalVelocity) / 2
          pvs.setY(particleCollisionIndex, averageVerticalVelocity)
          verticalVelocity = averageVerticalVelocity

          // update temperatures based on conduction
          const collidedParticleTemperature = pts.getX(particleCollisionIndex)
          const isCollidedParticleHotter = collidedParticleTemperature > temperature

          if (isCollidedParticleHotter) {
            const heatTransfer = getConductionHeatTransferPerFrame({
              tHot: collidedParticleTemperature,
              tCold: temperature,
            })

            temperature += heatTransfer
            pts.setX(collidedParticleTemperature, collidedParticleTemperature - heatTransfer)
          } else {
            const heatTransfer = getConductionHeatTransferPerFrame({
              tHot: temperature,
              tCold: collidedParticleTemperature,
            })

            temperature -= heatTransfer
            pts.setX(collidedParticleTemperature, collidedParticleTemperature + heatTransfer)
          }
        }

        // check for and handle collision with screen boundaries
        const {
          hasCollidedWithTop,
          hasCollidedWithRight,
          hasCollidedWithBottom,
          hasCollidedWithLeft,
        } = getWindowBoundsCollisions({
          viewport,
          viewportTop,
          position: currentPoint,
          xVelocity: horizontalVelocity,
          yVelocity: verticalVelocity,
        })

        if (hasCollidedWithTop || hasCollidedWithBottom) {
          verticalVelocity = 0
        }
        if (hasCollidedWithRight || hasCollidedWithLeft) {
          horizontalVelocity *= -1
          pgvs.setX(i, particleGoalHorizontalVelocity * -1)
        }

        // update particle location
        const newPoint = {
          x: currentPoint.x + horizontalVelocity,
          y: currentPoint.y + verticalVelocity,
        }
        pps.setXY(i, newPoint.x, newPoint.y)

        // if a particle was inside a repellent and has escaped, stop it
        if (repellentContainingParticle) {
          const pointIsInRepellent = isPointInShape({
            point: newPoint,
            shape: repellentContainingParticle.shape,
            shapeMins: repellentContainingParticle.mins,
            shapeMaxes: repellentContainingParticle.maxes,
          })

          // stop particle if it has escaped
          if (!pointIsInRepellent) {
            horizontalVelocity = 0
            horizontalAcceleration = 0
            verticalVelocity = 0
            verticalAcceleration = 0
          }
        }

        // update particle velocity
        pvs.setXY(
          i,
          getBoundedHorizontalVelocity(horizontalVelocity + horizontalAcceleration),
          getBoundedVerticalVelocity(verticalVelocity + verticalAcceleration),
        )

        // update temperature
        const temperatureChange = getConvectionHeatTransferPerFrame(newPoint, temperature)
        pts.setX(i, temperature - temperatureChange)
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.geometry.attributes.velocity.needsUpdate = true
      pointsRef.current.geometry.attributes.temperature.needsUpdate = true
      pointsRef.current.geometry.attributes.goalVelocity.needsUpdate = true
    }
  }

  useFrame(() => {
    updatePositions()

    if (pointsRef.current) {
      lavaLampPositionStore.pointsRef = pointsRef
      pointsRef.current.geometry.setDrawRange(0, lavaLampSettings.particleCount)
    }
  })

  if (initialPositions.length < MAX_PARTICLES * 3) {
    return null
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={MAX_PARTICLES}
          array={new Float32Array(initialPositions)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-temperature"
          count={MAX_PARTICLES}
          array={new Float32Array(initialTemperatures)}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-velocity"
          count={MAX_PARTICLES}
          array={new Float32Array(initialVelocities)}
          itemSize={2}
        />
        <bufferAttribute
          attach="attributes-goalVelocity"
          count={MAX_PARTICLES}
          array={new Float32Array(initialVelocities.filter((_, index) => index % 2 === 0))}
          itemSize={1}
        />
      </bufferGeometry>
      <LavaShaderMaterial />
    </points>
  )
}

export default LavaLamp
