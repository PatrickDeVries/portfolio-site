import { lavaLampSettings, particleSettings } from '@/background-editor/components/control-cards'
import { DARK, LIGHT } from '@/common/theme'
import themeStore from '@/common/theme/store'
import { useWindowListener } from '@yobgob/too-many-hooks'
import React, { useRef } from 'react'
import { GiBurstBlob } from 'react-icons/gi'
import { HiOutlineCog } from 'react-icons/hi'
import { MdDarkMode, MdOutlineDarkMode } from 'react-icons/md'
import { TbBounceRightFilled } from 'react-icons/tb'
import { Link, To, useLocation } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import backgroundStore from '../Background/store'
import {
  Hamburger,
  HamburgerBar,
  IconGroup,
  Logo,
  NavBar,
  NavGroup,
  NavIcon,
  NavItem,
  Popup,
  PopupItem,
} from './style'

const Header: React.FC = () => {
  const location = useLocation()
  const [expanded, setExpanded] = React.useState<boolean>(false)
  const gearRef = useRef<HTMLButtonElement>(null)

  const particleSettingsSnap = useSnapshot(particleSettings)
  const themeSnap = useSnapshot(themeStore)
  const backgroundSnap = useSnapshot(backgroundStore)

  const navItems: { route: string; label: string; onClick: () => void; to: To }[] = [
    {
      route: '/',
      label: 'Home',
      to: '/',
      onClick: () => setExpanded(false),
    },
    {
      route: '/portfolio',
      label: 'Portfolio',
      to: '/portfolio',
      onClick: () => setExpanded(false),
    },
    {
      route: '/contact',
      label: 'Contact',
      to: '/contact',
      onClick: () => setExpanded(false),
    },
    {
      route: '/background-editor',
      label: 'Background Editor',
      to: '/background-editor',
      onClick: () => setExpanded(false),
    },
  ]

  useWindowListener('keyup', event => {
    if (event.key === 'Escape' && gearRef.current) {
      gearRef.current.click()
    }
  })

  return (
    <>
      <NavBar>
        <Logo as={Link} to="/">
          Patrick DeVries
        </Logo>
        <NavGroup>
          {navItems.map(item => (
            <NavItem
              as={Link}
              to={item.to}
              key={item.label}
              onClick={item.onClick}
              $active={location.pathname === item.route}
            >
              {item.label}
            </NavItem>
          ))}
        </NavGroup>
        <IconGroup>
          {location.pathname === '/background-editor' && (
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

                setExpanded(false)
              }}
              ref={gearRef}
            >
              <HiOutlineCog size="1.5rem" />
            </NavIcon>
          )}
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
          <NavIcon
            title="Open navigation"
            $isMobileOnly
            onClick={() => {
              setExpanded(!expanded)
            }}
          >
            <Hamburger $isExpanded={expanded} $size="1.5rem">
              <HamburgerBar />
              <HamburgerBar />
              <HamburgerBar />
            </Hamburger>
          </NavIcon>
        </IconGroup>
        <Popup $isExpanded={expanded}>
          {navItems.map(item => (
            <PopupItem
              key={item.label}
              as={Link}
              to={item.to}
              onClick={item.onClick}
              $active={location.pathname === item.route}
            >
              {item.label}
            </PopupItem>
          ))}
        </Popup>
      </NavBar>
    </>
  )
}

export default Header
