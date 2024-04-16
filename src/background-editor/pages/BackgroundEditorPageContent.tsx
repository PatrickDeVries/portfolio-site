import React from 'react'
import { useSnapshot } from 'valtio'
import ParticleControlCard from '../components/ParticleControlCard'
import particleSettings from '../components/ParticleControlCard/store'
import { GearIndicator, Instructions, Wrapper } from './style'

const BackgroundEditorPageContent: React.FC = () => {
  const snap = useSnapshot(particleSettings)

  return (
    <>
      <ParticleControlCard />
      <Wrapper $isFirstHit={snap.firstHit}>
        <GearIndicator>^</GearIndicator>
        <Instructions>Click the gear to open the particle settings </Instructions>
      </Wrapper>
    </>
  )
}

export default BackgroundEditorPageContent
