import Layout from '@/common/components/Layout'
import ParticleControlCard from '@/common/components/ParticleControlCard'
import particleSettings from '@/common/components/ParticleControlCard/store'
import React from 'react'
import { useSnapshot } from 'valtio'
import { GearIndicator, Instructions, Wrapper } from './style'

const Particles: React.FC = () => {
  const snap = useSnapshot(particleSettings)

  return (
    <Layout>
      <ParticleControlCard />
      <Wrapper $isFirstHit={snap.firstHit}>
        <GearIndicator>^</GearIndicator>
        <Instructions>Click the gear to open the particle settings </Instructions>
      </Wrapper>
    </Layout>
  )
}

export default Particles
