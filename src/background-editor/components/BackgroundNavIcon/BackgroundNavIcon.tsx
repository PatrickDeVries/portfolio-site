import { NavIcon } from '@/common/components/Layout/Header/style'
import React from 'react'
import { GiBurstBlob } from 'react-icons/gi'
import { TbBounceRightFilled } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import backgroundStore from './store'

const BackgroundNavIcon: React.FC = () => {
  const backgroundSnap = useSnapshot(backgroundStore)

  return (
    <NavIcon
      title={`Change background to ${
        backgroundSnap.background === 'particles' ? 'lava lamp' : 'particles'
      } mode`}
      onClick={() => {
        if (backgroundSnap.background === 'particles') {
          backgroundStore.background = 'lava-lamp'
        } else {
          backgroundStore.background = 'particles'
        }
      }}
    >
      {backgroundSnap.background === 'particles' ? (
        <GiBurstBlob size="1.5rem" />
      ) : (
        <TbBounceRightFilled size="1.5rem" />
      )}
    </NavIcon>
  )
}

export default BackgroundNavIcon
