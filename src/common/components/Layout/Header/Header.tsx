import BackgroundNavIcon from '@/background-editor/components/BackgroundNavIcon/BackgroundNavIcon'
import ControlCardNavIcon from '@/background-editor/components/ControlCardNavIcon'
import ThemeNavIcon from '@/common/theme/components/ThemeNavIcon'
import { useFlag } from '@yobgob/too-many-hooks'
import React from 'react'
import { Link, To, useLocation } from 'react-router-dom'
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
  const [isMobileMenuExpanded, { unflag: collapseMobileMenu, toggle: toggleIsMobileMenuExpanded }] =
    useFlag(false)

  const navItems: { route: string; label: string; onClick: () => void; to: To }[] = [
    {
      route: '/',
      label: 'Home',
      to: '/',
      onClick: collapseMobileMenu,
    },
    {
      route: '/portfolio',
      label: 'Portfolio',
      to: '/portfolio',
      onClick: collapseMobileMenu,
    },
    {
      route: '/contact',
      label: 'Contact',
      to: '/contact',
      onClick: collapseMobileMenu,
    },
    {
      route: '/background-editor',
      label: 'Background Editor',
      to: '/background-editor',
      onClick: collapseMobileMenu,
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
          {location.pathname === '/background-editor' && <ControlCardNavIcon />}
          <BackgroundNavIcon />
          <ThemeNavIcon />

          <NavIcon title="Open navigation" $isMobileOnly onClick={toggleIsMobileMenuExpanded}>
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
