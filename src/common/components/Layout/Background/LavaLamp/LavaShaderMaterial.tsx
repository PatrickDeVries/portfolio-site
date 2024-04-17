import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, ShaderMaterial, UniformsUtils } from 'three'

const VERTEX = `
  attribute float temperature;
  varying float temp;
  
  void main() {
    temp = temperature;
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;    
    gl_PointSize = 10.0;  
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
}> = props => {
  const ref = useRef<ShaderMaterial | null>(null)

  const uniforms = useMemo(
    () =>
      UniformsUtils.merge([
        {
          hotColor: { value: new Color(props.hotColor) },
          coldColor: { value: new Color(props.coldColor) },
        },
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame(() => {
    if (ref.current) {
      ref.current.uniforms.hotColor.value = new Color(props.hotColor)
      ref.current.uniforms.coldColor.value = new Color(props.coldColor)
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
