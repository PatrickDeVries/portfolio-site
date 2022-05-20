import { darken, mix } from 'polished'
import styled from 'styled-components/macro'
import { DESKTOP, MOBILE } from '../../../../theme/mediaQueries'

export const Wrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: 3rem;

  font-size: 1.4rem;

  height: 3rem;
  width: 100%;
  z-index: 2;
  padding: 0 1rem;

  background-color: ${({ theme }) => theme.backgroundHighlight};
  border-bottom: 1px ${({ theme }) => theme.secondary} solid;
`

export const Logo = styled.div`
  white-space: nowrap;
  color: ${({ theme }) => theme.secondary};
  font-weight: 600;
  user-select: none;
`

export const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  height: 100%;

  ${MOBILE} {
    display: none;
  }
`

export const NavItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;

  height: 100%;
  padding: 0 0.5rem;

  white-space: nowrap;
  color: ${({ theme, active }) =>
    active ? mix(0.5, theme.backgroundHighlight, theme.text) : theme.text};
  background-color: ${({ theme }) => theme.backgroundHighlight};

  &:hover {
    color: ${({ theme }) => mix(0.5, theme.backgroundHighlight, theme.text)};
  }
  user-select: none;
  cursor: pointer;
`

export const DropDown = styled.div<{ expanded?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  position: fixed;
  top: calc(3rem - 3px);
  right: -100vw;
  transform: translateX(${({ expanded }) => (expanded ? '-100vw' : '0')});
  transition: transform 0.15s ease;

  width: 100vw;
  z-index: 3;

  background-color: ${({ theme }) => theme.backgroundHighlight};
  border: 1px ${({ theme }) => theme.secondary} solid;
  border-bottom: none;

  ${DESKTOP} {
    display: none;
  }
`

export const DropDownItem = styled.div<{ active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  padding: 0 2rem;
  height: 3rem;
  border-bottom: 1px ${({ theme }) => theme.secondary} solid;

  color: ${({ theme, active }) => (active ? darken(0.25)(theme.text) : theme.text)};
  text-align: center;
  font-size: 1.4rem;

  &:hover {
    color: ${({ theme }) => darken(0.25)(theme.text)};
  }
  user-select: none;
  cursor: pointer;
`

export const IconGroup = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`

export const NavIcon = styled.div<{ mobileOnly?: boolean }>`
  display: flex;
  align-items: center;

  height: 100%;
  padding: 0 0.5rem;

  color: ${({ theme }) => theme.secondary};
  * {
    transition: color 0.05s ease;
  }

  &:hover {
    color: ${({ theme }) => mix(0.5, theme.backgroundHighlight, theme.secondary)};
  }
  user-select: none;
  cursor: pointer;

  ${DESKTOP} {
    ${({ mobileOnly }) => mobileOnly && 'display: none;'};
  }
`

export const MenuWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const MenuIcon = styled.div<{ expanded?: boolean; size?: string }>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  div:first-child {
    top: 0;
    transform-origin: top;
    transform: translateY(${({ expanded }) => (expanded ? '0' : '-30%')});
    div {
      transform-origin: center;

      transform: rotateZ(${({ expanded }) => (expanded ? '45deg' : '0deg')});
    }
  }
  div:nth-child(2) {
    top: 0;
    transform-origin: center;
    transform: rotateZ(${({ expanded }) => (expanded ? '45deg' : '0deg')});
  }
  div:nth-child(3) {
    top: 0;
    transform-origin: top;

    transform: translateY(${({ expanded }) => (expanded ? '0' : '25%')});
    div {
      transform-origin: center;
      transform: rotateZ(${({ expanded }) => (expanded ? '-45deg' : '0deg')});
    }
  }
  div > div {
    background-color: ${({ theme }) => theme.secondary};
  }

  &:hover {
    div > div {
      background-color: ${({ theme }) => mix(0.5, theme.backgroundHighlight, theme.secondary)};
    }
  }
`

export const BarWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  transition: all 0.15s ease;
`

export const MenuIconBar = styled.div`
  position: relative;
  width: 100%;
  height: 3px;
  border-radius: 2px;
  transition: all 0.15s ease 0.15s;
`
