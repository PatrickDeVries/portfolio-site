import { MOBILE } from '@/common/theme'
import styled, { css } from 'styled-components'

export const ControlCardMenu = styled.fieldset<{ $areControlsOpen?: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;

  padding: 1rem;
  width: 30rem;

  display: flex;
  flex-direction: column;
  gap: 2rem;

  ${({ $areControlsOpen }) =>
    !$areControlsOpen &&
    css`
      pointer-events: none;
      pointer: unset;
    `};

  transform: translateX(${({ $areControlsOpen }) => ($areControlsOpen ? '0' : '100%')});
  transition: transform 0.15s ease;

  background-color: ${({ theme }) => theme.backgroundHighlight}77;

  border: 1px solid ${({ theme }) => theme.secondary};
  border-right: none;
  border-bottom-left-radius: calc(1rem / 3);

  ${MOBILE} {
    top: 100vh;
    width: 100%;
    border-left: none;
    border-bottom: none;
    border-radius: 0;

    transform: translateY(${({ $areControlsOpen }) => ($areControlsOpen ? '-100%' : '100%')});
  }
`
