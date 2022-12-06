import { mdiCogOutline, mdiThemeLightDark } from '@mdi/js'
import Icon from '@mdi/react'
import React, { useRef } from 'react'
import { Link, To, useLocation } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import { dark, light } from '../../../../theme/themes'
import particleSettings from '../../particleControlCard/store'
import {
  Hamburger,
  HamburgerBar,
  IconGroup,
  Logo,
  NavGroup,
  NavIcon,
  NavItem,
  Popup,
  PopupItem,
  Wrapper,
} from './style'

const Header: React.FC = () => {
  const location = useLocation()
  const [expanded, setExpanded] = React.useState<boolean>(false)
  const gearRef = useRef<HTMLDivElement>(null)

  const settingsSnap = useSnapshot(particleSettings)

  const navItems: { route: string; label: string; onClick: () => void; to: To }[] = [
    {
      route: '/',
      label: 'Home',
      to: '/',
      onClick: () => {
        setExpanded(false)
      },
    },
    {
      route: '/portfolio',
      label: 'Portfolio',
      to: '/portfolio',
      onClick: () => {
        setExpanded(false)
      },
    },
    {
      route: '/contact',
      label: 'Contact',
      to: '/contact',
      onClick: () => {
        setExpanded(false)
      },
    },
    {
      route: '/particles',
      label: 'Particles',
      to: '/particles',
      onClick: () => {
        setExpanded(false)
      },
    },
  ]

  document.onkeyup = event => {
    if (event.key === 'Escape') {
      if (gearRef.current) {
        gearRef.current.click()
      }
    } else if (event.key === '=') {
      particleSettings.mouseSize =
        particleSettings.mouseSize + 0.5 < 5 ? particleSettings.mouseSize + 0.5 : 5
    } else if (event.key === '-') {
      particleSettings.mouseSize =
        particleSettings.mouseSize - 0.5 > 0 ? particleSettings.mouseSize - 0.5 : 0
    }
  }

  return (
    <>
      <Wrapper>
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
              active={location.pathname === item.route}
            >
              {item.label}
            </NavItem>
          ))}
        </NavGroup>
        <IconGroup>
          {location.pathname === '/particles' && (
            <NavIcon
              title="Edit background settings"
              onClick={() => {
                particleSettings.controlsOpen = !particleSettings.controlsOpen
                particleSettings.firstHit = false
                setExpanded(false)
              }}
              ref={gearRef}
            >
              <Icon path={mdiCogOutline} size="1.5rem" />
            </NavIcon>
          )}
          <NavIcon
            title={`Change to ${settingsSnap.theme === 'light' ? 'dark' : 'light'} mode`}
            onClick={() => {
              if (settingsSnap.theme === 'light') {
                particleSettings.theme = 'dark'
                if (
                  settingsSnap.colorA === light.primary &&
                  settingsSnap.colorB === light.secondary
                ) {
                  particleSettings.colorA = dark.primary
                  particleSettings.colorB = dark.secondary
                }
              } else {
                particleSettings.theme = 'light'
                if (
                  settingsSnap.colorA === dark.primary &&
                  settingsSnap.colorB === dark.secondary
                ) {
                  particleSettings.colorA = light.primary
                  particleSettings.colorB = light.secondary
                }
              }
            }}
          >
            <Icon path={mdiThemeLightDark} size="1.5rem" />
          </NavIcon>
          <NavIcon
            title="Open navigation"
            mobileOnly
            onClick={() => {
              setExpanded(!expanded)
            }}
          >
            <Hamburger expanded={expanded} size="1.5rem">
              <HamburgerBar />
              <HamburgerBar />
              <HamburgerBar />
            </Hamburger>
          </NavIcon>
        </IconGroup>
        <Popup expanded={expanded}>
          {navItems.map(item => (
            <PopupItem
              key={item.label}
              as={Link}
              to={item.to}
              onClick={item.onClick}
              active={location.pathname === item.route}
            >
              {item.label}
            </PopupItem>
          ))}
        </Popup>
      </Wrapper>
    </>
  )
}

export default Header