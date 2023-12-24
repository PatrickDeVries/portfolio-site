import React from 'react'
import Layout from '../common/components/layout'
import ParticleControlCard from '../common/components/particleControlCard'
import particleSettings from '../common/components/particleControlCard/store'
import { GearIndicator, Instructions, Wrapper } from './style'

const Particles: React.FC = () => {
  return (
    <Layout>
      <ParticleControlCard />
      <Wrapper $isFirstHit={particleSettings.firstHit}>
        <GearIndicator>^</GearIndicator>
        <Instructions>Click the gear to open the particle settings </Instructions>
      </Wrapper>
    </Layout>
  )
}

export default Particles
