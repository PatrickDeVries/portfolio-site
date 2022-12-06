import { darken, mix } from 'polished'
import styled, { css } from 'styled-components/macro'
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

export const NavItem = styled.button<{ active?: boolean }>`
  height: 100%;

  padding: 0 0.5rem;

  display: flex;
  align-items: center;

  white-space: nowrap;
  color: ${({ theme, active }) =>
    active ? mix(0.5, theme.backgroundHighlight, theme.text) : theme.text};
  background-color: ${({ theme }) => theme.backgroundHighlight};

  text-decoration: none;

  &:hover,
  &:focus {
    color: ${({ theme }) => mix(0.5, theme.backgroundHighlight, theme.text)};
    text-decoration: underline;
  }
  user-select: none;
  cursor: pointer;
`

export const DropDown = styled.div<{ expanded?: boolean }>`
  width: 100vw;

  display: flex;
  flex-direction: column;
  align-items: center;

  position: fixed;
  top: calc(3rem - 3px);
  right: -100vw;
  transform: translateX(${({ expanded }) => (expanded ? '-100vw' : '0')});
  transition: transform 0.15s ease;

  z-index: 3;

  background-color: ${({ theme }) => theme.backgroundHighlight};
  border: 1px ${({ theme }) => theme.secondary} solid;
  border-bottom: none;

  ${DESKTOP} {
    display: none;
  }
`

export const DropDownItem = styled.button<{ active?: boolean }>`
  width: 100%;
  height: 3rem;

  padding: 0 2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  border-bottom: 1px ${({ theme }) => theme.secondary} solid;

  color: ${({ theme, active }) => (active ? darken(0.25)(theme.text) : theme.text)};
  text-align: center;
  font-size: 1.4rem;

  text-decoration: none;

  &:hover,
  &:focus {
    color: ${({ theme }) => darken(0.25)(theme.text)};
    text-decoration: underline;
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
