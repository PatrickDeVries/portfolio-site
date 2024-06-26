import { Canvas } from '@react-three/fiber'
import React from 'react'
import { useSnapshot } from 'valtio'
import backgroundStore from '../../../../background-editor/components/BackgroundNavIcon/store'
import LavaLamp from './LavaLamp'
import Particles from './Particles'
import { BgCanvas } from './style'

type Props = {
  top: number
}

const Background: React.FC<Props> = ({ top }) => {
  const { background } = useSnapshot(backgroundStore)

  return (
    <BgCanvas id="bgCanvas">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        {background === 'particles' ? <Particles top={top} /> : <LavaLamp top={top} />}
      </Canvas>
    </BgCanvas>
  )
}

export default Background
