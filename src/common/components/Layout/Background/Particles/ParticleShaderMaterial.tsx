import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import * as three from 'three'
import { ShaderMaterial } from 'three'
import { Scale } from '../types'
import particleSettings from './settings-store'
import { derivedParticleSettings } from './settings-store/derived'

export const vertex = `
  uniform float bboxMin;
  uniform float bboxMax;
  uniform float pointSize;
  varying float rightness;

  void main() {
      rightness = (position.x - bboxMin) / (bboxMax - bboxMin);
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
      gl_PointSize = pointSize;   
    }
    `

export const fragment = `
    uniform vec3 colorA; 
    uniform vec3 colorB; 
    varying float rightness;

    void main() {
      float distance = length(2.0 * gl_PointCoord - 1.0);
      if (distance > 1.0) {
          discard;
      }
      gl_FragColor = vec4(mix(colorA, colorB, rightness), 1.0);
    }
  `

export const ParticleShaderMaterial: React.FC<{ viewportScale: Scale }> = ({ viewportScale }) => {
  const ref = useRef<ShaderMaterial | null>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.uniforms.colorA.value = new three.Color(particleSettings.colorA)
      ref.current.uniforms.colorB.value = new three.Color(particleSettings.colorB)
      ref.current.uniforms.pointSize.value = derivedParticleSettings.scaledParticleVisibleRadius
    }
  })

  return (
    <shaderMaterial
      ref={ref}
      attach="material"
      uniforms={{
        colorA: { value: new three.Color(particleSettings.colorA) },
        colorB: { value: new three.Color(particleSettings.colorB) },
        pointSize: { value: derivedParticleSettings.scaledParticleVisibleRadius },
        bboxMin: { value: viewportScale.xMin },
        bboxMax: { value: viewportScale.xMax },
      }}
      vertexShader={vertex}
      fragmentShader={fragment}
    />
  )
}
