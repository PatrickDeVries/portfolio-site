import styled from 'styled-components'

export const ControlCard = styled.div<{ $areControlsOpen?: boolean }>`
  background-color: ${({ theme }) => theme.backgroundHighlight}77;
  z-index: 1;
  border-radius: 0.5rem;
  padding: ${({ $areControlsOpen }) => ($areControlsOpen ? '1rem' : '0')};
  overflow-y: ${({ $areControlsOpen }) => ($areControlsOpen ? 'auto' : 'hidden')};

  flex: ${({ $areControlsOpen }) => ($areControlsOpen ? '1' : '0')};
  width: 100%;
  transition: all 0.25s ease;

  ${({ $areControlsOpen }) =>
    !$areControlsOpen &&
    `
    pointer-events: none;
    pointer: unset;
  `};
`
