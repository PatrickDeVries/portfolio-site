import particleSettings, { MouseShape } from '@/common/components/ParticleControlCard/store'
import { useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Points, ShaderMaterial } from 'three'
import { MAX_PARTICLES } from './constants'
import './particle-material'
import { fragment, vertex } from './particle-material'
import positionStore, { randomizeLocations } from './store'
import {
  Circle,
  Point2d,
  Polygon,
  escapeRadius,
  generateRectangleFromCenter,
  generateStar,
  getNewAngle,
  isCircle,
  isInCircle,
  isInPolygon,
} from './utils'

const GetShaderMaterial: React.FC<{
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
  pathname: string
}

const Particles: React.FC<Props> = ({ top, pathname }) => {
  const viewport = useThree(rootState => rootState.viewport)
  const viewportTop = top * (viewport.height / window.innerHeight)
  positionStore.viewport = { width: viewport.width, height: viewport.height, top: viewportTop }

  const pointsRef = useRef<Points | null>(null)

  const fixedRepellents = useMemo(() => {
    if (pathname === '/')
      return [
        {
          vertices: generateStar(
            viewport.width < viewport.height ? viewport.width * 0.4 : viewport.height * 0.48,
            { x: 0, y: -viewportTop },
          ),
        },
      ]
    if (pathname === '/contact')
      return [
        {
          vertices: generateRectangleFromCenter(
            { x: 0, y: -viewportTop / 2 },
            viewport.height -
              (viewport.height > viewport.width ? viewport.height / 10 : viewport.width / 10),
            viewport.width -
              (viewport.height > viewport.width ? viewport.height / 10 : viewport.width / 10),
          ),
        },
      ]
    if (pathname === '/portfolio') {
      return [
        {
          x: -viewport.width / 4,
          y: -viewport.height / 4 - viewportTop / 2,
          radius: viewport.height > viewport.width ? viewport.width / 5 : viewport.height / 5,
        },
        {
          x: -viewport.width / 4,
          y: viewport.height / 4 - viewportTop / 2,
          radius: viewport.height > viewport.width ? viewport.width / 5 : viewport.height / 5,
        },
        {
          x: viewport.width / 4,
          y: -viewport.height / 4 - viewportTop / 2,
          radius: viewport.height > viewport.width ? viewport.width / 5 : viewport.height / 5,
        },
        {
          x: viewport.width / 4,
          y: viewport.height / 4 - viewportTop / 2,
          radius: viewport.height > viewport.width ? viewport.width / 5 : viewport.height / 5,
        },
      ]
    }

    return []
  }, [pathname, viewport.height, viewport.width, viewportTop])

  const mouse = useRef<Point2d>({ x: 0, y: 0 })

  document.onmousemove = event => {
    mouse.current = {
      x: ((event.clientX - 0) * viewport.width) / window.innerWidth + -viewport.width / 2,
      y: ((event.clientY - 0) * -viewport.height) / window.innerHeight + viewport.height / 2,
    }
  }

  document.ontouchmove = event => {
    mouse.current = {
      x:
        ((event.changedTouches[0].clientX - 0) * viewport.width) / window.innerWidth +
        -viewport.width / 2,
      y:
        ((event.changedTouches[0].clientY - 0) * -viewport.height) / window.innerHeight +
        viewport.height / 2,
    }
  }

  const maxes: Point2d[] = useMemo(
    () =>
      [...fixedRepellents].map(a =>
        isCircle(a)
          ? { x: 0, y: 0 }
          : {
              x: Math.max.apply(
                Math,
                a.vertices.map(v => v.x),
              ),
              y: Math.max.apply(
                Math,
                a.vertices.map(v => v.y),
              ),
            },
      ),
    [fixedRepellents],
  )

  const mins: Point2d[] = useMemo(
    () =>
      [...fixedRepellents].map(a =>
        isCircle(a)
          ? { x: 0, y: 0 }
          : {
              x: Math.min.apply(
                Math,
                a.vertices.map(v => v.x),
              ),
              y: Math.min.apply(
                Math,
                a.vertices.map(v => v.y),
              ),
            },
      ),
    [fixedRepellents],
  )

  let ps: number[] = []
  let vs: number[] = []
  let as: number[] = []
  // if there are not enough particles, create random particle positions, velocities, and angles
  if (ps.length < MAX_PARTICLES * 3) {
    const { positions, velocities, angles } = randomizeLocations()
    ps = positions
    vs = velocities
    as = angles
  }

  const updatePositions = () => {
    // get current mouse repellent information
    let mouseBounds: Circle | Polygon =
      particleSettings.mouseShape === MouseShape.Circle
        ? ({ ...mouse.current, radius: particleSettings.mouseSize } as Circle)
        : particleSettings.mouseShape === MouseShape.Star
          ? ({ vertices: generateStar(particleSettings.mouseSize, mouse.current) } as Polygon)
          : ({
              vertices: generateRectangleFromCenter(
                mouse.current,
                particleSettings.mouseSize * 2,
                particleSettings.mouseSize * 2,
              ),
            } as Polygon)

    let mouseMax: Point2d = !isCircle(mouseBounds)
      ? {
          x: Math.max.apply(
            Math,
            mouseBounds.vertices.map(v => v.x),
          ),
          y: Math.max.apply(
            Math,
            mouseBounds.vertices.map(v => v.y),
          ),
        }
      : { x: 0, y: 0 }

    let mouseMin: Point2d = !isCircle(mouseBounds)
      ? {
          x: Math.min.apply(
            Math,
            mouseBounds.vertices.map(v => v.x),
          ),
          y: Math.min.apply(
            Math,
            mouseBounds.vertices.map(v => v.y),
          ),
        }
      : { x: 0, y: 0 }

    if (pointsRef.current) {
      // get current three.js representations of point data
      const pps = pointsRef.current.geometry.getAttribute('position')
      const pvs = pointsRef.current.geometry.getAttribute('velocity')
      const pas = pointsRef.current.geometry.getAttribute('angle')

      // update each particle's position
      for (let i = 0, l = particleSettings.particleCount; i < l; i++) {
        const angle = pas.getX(i)
        const v = pvs.getX(i) * particleSettings.vVar + particleSettings.baseV
        const turnV = pvs.getY(i) * particleSettings.turnVar + particleSettings.baseTurnV

        pps.setXY(i, pps.getX(i) + v * Math.cos(angle), pps.getY(i) + v * Math.sin(angle))

        // handle bouncing off window boundaries
        const flipX = pps.getX(i) > viewport.width / 2 || pps.getX(i) < -viewport.width / 2
        const flipY =
          pps.getY(i) > viewport.height / 2 - viewportTop || pps.getY(i) < -viewport.height / 2

        let particleWasMovedByMouse = false
        if (isCircle(mouseBounds)) {
          if (
            mouseBounds.radius > 0 &&
            isInCircle(
              { x: pps.getX(i), y: pps.getY(i) },
              { x: mouse.current.x, y: mouse.current.y, radius: mouseBounds.radius },
            )
          ) {
            pas.setX(
              i,
              escapeRadius(
                { x: pps.getX(i), y: pps.getY(i), angle, turnV },
                { x: mouse.current.x, y: mouse.current.y, radius: mouseBounds.radius },
                1.5,
              ),
            )
            particleWasMovedByMouse = true
          }
        } else {
          if (
            isInPolygon(
              { x: pps.getX(i), y: pps.getY(i) },
              mouseMax,
              mouseMin,
              mouseBounds.vertices,
            )
          ) {
            pas.setX(
              i,
              escapeRadius(
                { x: pps.getX(i), y: pps.getY(i), angle, turnV },
                {
                  x: (mouseMax.x + mouseMin.x) / 2,
                  y: (mouseMax.y + mouseMin.y) / 2,
                  radius: Math.max.apply(Math, [viewport.width, viewport.height]),
                },
                1.5,
              ),
            )
            particleWasMovedByMouse = true
          }
        }

        // if particle was repelled, continue to next particle
        if (
          particleWasMovedByMouse ||
          fixedRepellents.some((boundary, boundaryIndex) => {
            if (isCircle(boundary)) {
              if (
                boundary.radius > 0 &&
                isInCircle(
                  { x: pps.getX(i), y: pps.getY(i) },
                  { x: boundary.x, y: boundary.y, radius: boundary.radius },
                )
              ) {
                pas.setX(
                  i,
                  escapeRadius(
                    { x: pps.getX(i), y: pps.getY(i), angle, turnV },
                    { x: boundary.x, y: boundary.y, radius: boundary.radius },
                    1.5,
                  ),
                )
                return true
              }
            } else {
              if (
                isInPolygon(
                  { x: pps.getX(i), y: pps.getY(i) },
                  maxes[boundaryIndex],
                  mins[boundaryIndex],
                  boundary.vertices,
                )
              ) {
                pas.setX(
                  i,
                  escapeRadius(
                    { x: pps.getX(i), y: pps.getY(i), angle, turnV },
                    {
                      x: (maxes[boundaryIndex].x + mins[boundaryIndex].x) / 2,
                      y: (maxes[boundaryIndex].y + mins[boundaryIndex].y) / 2,
                      radius: Math.max.apply(Math, [viewport.width, viewport.height]),
                    },
                    1.5,
                  ),
                )
                return true
              }
            }
            return false
          })
        ) {
          continue
        }

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
            pps.setXY(i, 0, 0)
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

  if (ps.length < MAX_PARTICLES * 3) {
    return null
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={MAX_PARTICLES}
          array={new Float32Array(ps)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-velocity"
          count={MAX_PARTICLES}
          array={new Float32Array(vs)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-angle"
          count={MAX_PARTICLES}
          array={new Float32Array(as)}
          itemSize={1}
        />
      </bufferGeometry>
      <GetShaderMaterial
        colorA={particleSettings.colorA}
        colorB={particleSettings.colorB}
        bboxMin={-1}
        bboxMax={1}
      />
    </points>
  )
}

export default Particles
