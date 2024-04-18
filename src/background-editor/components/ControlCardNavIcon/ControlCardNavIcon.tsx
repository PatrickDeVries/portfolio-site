import backgroundStore from '@/background-editor/components/BackgroundNavIcon/store'
import lavaLampSettings from '@/common/components/Layout/Background/LavaLamp/settings-store'
import particleSettings from '@/common/components/Layout/Background/Particles/settings-store'
import { NavIcon } from '@/common/components/Layout/Header/style'
import { useWindowListener } from '@yobgob/too-many-hooks'
import React, { useRef } from 'react'
import { HiOutlineCog } from 'react-icons/hi'
import { useSnapshot } from 'valtio'
import { LavaLampControlCard, ParticleControlCard } from '../control-cards'

const ControlCardNavIcon: React.FC = () => {
  const gearRef = useRef<HTMLButtonElement>(null)
  const backgroundSnap = useSnapshot(backgroundStore)

  useWindowListener('keyup', event => {
    if (event.key === 'Escape' && gearRef.current) {
      gearRef.current.click()
    }
  })

  return (
    <>
      <NavIcon
        title="Edit background settings"
        onClick={() => {
          if (backgroundSnap.background === 'lava-lamp') {
            lavaLampSettings.areControlsOpen = !lavaLampSettings.areControlsOpen
            lavaLampSettings.isFirstHit = false
          } else {
            particleSettings.areControlsOpen = !particleSettings.areControlsOpen
            particleSettings.isFirstHit = false
          }
        }}
        ref={gearRef}
      >
        <HiOutlineCog size="1.5rem" />
      </NavIcon>
      {backgroundSnap.background === 'lava-lamp' ? (
        <LavaLampControlCard />
      ) : (
        <ParticleControlCard />
      )}
    </>
  )
}

export default ControlCardNavIcon
