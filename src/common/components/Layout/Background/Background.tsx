import { Canvas } from '@react-three/fiber'
import React from 'react'
import { useLocation } from 'react-router-dom'
import Particles from './Particles'
import { BgCanvas } from './style'

type Props = {
  top: number
}

const Background: React.FC<Props> = ({ top }) => {
  const location = useLocation()

  return (
    <BgCanvas id="bgCanvas">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Particles top={top} pathname={location.pathname} />
      </Canvas>
    </BgCanvas>
  )
}

export default Background
