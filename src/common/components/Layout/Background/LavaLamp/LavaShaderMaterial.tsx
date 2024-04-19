import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import { Color, ShaderMaterial, UniformsUtils } from 'three'
import { useSnapshot } from 'valtio'
import { PARTICLE_VISIBLE_RADIUS } from './constants'
import lavaLampSettings from './settings-store'
import { scaleSetting } from './utils'

const VERTEX = `
  attribute float temperature;
  uniform float pointSize;
  varying float temp;
  
  void main() {
    temp = temperature;
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;    
    gl_PointSize = pointSize;  
  }
`

const FRAGMENT = `
  uniform vec3 hotColor; 
  uniform vec3 coldColor; 
  varying float temp;

  void main() {
    float distance = length(2.0 * gl_PointCoord - 1.0);
    if (distance > 1.0) {
        discard;
    }
    gl_FragColor = vec4(mix(coldColor, hotColor, temp * .01), 1.0);
  }
`

const LavaShaderMaterial: React.FC<{
  hotColor: string
  coldColor: string
}> = ({ hotColor, coldColor }) => {
  const ref = useRef<ShaderMaterial | null>(null)

  const { particleScale } = useSnapshot(lavaLampSettings)
  const pointSize = scaleSetting({ base: PARTICLE_VISIBLE_RADIUS, scale: particleScale })

  const uniforms = UniformsUtils.merge([
    {
      hotColor: { value: new Color(hotColor) },
      coldColor: { value: new Color(coldColor) },
      pointSize: { value: pointSize },
    },
  ])

  useFrame(() => {
    if (ref.current) {
      ref.current.uniforms.hotColor.value = new Color(hotColor)
      ref.current.uniforms.coldColor.value = new Color(coldColor)
      ref.current.uniforms.pointSize.value = pointSize
    }
  })

  return (
    <shaderMaterial
      ref={ref}
      attach="material"
      uniforms={uniforms}
      vertexShader={VERTEX}
      fragmentShader={FRAGMENT}
    />
  )
}

export default LavaShaderMaterial
