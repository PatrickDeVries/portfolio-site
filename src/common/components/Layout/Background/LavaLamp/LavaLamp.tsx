import particleSettings from '@/background-editor/components/ParticleControlCard/store'
import { useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import { Points, Sphere, Vector3 } from 'three'
import { usePoint2dMouse } from '../hooks'
import { Circle, Point2d, Polygon, RepellentShape, isCircle } from '../types'
import {
  PI2,
  escapeRadius,
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
import { MAX_PARTICLES, PARTICLE_MAX_SPEED, PARTICLE_RADIUS } from './constants'
import positionStore, { randomizeLocations } from './store'
import { getAccelerationFromTemperature, getConvectionHeatTransferPerFrame } from './utils'

type Props = {
  top: number
  pathname: string
}

// TODO: remove angle, replace with a tracked horizontal velocity, update both velocities during particle collisions

const LavaLamp: React.FC<Props> = ({ top, pathname }) => {
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
  const fixedRepellentShapes = useMemo(() => {
    if (pathname === '/')
      return [
        {
          vertices: generateStar(
            viewport.width < viewport.height ? viewport.width * 0.4 : viewport.height * 0.48,
            { x: 0, y: -viewportTop },
          ),
        },
      ]

    return []
  }, [pathname, viewport.height, viewport.width, viewportTop])
  const fixedRepellentMaxes: Point2d[] = useMemo(
    () =>
      fixedRepellentShapes.map(repellent =>
        isCircle(repellent)
          ? { x: 0, y: 0 }
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
      ),
    [fixedRepellentShapes],
  )
  const fixedRepellentMins: Point2d[] = useMemo(
    () =>
      fixedRepellentShapes.map(repellent =>
        isCircle(repellent)
          ? { x: 0, y: 0 }
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
      ),
    [fixedRepellentShapes],
  )

  const mouse = usePoint2dMouse(viewport)

  const { positions, temperatures, velocities, angles } = randomizeLocations()

  const updatePositions = () => {
    // get current mouse repellent information
    const mouseShape: Circle | Polygon =
      particleSettings.mouseShape === RepellentShape.Circle
        ? { ...mouse.current, radius: particleSettings.mouseSize }
        : particleSettings.mouseShape === RepellentShape.Star
          ? { vertices: generateStar(particleSettings.mouseSize, mouse.current) }
          : {
              vertices: generateRectangleFromCenter(
                mouse.current,
                particleSettings.mouseSize * 2,
                particleSettings.mouseSize * 2,
              ),
            }
    const mouseMax: Point2d = isCircle(mouseShape)
      ? { x: 0, y: 0 }
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
      ? { x: 0, y: 0 }
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
        ? { x: 0, y: 0 }
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
        ? { x: 0, y: 0 }
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

    if (pointsRef.current) {
      // get current three.js versions of point data
      const pps = pointsRef.current.geometry.getAttribute('position')
      const pvs = pointsRef.current.geometry.getAttribute('velocity')
      const pts = pointsRef.current.geometry.getAttribute('temperature')
      const pas = pointsRef.current.geometry.getAttribute('angle')

      const pointBoundingSpheres = Array.from(
        { length: particleSettings.particleCount },
        (_, index) =>
          new Sphere(
            new Vector3(pps.getX(index), pps.getY(index), pps.getZ(index)),
            PARTICLE_RADIUS,
          ),
      )

      // update each particle's position
      for (let i = 0, l = particleSettings.particleCount; i < l; i++) {
        const temperature = pts.getX(i)
        let velocity = pvs.getX(i)
        let angle = pas.getX(i)
        const currentPoint = { x: pps.getX(i), y: pps.getY(i) }

        // check for particle collisions
        const particleBoundingSphere = pointBoundingSpheres[i]
        let particleCollisionIndex = pointBoundingSpheres
          .slice(i + 1)
          .findIndex(sphere => particleBoundingSphere.intersectsSphere(sphere))
        const hasCollidedWithParticle = particleCollisionIndex !== -1
        if (hasCollidedWithParticle) {
          particleCollisionIndex += i + 1
          const collidedParticleVelocity = pvs.getX(particleCollisionIndex)
          const averageVelocity = (collidedParticleVelocity + velocity) / 2

          pvs.setX(particleCollisionIndex, averageVelocity)
          velocity = averageVelocity
        }

        let verticalVelocity = velocity
        let horizontalVelocity = velocity

        allRepellentShapes.some((repellent, repellentIndex) => {
          if (isCircle(repellent)) {
            if (repellent.radius > 0 && isPointInCircle(currentPoint, repellent)) {
              angle =
                escapeRadius(
                  { ...currentPoint, angle: angle - Math.PI / 2, turnV: Math.PI / 2 },
                  repellent,
                  PI2,
                ) -
                Math.PI / 2
              // pas.setX(
              //   i,
              //   escapeRadius(
              //     { ...currentPoint, angle: angle - Math.PI / 2, turnV: Math.PI / 2 },
              //     repellent,
              //     PI2,
              //   ),
              // )
              return true
            }
          } else {
            if (
              isPointInPolygon(
                currentPoint,
                allRepellentMaxes[repellentIndex],
                allRepellentMins[repellentIndex],
                repellent.vertices,
              )
            ) {
              const onLeft =
                Math.abs(allRepellentMins[repellentIndex].x - currentPoint.x) < PARTICLE_RADIUS
              const onRight =
                Math.abs(allRepellentMaxes[repellentIndex].x - currentPoint.x) < PARTICLE_RADIUS

              const onTop =
                Math.abs(allRepellentMaxes[repellentIndex].y - currentPoint.y) < PARTICLE_RADIUS
              const onBottom =
                Math.abs(allRepellentMins[repellentIndex].y - currentPoint.y) < PARTICLE_RADIUS
              if (onTop && verticalVelocity < 0) {
                horizontalVelocity = verticalVelocity
                angle *= 5
                verticalVelocity = 0
                // pps.setY(i, allRepellentMaxes[repellentIndex].y + 0.01)
              } else if (onBottom && verticalVelocity > 0) {
                horizontalVelocity = verticalVelocity
                angle *= 5
                verticalVelocity = 0
                // pps.setY(i, allRepellentMins[repellentIndex].y - 0.01)
              } else if (onLeft && angle < 0) {
                angle *= -1
                // pps.setX(i, allRepellentMins[repellentIndex].x - 0.01)
              } else if (onRight && angle > 0) {
                angle *= -1
                // pps.setX(i, allRepellentMaxes[repellentIndex].x + 0.01)
              }
              // angle =
              //   escapeRadius(
              //     { ...currentPoint, angle: angle - Math.PI / 2, turnV: Math.PI / 2 },
              //     {
              //       x:
              //         (allRepellentMaxes[repellentIndex].x + allRepellentMins[repellentIndex].x) /
              //         2,
              //       y:
              //         (allRepellentMaxes[repellentIndex].y + allRepellentMins[repellentIndex].y) /
              //         2,
              //       radius: Math.max.apply(Math, [viewport.width, viewport.height]),
              //     },
              //     PI2,
              //   ) -
              //   Math.PI / 2
              // pas.setX(
              //   i,
              //   escapeRadius(
              //     { ...currentPoint, angle, turnV },
              // {
              //   x:
              //     (allRepellentMaxes[repellentIndex].x + allRepellentMins[repellentIndex].x) /
              //     2,
              //   y:
              //     (allRepellentMaxes[repellentIndex].y + allRepellentMins[repellentIndex].y) /
              //     2,
              //   radius: Math.max.apply(Math, [viewport.width, viewport.height]),
              // },
              //     PI2,
              //   ),
              // )
              return true
            }
          }
          return false
        })

        // check for collision with top or bottom of screen
        const atTop = pps.getY(i) > viewport.height / 2 - viewportTop
        const hasCollidedWithTop = atTop && velocity > 0
        const atBottom = pps.getY(i) < -viewport.height / 2
        const hasCollidedWithBottom = atBottom && velocity < 0
        const hasCollidedWithVerticalBoundary = hasCollidedWithTop || hasCollidedWithBottom
        if (hasCollidedWithVerticalBoundary) {
          verticalVelocity = 0
        }

        const hasCollided = hasCollidedWithParticle || hasCollidedWithVerticalBoundary

        horizontalVelocity = hasCollided
          ? (Math.abs(velocity) * Math.sin(angle - Math.PI)) / 2
          : Math.abs(velocity) * Math.sin(angle - Math.PI)

        // update particle location
        pps.setXY(i, pps.getX(i) + horizontalVelocity, pps.getY(i) + verticalVelocity)

        // check for collision with left or right of screen and bounce if applicable
        const atLeft = pps.getX(i) > viewport.width / 2
        const atRight = pps.getX(i) < -viewport.width / 2
        if (atLeft || atRight) pas.setX(i, -angle)

        // update velocity
        const newPoint = { x: pps.getX(i), y: pps.getY(i) }
        const acceleration = getAccelerationFromTemperature(temperature)
        const newVelocity = velocity + acceleration
        if (newVelocity > PARTICLE_MAX_SPEED) {
          pvs.setX(i, PARTICLE_MAX_SPEED)
        } else if (newVelocity < -PARTICLE_MAX_SPEED) {
          pvs.setX(i, -PARTICLE_MAX_SPEED)
        } else {
          pvs.setX(i, newVelocity)
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
      pointsRef.current.geometry.setDrawRange(0, particleSettings.particleCount)
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
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-angle"
          count={MAX_PARTICLES}
          array={new Float32Array(angles)}
          itemSize={1}
        />
      </bufferGeometry>
      <LavaShaderMaterial colorA={particleSettings.colorA} colorB={particleSettings.colorB} />
    </points>
  )
}

export default LavaLamp
