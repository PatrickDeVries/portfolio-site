import { useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { BufferAttribute, BufferGeometry, Points, ShaderMaterial } from 'three'
import { useSnapshot } from 'valtio'
import store, { MouseShape } from '../../particleControlCard/store'
import './particlematerial'
import { fragment, vertex } from './particlematerial'
import {
  Circle,
  escapeRadius,
  generateRectangleFromCenter,
  generateStar,
  getNewAngle,
  isCircle,
  isInCircle,
  isInPolygon,
  Point2d,
  Polygon,
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
    [],
  )

  // this works, but is not dependent on props
  useFrame(state => {
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
  const viewport = useThree(state => state.viewport)
  const viewportTop = top * (viewport.height / window.innerHeight)

  const pointRef = useRef<Points | null>(null)
  const particles = useRef<BufferGeometry | null>(null)

  const sizes = []
  const state = useSnapshot(store)

  const [positions, setPositions] = useState<number[]>([...(state.positions ?? [])])
  const [velocities, setVelocities] = useState<number[]>([...(state.velocities ?? [])])
  const [angles, setAngles] = useState<number[]>([...(state.angles ?? [])])

  const avoid = useMemo(
    () =>
      pathname === '/'
        ? [
            {
              vertices: generateStar(
                viewport.width < viewport.height ? viewport.width * 0.4 : viewport.height * 0.48,
                { x: 0, y: -viewportTop },
              ),
            },
          ]
        : pathname === '/portfolio'
        ? [
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
        : pathname === '/contact'
        ? [
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
        : [],
    [pathname, viewport.height, viewport.width, viewportTop],
  )

  const mouse = useRef<Point2d>({ x: 0, y: 0 })
  let mouseBounds: Circle | Polygon = useMemo(
    () =>
      state.mouseShape === MouseShape.Circle
        ? ({ ...mouse.current, radius: state.mouseSize } as Circle)
        : state.mouseShape === MouseShape.Star
        ? ({ vertices: generateStar(state.mouseSize, mouse.current) } as Polygon)
        : ({
            vertices: generateRectangleFromCenter(
              mouse.current,
              state.mouseSize * 2,
              state.mouseSize * 2,
            ),
          } as Polygon),
    [state.mouseShape, state.mouseSize],
  )

  let mouseMax: Point2d = useMemo(
    () =>
      !isCircle(mouseBounds)
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
        : { x: 0, y: 0 },
    [mouseBounds],
  )

  let mouseMin: Point2d = useMemo(
    () =>
      !isCircle(mouseBounds)
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
        : { x: 0, y: 0 },
    [mouseBounds],
  )

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
      [...avoid].map(a =>
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
    [avoid],
  )

  const mins: Point2d[] = useMemo(
    () =>
      [...avoid].map(a =>
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
    [avoid],
  )

  for (let i = 0; i < 999999; i++) {
    sizes.push(10)
  }

  if (positions.length < state.particleCount) {
    const newPositions = []
    const newVelocities = []
    const newAngles = []
    for (let i = 0; i < 999999; i++) {
      newPositions.push(
        Math.random() * viewport.width - viewport.width / 2,
        Math.random() * viewport.height - viewport.height / 2 - viewportTop,
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

    setPositions(newPositions)
    setVelocities(newVelocities)
    setAngles(newAngles)
  }

  const updatePositions = () => {
    if (particles.current) {
      const pps: BufferAttribute = particles.current['attributes']['position'] as BufferAttribute
      const pvs: BufferAttribute = particles.current['attributes']['velocity'] as BufferAttribute
      const pas: BufferAttribute = particles.current['attributes']['angle'] as BufferAttribute

      for (let i = 0, l = state.particleCount; i < l; i++) {
        const angle = pas.getX(i)
        const v = pvs.getX(i) * state.vVar + state.baseV
        const turnV = pvs.getY(i) * state.turnVar + state.baseTurnV

        pps.setXY(i, pps.getX(i) + v * Math.cos(angle), pps.getY(i) + v * Math.sin(angle))

        const flipX = pps.getX(i) > viewport.width / 2 || pps.getX(i) < -viewport.width / 2
        const flipY =
          pps.getY(i) > viewport.height / 2 - viewportTop || pps.getY(i) < -viewport.height / 2

        let mouseMoved = false
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
            mouseMoved = true
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
            mouseMoved = true
          }
        }

        if (
          avoid
            .map((boundary, bindex) => {
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
                    maxes[bindex],
                    mins[bindex],
                    boundary.vertices,
                  )
                ) {
                  pas.setX(
                    i,
                    escapeRadius(
                      { x: pps.getX(i), y: pps.getY(i), angle, turnV },
                      {
                        x: (maxes[bindex].x + mins[bindex].x) / 2,
                        y: (maxes[bindex].y + mins[bindex].y) / 2,
                        radius: Math.max.apply(Math, [viewport.width, viewport.height]),
                      },
                      1.5,
                    ),
                  )
                  return true
                }
              }
            })
            .some(val => val) ||
          mouseMoved
        ) {
          continue
        }
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
        } else if (state.freeThinkers === 0) {
          let goalAngle = 0
          if (i === 0) {
            goalAngle = Math.atan2(
              pps.getY(state.particleCount - 1) - pps.getY(i),
              pps.getX(state.particleCount - 1) - pps.getX(i),
            )
          } else {
            goalAngle = Math.atan2(pps.getY(i - 1) - pps.getY(i), pps.getX(i - 1) - pps.getX(i))
          }
          const newAngle = getNewAngle(angle, goalAngle, turnV)

          pas.setX(i, newAngle)
        } else if (i % Math.ceil(state.particleCount / state.freeThinkers) !== 0 && i > 0) {
          // non-free particles
          const goalAngle = Math.atan2(pps.getY(i - 1) - pps.getY(i), pps.getX(i - 1) - pps.getX(i))
          const newAngle = getNewAngle(angle, goalAngle, turnV)

          pas.setX(i, newAngle)
        }
      }
    }
  }

  useFrame(() => {
    updatePositions()
    if (particles.current) particles.current['attributes']['position'].needsUpdate = true
  })

  console.log(particles.current)

  return (
    <points ref={pointRef}>
      <bufferGeometry ref={particles} attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={state.particleCount}
          array={new Float32Array(positions)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-velocity"
          count={state.particleCount}
          array={new Float32Array(velocities)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-angle"
          count={state.particleCount}
          array={new Float32Array(angles)}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-size"
          count={state.particleCount}
          array={new Float32Array(sizes)}
          itemSize={1}
        />
      </bufferGeometry>
      <GetShaderMaterial colorA={state.colorA} colorB={state.colorB} bboxMin={-1} bboxMax={1} />
    </points>
  )
}

export default Particles
