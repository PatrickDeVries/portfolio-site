import backgroundStore from '@/common/components/Layout/Background/store'
import React from 'react'
import { useSnapshot } from 'valtio'
import {
  LavaLampControlCard,
  ParticleControlCard,
  lavaLampSettings,
  particleSettings,
} from '../components/control-cards'
import { GearIndicator, Instructions, Wrapper } from './style'

const BackgroundEditorPageContent: React.FC = () => {
  const backgroundSnap = useSnapshot(backgroundStore)
  const particleSnap = useSnapshot(particleSettings)
  const lavaLampSnap = useSnapshot(lavaLampSettings)

  return backgroundSnap.background === 'lava-lamp' ? (
    <>
      <LavaLampControlCard />
      <Wrapper $isFirstHit={lavaLampSnap.isFirstHit}>
        <GearIndicator>^</GearIndicator>
        <Instructions>Click the gear to open the lava lamp settings </Instructions>
      </Wrapper>
    </>
  ) : (
    <>
      <ParticleControlCard />
      <Wrapper $isFirstHit={particleSnap.isFirstHit}>
        <GearIndicator>^</GearIndicator>
        <Instructions>Click the gear to open the particle settings </Instructions>
      </Wrapper>
    </>
  )
}

export default BackgroundEditorPageContent
