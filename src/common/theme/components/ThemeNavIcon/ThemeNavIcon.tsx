import particleSettings from '@/common/components/Layout/Background/Particles/settings-store'
import { NavIcon } from '@/common/components/Layout/Header/style'
import React from 'react'
import { MdDarkMode, MdOutlineDarkMode } from 'react-icons/md'
import { useSnapshot } from 'valtio'
import { DARK, LIGHT } from '../../themes'
import themeStore from './store'

const ThemeNavIcon: React.FC = () => {
  const particleSettingsSnap = useSnapshot(particleSettings)
  const themeSnap = useSnapshot(themeStore)

  return (
    <NavIcon
      title={`Change to ${themeSnap.theme === 'light' ? 'dark' : 'light'} mode`}
      onClick={() => {
        if (themeSnap.theme === 'light') {
          themeStore.theme = 'dark'
          if (
            particleSettingsSnap.colorA === LIGHT.primary &&
            particleSettingsSnap.colorB === LIGHT.secondary
          ) {
            particleSettings.colorA = DARK.primary
            particleSettings.colorB = DARK.secondary
          }
        } else {
          themeStore.theme = 'light'
          if (
            particleSettingsSnap.colorA === DARK.primary &&
            particleSettingsSnap.colorB === DARK.secondary
          ) {
            particleSettings.colorA = LIGHT.primary
            particleSettings.colorB = LIGHT.secondary
          }
        }
      }}
    >
      {themeSnap.theme === 'light' ? (
        <MdDarkMode size="1.5rem" />
      ) : (
        <MdOutlineDarkMode size="1.5rem" />
      )}
    </NavIcon>
  )
}

export default ThemeNavIcon
