import ControlCardGear from '@/background-editor/components/ControlCardGear'
import { DARK, LIGHT } from '@/common/theme'
import themeStore from '@/common/theme/store'
import React from 'react'
import { GiBurstBlob } from 'react-icons/gi'
import { MdDarkMode, MdOutlineDarkMode } from 'react-icons/md'
import { TbBounceRightFilled } from 'react-icons/tb'
import { Link, To, useLocation } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import particleSettings from '../Background/Particles/settings-store'
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
  const [isMobileMenuExpanded, setIsMobileMenuExpanded] = React.useState<boolean>(false)

  const particleSettingsSnap = useSnapshot(particleSettings)
  const themeSnap = useSnapshot(themeStore)
  const backgroundSnap = useSnapshot(backgroundStore)

  const navItems: { route: string; label: string; onClick: () => void; to: To }[] = [
    {
      route: '/',
      label: 'Home',
      to: '/',
      onClick: () => setIsMobileMenuExpanded(false),
    },
    {
      route: '/portfolio',
      label: 'Portfolio',
      to: '/portfolio',
      onClick: () => setIsMobileMenuExpanded(false),
    },
    {
      route: '/contact',
      label: 'Contact',
      to: '/contact',
      onClick: () => setIsMobileMenuExpanded(false),
    },
    {
      route: '/background-editor',
      label: 'Background Editor',
      to: '/background-editor',
      onClick: () => setIsMobileMenuExpanded(false),
    },
  ]

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
          {location.pathname === '/background-editor' && <ControlCardGear />}
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
              setIsMobileMenuExpanded(!isMobileMenuExpanded)
            }}
          >
            <Hamburger $isExpanded={isMobileMenuExpanded} $size="1.5rem">
              <HamburgerBar />
              <HamburgerBar />
              <HamburgerBar />
            </Hamburger>
          </NavIcon>
        </IconGroup>
        <Popup $isExpanded={isMobileMenuExpanded}>
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
