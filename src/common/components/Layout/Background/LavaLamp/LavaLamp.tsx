import { useFrame, useThree } from '@react-three/fiber'
import { useWindowListener } from '@yobgob/too-many-hooks'
import React, { useRef } from 'react'
import { Points, Sphere, Vector3 } from 'three'
import { usePoint2dMouse } from '../hooks'
import { Circle, Point2d, Polygon, RepellentShape, isCircle } from '../types'
import useFixedRepellents from '../useFixedRepellents'
import {
  generateRectangleFromBoundingRect,
  generateRectangleFromCenter,
  generateStar,
  getVisibleParticleRepellents,
  isPointInCircle,
  isPointInPolygon,
  projectWindowPointIntoViewport,
  scaleWidthIntoViewport,
} from '../utils'
import LavaShaderMaterial from './LavaShaderMaterial'
import { MAX_PARTICLES, PARTICLE_MAX_VERTICAL_SPEED, PARTICLE_RADIUS } from './constants'
import positionStore, { randomizeLocations } from './position-store'
import lavaLampSettings from './settings-store'
import { getAccelerationFromTemperature, getConvectionHeatTransferPerFrame } from './utils'

type Props = {
  top: number
  pathname: string
}

const LavaLamp: React.FC<Props> = ({ top, pathname }) => {
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
  positionStore.viewport = { width: viewport.width, height: viewport.height, top: viewportTop }

  const pointsRef = useRef<Points | null>(null)

  // create fixed repellent boundaries based on route
  const { fixedRepellentShapes, fixedRepellentMaxes, fixedRepellentMins } = useFixedRepellents({
    pathname,
    viewport,
  })

  const mouse = usePoint2dMouse(viewport)

  const { positions, temperatures, velocities } = randomizeLocations()

  const updatePositions = () => {
    // get current mouse repellent information
    const mouseShape: Circle | Polygon =
      lavaLampSettings.mouseShape === RepellentShape.Circle
        ? { ...mouse.current, radius: lavaLampSettings.mouseSize }
        : lavaLampSettings.mouseShape === RepellentShape.Star
          ? { vertices: generateStar(lavaLampSettings.mouseSize, mouse.current) }
          : {
              vertices: generateRectangleFromCenter(
                mouse.current,
                lavaLampSettings.mouseSize * 2,
                lavaLampSettings.mouseSize * 2,
              ),
            }
    const mouseMax: Point2d = isCircle(mouseShape)
      ? { x: mouseShape.x + mouseShape.radius, y: mouseShape.y + mouseShape.radius }
      : {
          x: Math.max.apply(
            Math,
            mouseShape.vertices.map(v => v.x),
          ),
          y: Math.max.apply(
            Math,
            mouseShape.vertices.map(v => v.y),
          ),
        }
    const mouseMin: Point2d = isCircle(mouseShape)
      ? { x: mouseShape.x - mouseShape.radius, y: mouseShape.y - mouseShape.radius }
      : {
          x: Math.min.apply(
            Math,
            mouseShape.vertices.map(v => v.x),
          ),
          y: Math.min.apply(
            Math,
            mouseShape.vertices.map(v => v.y),
          ),
        }

    // get other dynamic repellent information
    const dynamicRepellents = getVisibleParticleRepellents()
    const dynamicRepellentShapes: (Circle | Polygon)[] = dynamicRepellents.map(repellent => {
      const { top, right, bottom, left } = repellent.getBoundingClientRect()
      const repellentShape = repellent.getAttribute('data-repel-shape')

      switch (repellentShape) {
        case RepellentShape.Circle:
          return {
            ...projectWindowPointIntoViewport(
              { x: (right + left) / 2, y: (top + bottom) / 2 },
              viewportScale,
            ),
            radius: scaleWidthIntoViewport((right - left) / 2, viewportScale),
          }
        case RepellentShape.Rectangle:
          return {
            vertices: generateRectangleFromBoundingRect({ top, right, bottom, left }).map(point =>
              projectWindowPointIntoViewport(point, viewportScale),
            ),
          }
        case RepellentShape.Star:
          return {
            vertices: generateStar(bottom - top, {
              x: (right + left) / 2,
              y: (bottom + top) / 2,
            }).map(point => projectWindowPointIntoViewport(point, viewportScale)),
          }
        default:
          return {
            vertices: generateRectangleFromBoundingRect({ top, right, bottom, left }).map(point =>
              projectWindowPointIntoViewport(point, viewportScale),
            ),
          }
      }
    })
    const dynamicRepellentMaxes: Point2d[] = dynamicRepellentShapes.map(repellent =>
      isCircle(repellent)
        ? { x: repellent.x + repellent.radius, y: repellent.y + repellent.radius }
        : {
            x: Math.max.apply(
              Math,
              repellent.vertices.map(v => v.x),
            ),
            y: Math.max.apply(
              Math,
              repellent.vertices.map(v => v.y),
            ),
          },
    )
    const dynamicRepellentMins: Point2d[] = dynamicRepellentShapes.map(repellent =>
      isCircle(repellent)
        ? { x: repellent.x - repellent.radius, y: repellent.y - repellent.radius }
        : {
            x: Math.min.apply(
              Math,
              repellent.vertices.map(v => v.x),
            ),
            y: Math.min.apply(
              Math,
              repellent.vertices.map(v => v.y),
            ),
          },
    )

    const allRepellentShapes = [mouseShape, ...dynamicRepellentShapes, ...fixedRepellentShapes]
    const allRepellentMaxes = [mouseMax, ...dynamicRepellentMaxes, ...fixedRepellentMaxes]
    const allRepellentMins = [mouseMin, ...dynamicRepellentMins, ...fixedRepellentMins]
    const allRepellentCenters = allRepellentShapes.map((repellent, repellentIndex) =>
      isCircle(repellent)
        ? { x: repellent.x, y: repellent.y }
        : {
            x: (allRepellentMins[repellentIndex].x + allRepellentMaxes[repellentIndex].x) / 2,
            y: (allRepellentMins[repellentIndex].y + allRepellentMaxes[repellentIndex].y) / 2,
          },
    )

    if (pointsRef.current) {
      // get current three.js versions of point data
      const pps = pointsRef.current.geometry.getAttribute('position')
      const pvs = pointsRef.current.geometry.getAttribute('velocity')
      const pts = pointsRef.current.geometry.getAttribute('temperature')

      const pointBoundingSpheres = Array.from(
        { length: lavaLampSettings.particleCount },
        (_, index) =>
          new Sphere(
            new Vector3(pps.getX(index), pps.getY(index), pps.getZ(index)),
            PARTICLE_RADIUS * lavaLampSettings.particleScale,
          ),
      )

      // update each particle's position
      for (let i = 0, l = lavaLampSettings.particleCount; i < l; i++) {
        const temperature = pts.getX(i)

        let horizontalVelocity = pvs.getX(i)
        let verticalVelocity = pvs.getY(i)
        const currentPoint = { x: pps.getX(i), y: pps.getY(i) }

        // check for collisions with repellents
        allRepellentShapes.some((repellent, repellentIndex) => {
          const pointIsInRepellent = isCircle(repellent)
            ? repellent.radius > 0 && isPointInCircle(currentPoint, repellent)
            : isPointInPolygon(
                currentPoint,
                allRepellentMaxes[repellentIndex],
                allRepellentMins[repellentIndex],
                repellent.vertices,
              )

          if (pointIsInRepellent) {
            const onTop =
              currentPoint.y > allRepellentCenters[repellentIndex].y &&
              currentPoint.y < allRepellentMaxes[repellentIndex].y
            const hasCollidedWithTop = onTop && verticalVelocity < 0
            const onBottom =
              currentPoint.y < allRepellentCenters[repellentIndex].y &&
              currentPoint.y > allRepellentMins[repellentIndex].y
            const hasCollidedWithBottom = onBottom && verticalVelocity > 0
            const onLeft =
              currentPoint.x < allRepellentCenters[repellentIndex].x &&
              currentPoint.x > allRepellentMins[repellentIndex].x
            const hasCollidedWithLeft = onLeft && horizontalVelocity > 0
            const onRight =
              currentPoint.x > allRepellentCenters[repellentIndex].x &&
              currentPoint.x < allRepellentMaxes[repellentIndex].x
            const hasCollidedWithRight = onRight && horizontalVelocity < 0

            if (hasCollidedWithTop || hasCollidedWithBottom) {
              verticalVelocity = 0
            }
            if (hasCollidedWithLeft || hasCollidedWithRight) {
              horizontalVelocity *= -1
            }

            if (
              hasCollidedWithTop ||
              hasCollidedWithBottom ||
              hasCollidedWithLeft ||
              hasCollidedWithRight
            ) {
              horizontalVelocity *= 10
            }

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
          const collidedParticleVerticalVelocity = pvs.getY(particleCollisionIndex)
          const averageVerticalVelocity = (collidedParticleVerticalVelocity + verticalVelocity) / 2

          pvs.setY(particleCollisionIndex, averageVerticalVelocity)
          verticalVelocity = averageVerticalVelocity
        }

        // check for and handle collision with screen boundaries
        const atTop = pps.getY(i) > viewport.height / 2 - viewportTop
        const hasCollidedWithTop = atTop && verticalVelocity > 0
        const atBottom = pps.getY(i) < -viewport.height / 2
        const hasCollidedWithBottom = atBottom && verticalVelocity < 0
        const atLeft = pps.getX(i) > viewport.width / 2
        const hasCollidedWithLeft = atLeft && horizontalVelocity < 0
        const atRight = pps.getX(i) < -viewport.width / 2
        const hasCollidedWithRight = atRight && horizontalVelocity > 0
        if (hasCollidedWithTop || hasCollidedWithBottom) {
          verticalVelocity = 0
        }
        if (hasCollidedWithLeft || hasCollidedWithRight) {
          horizontalVelocity *= -1
        }

        // update particle location
        pps.setXY(i, pps.getX(i) + horizontalVelocity, pps.getY(i) + verticalVelocity)

        // update velocity
        const newPoint = { x: pps.getX(i), y: pps.getY(i) }
        const acceleration = getAccelerationFromTemperature(temperature)
        verticalVelocity = verticalVelocity + acceleration
        if (verticalVelocity > PARTICLE_MAX_VERTICAL_SPEED) {
          pvs.setY(i, PARTICLE_MAX_VERTICAL_SPEED)
        } else if (verticalVelocity < -PARTICLE_MAX_VERTICAL_SPEED) {
          pvs.setY(i, -PARTICLE_MAX_VERTICAL_SPEED)
        } else {
          pvs.setY(i, verticalVelocity)
        }

        // update temperature
        const temperatureChange = getConvectionHeatTransferPerFrame(newPoint, temperature)
        pts.setX(i, temperature - temperatureChange)
      }

      pointsRef.current.geometry.setAttribute('position', pps)
      pointsRef.current.geometry.setAttribute('velocity', pvs)
      pointsRef.current.geometry.setAttribute('temperature', pts)
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.geometry.attributes.velocity.needsUpdate = true
      pointsRef.current.geometry.attributes.temperature.needsUpdate = true
    }
  }

  useFrame(() => {
    updatePositions()

    if (pointsRef.current) {
      positionStore.pointsRef = pointsRef
      pointsRef.current.geometry.setDrawRange(0, lavaLampSettings.particleCount)
    }
  })

  if (positions.length < MAX_PARTICLES * 3) {
    return null
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={MAX_PARTICLES}
          array={new Float32Array(positions)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-temperature"
          count={MAX_PARTICLES}
          array={new Float32Array(temperatures)}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-velocity"
          count={MAX_PARTICLES}
          array={new Float32Array(velocities)}
          itemSize={2}
        />
      </bufferGeometry>
      <LavaShaderMaterial
        hotColor={lavaLampSettings.hotColor}
        coldColor={lavaLampSettings.coldColor}
      />
    </points>
  )
}

export default LavaLamp
