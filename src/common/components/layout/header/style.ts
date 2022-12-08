import { mix } from 'polished'
import styled, { css } from 'styled-components'
import { DESKTOP, MOBILE } from '../../../../theme/mediaQueries'

export const Wrapper = styled.nav`
  position: relative;

  display: flex;
  align-items: center;

  font-size: 1.4rem;

  width: 100%;
  z-index: 2;

  background-color: ${({ theme }) => theme.backgroundHighlight};
  border-bottom: 1px ${({ theme }) => theme.secondary} solid;
`

export const Logo = styled.div`
  padding: 0.5rem 2rem;

  outline: none;

  white-space: nowrap;
  color: ${({ theme }) => theme.secondary};
  font-weight: 600;
  user-select: none;

  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`

export const NavGroup = styled.div`
  display: flex;
  align-items: center;

  height: 100%;

  ${MOBILE} {
    display: none;
  }
`

export const NavItem = styled.button<{ $active?: boolean }>`
  outline: none;

  height: 100%;

  padding: 0.5rem 1.5rem;

  display: flex;
  align-items: center;

  white-space: nowrap;
  color: ${({ theme, $active }) => ($active ? theme.background : theme.text)};
  background-color: ${({ theme, $active }) =>
    $active ? theme.secondary : theme.backgroundHighlight};

  text-decoration: none;

  &:hover,
  &:focus {
    color: ${({ theme, $active }) =>
      $active ? theme.background : mix(0.5, theme.secondary, theme.text)};
    text-decoration: underline;
  }
  user-select: none;
  cursor: pointer;
`

export const PopupItem = styled(NavItem)`
  width: 100%;

  justify-content: center;
`

export const Popup = styled.div<{ expanded?: boolean }>`
  width: 100vw;

  display: flex;
  flex-direction: column;
  align-items: center;

  position: absolute;
  top: 100%;
  right: -100vw;
  transform: translateX(${({ expanded }) => (expanded ? '-100vw' : '0')});
  transition: transform 0.15s ease;

  z-index: 3;

  background-color: ${({ theme }) => theme.backgroundHighlight};
  border: 1px ${({ theme }) => theme.secondary} solid;

  ${PopupItem}:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.secondary};
  }

  ${DESKTOP} {
    display: none;
  }
`

export const IconGroup = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`

export const NavIcon = styled.button<{ mobileOnly?: boolean }>`
  appearance: none;
  outline: none;
  border: none;
  background-color: transparent;

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

export const HamburgerBar = styled.div`
  position: absolute;

  width: 100%;
  height: 3px;

  border-radius: 2px;
  background-color: ${({ theme }) => theme.secondary};

  transition: all 0.15s ease 0.15s;
`

export const Hamburger = styled.div<{ expanded?: boolean; size?: string }>`
  position: relative;

  height: ${({ size }) => size};
  width: ${({ size }) => size};

  ${HamburgerBar}:nth-child(1) {
    ${({ expanded }) =>
      expanded
        ? css`
            top: 50%;
            transform: translateY(-50%) rotateZ(45deg);
          `
        : css`
            top: 10%;
            transform: translateY(0) rotateZ(0deg);
          `}
  }

  ${HamburgerBar}:nth-child(2) {
    top: 50%;
    ${({ expanded }) =>
      expanded
        ? css`
            transform: translateY(-50%) rotateZ(135deg);
          `
        : css`
            transform: translateY(-50%) rotateZ(0deg);
          `}
  }

  ${HamburgerBar}:nth-child(3) {
    ${({ expanded }) =>
      expanded
        ? css`
            bottom: 50%;
            transform: translateY(50%) rotateZ(-45deg);
          `
        : css`
            bottom: 10%;
            transform: rotateZ(0deg) translateY(0);
          `}
  }

  &:hover {
    ${HamburgerBar} {
      background-color: ${({ theme }) => mix(0.5, theme.backgroundHighlight, theme.secondary)};
    }
  }
`
