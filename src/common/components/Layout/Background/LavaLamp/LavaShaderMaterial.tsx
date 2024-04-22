import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import { Color, ShaderMaterial } from 'three'
import lavaLampSettings, { derivedLavaLampSettings } from './settings-store'

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

const LavaShaderMaterial: React.FC = () => {
  const ref = useRef<ShaderMaterial | null>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.uniforms.hotColor.value = new Color(lavaLampSettings.hotColor)
      ref.current.uniforms.coldColor.value = new Color(lavaLampSettings.coldColor)
      ref.current.uniforms.pointSize.value = derivedLavaLampSettings.scaledParticleVisibleRadius
    }
  })

  return (
    <shaderMaterial
      ref={ref}
      attach="material"
      uniforms={{
        hotColor: { value: new Color(lavaLampSettings.hotColor) },
        coldColor: { value: new Color(lavaLampSettings.coldColor) },
        pointSize: {
          value: derivedLavaLampSettings.scaledParticleVisibleRadius,
        },
      }}
      vertexShader={VERTEX}
      fragmentShader={FRAGMENT}
    />
  )
}

export default LavaShaderMaterial
