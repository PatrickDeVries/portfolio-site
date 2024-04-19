import { useFrame, useThree } from '@react-three/fiber'
import { useWindowListener } from '@yobgob/too-many-hooks'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Points, ShaderMaterial } from 'three'
import { usePoint2dMouse } from '../hooks'
import { Circle, Point2d, Polygon, RepellentShape, isCircle } from '../types'
import {
  PI2,
  escapeRadius,
  generateRectangleFromCenter,
  generateStar,
  getNewAngle,
  getRepellentInfo,
  getShapeMax,
  getShapeMin,
  isPointInCircle,
  isPointInPolygon,
} from '../utils'
import { MAX_PARTICLES } from './constants'
import './particle-material'
import { fragment, vertex } from './particle-material'
import positionStore, { randomizeLocations } from './position-store'
import particleSettings from './settings-store'

const ParticleShaderMaterial: React.FC<{
  colorA: string
  colorB: string
  bboxMin: number
  bboxMax: number
}> = props => {
  const ref = useRef<ShaderMaterial | null>(null)

  const uniforms = useMemo(
    () =>
      THREE.UniformsUtils.merge([
        {
          colorA: { value: new THREE.Color(props.colorA) },
          colorB: { value: new THREE.Color(props.colorB) },
          bboxMin: { value: props.bboxMin },
          bboxMax: { value: props.bboxMax },
        },
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame(() => {
    if (ref.current) {
      ref.current.uniforms.colorA.value = new THREE.Color(props.colorA)
      ref.current.uniforms.colorB.value = new THREE.Color(props.colorB)
      ref.current.uniforms.bboxMin.value = props.bboxMin
      ref.current.uniforms.bboxMax.value = props.bboxMax
    }
  })

  return (
    <shaderMaterial
      ref={ref}
      attach="material"
      uniforms={uniforms}
      vertexShader={vertex}
      fragmentShader={fragment}
    />
  )
}

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
  const viewportScale = {
    xMin: -viewport.width / 2,
    xMax: viewport.width / 2,
    yMin: -viewport.height / 2,
    yMax: viewport.height / 2,
  }
  positionStore.viewport = { width: viewport.width, height: viewport.height, top: viewportTop }

  const pointsRef = useRef<Points | null>(null)

  const mouse = usePoint2dMouse(viewport)

  const { positions, velocities, angles } = randomizeLocations()

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
    const mouseMin: Point2d = getShapeMin(mouseShape)
    const mouseMax: Point2d = getShapeMax(mouseShape)

    // get other repellent information
    const { repellentShapes, repellentMins, repellentMaxes } = getRepellentInfo(
      viewport,
      viewportScale,
    )

    const allRepellentShapes = [mouseShape, ...repellentShapes]
    const allRepellentMaxes = [mouseMax, ...repellentMaxes]
    const allRepellentMins = [mouseMin, ...repellentMins]

    if (pointsRef.current) {
      // get current three.js versions of point data
      const pps = pointsRef.current.geometry.getAttribute('position')
      const pvs = pointsRef.current.geometry.getAttribute('velocity')
      const pas = pointsRef.current.geometry.getAttribute('angle')

      // update each particle's position
      for (let i = 0, l = particleSettings.particleCount; i < l; i++) {
        const angle = pas.getX(i)
        const v = pvs.getX(i) * particleSettings.vVar + particleSettings.baseV
        const turnV = pvs.getY(i) * particleSettings.turnVar + particleSettings.baseTurnV

        // update point position
        pps.setXY(i, pps.getX(i) + v * Math.cos(angle), pps.getY(i) + v * Math.sin(angle))

        const currentPoint = { x: pps.getX(i), y: pps.getY(i) }

        const particleWasRepelled = allRepellentShapes.some((repellent, repellentIndex) => {
          if (isCircle(repellent)) {
            if (repellent.radius > 0 && isPointInCircle(currentPoint, repellent)) {
              pas.setX(i, escapeRadius({ ...currentPoint, angle, turnV }, repellent, PI2))
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
              pas.setX(
                i,
                escapeRadius(
                  { ...currentPoint, angle, turnV },
                  {
                    x:
                      (allRepellentMaxes[repellentIndex].x + allRepellentMins[repellentIndex].x) /
                      2,
                    y:
                      (allRepellentMaxes[repellentIndex].y + allRepellentMins[repellentIndex].y) /
                      2,
                    radius: Math.max.apply(Math, [viewport.width, viewport.height]),
                  },
                  PI2,
                ),
              )
              return true
            }
          }
          return false
        })
        if (particleWasRepelled) continue

        // handle bouncing off window boundaries
        const flipX = pps.getX(i) > viewport.width / 2 || pps.getX(i) < -viewport.width / 2
        const flipY =
          pps.getY(i) > viewport.height / 2 - viewportTop || pps.getY(i) < -viewport.height / 2

        // if particle was not repelled, but is at a window boundary
        if (flipX || flipY) {
          pas.setX(
            i,
            Math.atan2((flipY ? -v : v) * Math.sin(angle), (flipX ? -v : v) * Math.cos(angle)),
          )
          // reset if it has somehow escaped
          if (
            pps.getX(i) + v * Math.cos(pas.getX(i)) > viewport.width / 2 ||
            pps.getX(i) + v * Math.cos(pas.getX(i)) < -viewport.width / 2 ||
            pps.getY(i) + v * Math.sin(pas.getX(i)) > viewport.height - viewportTop / 2 ||
            pps.getY(i) + v * Math.sin(pas.getX(i)) < -viewport.height / 2
          ) {
            pps.setXY(
              i,
              Math.random() * viewport.width - viewport.width / 2,
              Math.random() * viewport.height - viewport.height / 2 - viewport.top,
            )
          }
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
          const newAngle = getNewAngle(angle, goalAngle, turnV)

          pas.setX(i, newAngle)
        } else if (
          i % Math.ceil(particleSettings.particleCount / particleSettings.freeThinkers) !== 0 &&
          i > 0
        ) {
          // non-free particles
          const goalAngle = Math.atan2(pps.getY(i - 1) - pps.getY(i), pps.getX(i - 1) - pps.getX(i))
          const newAngle = getNewAngle(angle, goalAngle, turnV)

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
          attach="attributes-velocity"
          count={MAX_PARTICLES}
          array={new Float32Array(velocities)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-angle"
          count={MAX_PARTICLES}
          array={new Float32Array(angles)}
          itemSize={1}
        />
      </bufferGeometry>
      <ParticleShaderMaterial
        colorA={particleSettings.colorA}
        colorB={particleSettings.colorB}
        bboxMin={-1}
        bboxMax={1}
      />
    </points>
  )
}

export default Particles
