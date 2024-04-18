import lavaLampSettings from '@/common/components/Layout/Background/LavaLamp/settings-store'
import particleSettings from '@/common/components/Layout/Background/Particles/settings-store'
import backgroundStore from '@/common/components/Layout/Background/store'
import React from 'react'
import { useSnapshot } from 'valtio'
import { GearIndicator, Instructions, Wrapper } from './style'

const BackgroundEditorPageContent: React.FC = () => {
  const backgroundSnap = useSnapshot(backgroundStore)
  const particleSnap = useSnapshot(particleSettings)
  const lavaLampSnap = useSnapshot(lavaLampSettings)

  return backgroundSnap.background === 'lava-lamp' ? (
    <>
      <Wrapper $isFirstHit={lavaLampSnap.isFirstHit}>
        <GearIndicator>^</GearIndicator>
        <Instructions>Click the gear to open the lava lamp settings</Instructions>
      </Wrapper>
    </>
  ) : (
    <>
      <Wrapper $isFirstHit={particleSnap.isFirstHit}>
        <GearIndicator>^</GearIndicator>
        <Instructions>Click the gear to open the particle settings</Instructions>
      </Wrapper>
    </>
  )
}

export default BackgroundEditorPageContent
