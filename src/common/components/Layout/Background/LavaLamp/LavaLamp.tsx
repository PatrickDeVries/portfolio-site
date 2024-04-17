import particleSettings from '@/background-editor/components/ParticleControlCard/store'
import { useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import { Points } from 'three'
import { usePoint2dMouse } from '../hooks'
import { Circle, Point2d, Polygon, RepellentShape, isCircle } from '../types'
import {
  generateRectangleFromBoundingRect,
  generateRectangleFromCenter,
  generateStar,
  getVisibleParticleRepellents,
  projectWindowPointIntoViewport,
  scaleWidthIntoViewport,
} from '../utils'
import LavaShaderMaterial from './LavaShaderMaterial'
import { MAX_PARTICLES, PARTICLE_MAX_SPEED } from './constants'
import positionStore, { randomizeLocations } from './store'
import { getAccelerationFromTemperature, getConvectionHeatTransferPerFrame } from './utils'

type Props = {
  top: number
  pathname: string
}

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

      // update each particle's position
      for (let i = 0, l = particleSettings.particleCount; i < l; i++) {
        const temperature = pts.getX(i)
        const velocity = pvs.getX(i)

        const atTop = pps.getY(i) > viewport.height / 2 - viewportTop
        const atBottom = pps.getY(i) < -viewport.height / 2

        if ((!atTop || velocity < 0) && (!atBottom || velocity > 0)) {
          pps.setXY(i, pps.getX(i), pps.getY(i) + velocity)
        }

        // get new location
        const currentPoint = { x: pps.getX(i), y: pps.getY(i) }
        const acceleration = getAccelerationFromTemperature(temperature)
        const newVelocity = velocity + acceleration
        if (newVelocity > PARTICLE_MAX_SPEED) {
          pvs.setX(i, PARTICLE_MAX_SPEED)
        } else if (newVelocity < -PARTICLE_MAX_SPEED) {
          pvs.setX(i, -PARTICLE_MAX_SPEED)
        } else {
          pvs.setX(i, newVelocity)
        }
        const temperatureChange = getConvectionHeatTransferPerFrame(currentPoint, temperature)
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
