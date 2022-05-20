import { mdiCogOutline, mdiThemeLightDark } from '@mdi/js'
import Icon from '@mdi/react'
import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProxy } from 'valtio/macro'
import { dark, light } from '../../../../theme/themes'
import store from '../../particleControlCard/store'
import {
  BarWrapper,
  DropDown,
  DropDownItem,
  IconGroup,
  Logo,
  MenuIcon,
  MenuIconBar,
  MenuWrapper,
  NavGroup,
  NavIcon,
  NavItem,
  Wrapper,
} from './style'

const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = React.useState<boolean>(false)
  const [selected, setSelected] = React.useState<number>(
    location.pathname === '/'
      ? 0
      : location.pathname === '/portfolio'
      ? 1
      : location.pathname === '/contact'
      ? 2
      : location.pathname === '/particles'
      ? 3
      : 4,
  )
  const gearRef = useRef<HTMLDivElement>(null)

  useProxy(store)

  const navItems: { route: string; label: string; onClick: () => void }[] = [
    {
      route: '/',
      label: 'Home',
      onClick: () => {
        navigate('/')
        setSelected(0)
        setExpanded(false)
      },
    },
    {
      route: '/portfolio',
      label: 'Portfolio',
      onClick: () => {
        navigate('/portfolio')
        setSelected(1)
        setExpanded(false)
      },
    },
    {
      route: '/contact',
      label: 'Contact',
      onClick: () => {
        navigate('/contact')
        setSelected(2)
        setExpanded(false)
      },
    },
    {
      route: '/particles',
      label: 'Particles',
      onClick: () => {
        navigate('/particles')
        setSelected(3)
        setExpanded(false)
      },
    },
  ]

  useEffect(() => {
    if (document) {
      document.onkeyup = event => {
        if (event.key === 'Escape') {
          if (gearRef.current) {
            gearRef.current.click()
          }
        } else if (event.key === '=') {
          store.mouseSize = store.mouseSize + 0.5 < 5 ? store.mouseSize + 0.5 : 5
        } else if (event.key === '-') {
          store.mouseSize = store.mouseSize - 0.5 > 0 ? store.mouseSize - 0.5 : 0
        }
      }
    }
  }, [store.mouseSize])

  return (
    <>
      <Wrapper>
        <Logo>Patrick DeVries</Logo>
        <NavGroup>
          {navItems.map(item => (
            <NavItem
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
                store.controlsOpen = !store.controlsOpen
                store.firstHit = false
                setExpanded(false)
              }}
              ref={gearRef}
            >
              <Icon path={mdiCogOutline} size="1.5rem" />
            </NavIcon>
          )}
          <NavIcon
            title={`Change to ${store.theme === 'light' ? 'dark' : 'light'} mode`}
            onClick={() => {
              if (store.theme === 'light') {
                store.theme = 'dark'
                if (store.colorA === light.primary && store.colorB === light.secondary) {
                  store.colorA = dark.primary
                  store.colorB = dark.secondary
                }
              } else {
                store.theme = 'light'
                if (store.colorA === dark.primary && store.colorB === dark.secondary) {
                  store.colorA = light.primary
                  store.colorB = light.secondary
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
            <MenuWrapper>
              <MenuIcon expanded={expanded} size="1.5rem">
                <BarWrapper>
                  <MenuIconBar />
                </BarWrapper>
                <BarWrapper>
                  <MenuIconBar />
                </BarWrapper>
                <BarWrapper>
                  <MenuIconBar />
                </BarWrapper>
              </MenuIcon>
            </MenuWrapper>
          </NavIcon>
        </IconGroup>
      </Wrapper>
      <DropDown expanded={expanded}>
        {navItems.map((item, index) => (
          <DropDownItem key={item.label} onClick={item.onClick} active={selected === index}>
            {item.label}
          </DropDownItem>
        ))}
      </DropDown>
    </>
  )
}

export default Header
