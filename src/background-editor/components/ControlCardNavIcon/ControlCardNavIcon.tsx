import backgroundStore from '@/background-editor/components/BackgroundNavIcon/store'
import { NavIcon } from '@/common/components/Layout/Header/style'
import { Body } from '@/common/components/Layout/style'
import { useWindowListener } from '@yobgob/too-many-hooks'
import React, { useRef } from 'react'
import { HiOutlineCog } from 'react-icons/hi'
import { useSnapshot } from 'valtio'
import { ControlCard, LavaLampControlCard, ParticleControlCard } from '../control-cards'
import controlCardStore from './store'

const ControlCardNavIcon: React.FC = () => {
  const { areControlsOpen } = useSnapshot(controlCardStore)
  const backgroundSnap = useSnapshot(backgroundStore)
  const gearRef = useRef<HTMLButtonElement>(null)
  const fieldsetRef = useRef<HTMLFieldSetElement>(null)

  useWindowListener('keyup', event => {
    if (event.key === 'Escape' && gearRef.current) {
      controlCardStore.areControlsOpen = !controlCardStore.areControlsOpen
    }
  })

  useWindowListener('click', event => {
    const target = event.target as Node

    if (
      !fieldsetRef.current?.contains(target) &&
      document.querySelector(Body.toString())?.contains(target)
    ) {
      controlCardStore.areControlsOpen = false
    }
  })

  return (
    <>
      <NavIcon
        title="Edit background settings"
        onClick={() => {
          controlCardStore.areControlsOpen = !controlCardStore.areControlsOpen
        }}
        ref={gearRef}
      >
        <HiOutlineCog size="1.5rem" />
      </NavIcon>
      <ControlCard ref={fieldsetRef} $areControlsOpen={areControlsOpen}>
        {backgroundSnap.background === 'lava-lamp' ? (
          <LavaLampControlCard />
        ) : (
          <ParticleControlCard />
        )}
      </ControlCard>
    </>
  )
}

export default ControlCardNavIcon
