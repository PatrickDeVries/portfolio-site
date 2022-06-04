import styled, { css } from 'styled-components/macro'
import { OUTLINE_WIDTH } from '../style'

export const ToggleLabel = styled.label<{ disabled?: boolean }>`
  display: flex;
  gap: 1em;
  align-items: center;
  user-select: none;
  ${({ disabled }) =>
    !disabled &&
    css`
      cursor: pointer;
    `}

  input {
    cursor: inherit;
  }
`

const CHECK_POSITION = css`
  position: absolute;
  bottom: 10%;
  left: 30%;
  transform-origin: top left;
`

const CHECK_ANGLE = 220

export const CheckboxInput = styled.input`
  appearance: none;
  background-color: white;
  margin: 0;
  position: relative;

  box-sizing: border-box;

  font: inherit;
  width: 1em;
  aspect-ratio: 1;
  border: ${OUTLINE_WIDTH} solid ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.backgroundHighlight};

  &::before {
    content: '';
    ${CHECK_POSITION}
    width: 0.2em;
    height: ${OUTLINE_WIDTH};
    transform: scale(0) rotateZ(${CHECK_ANGLE}deg);
    background-color: ${({ theme }) => theme.secondary};
  }

  &::after {
    content: '';
    ${CHECK_POSITION}
    width: 0.65em;
    height: ${OUTLINE_WIDTH};
    transform: scale(0) rotateZ(${CHECK_ANGLE + 90}deg);
    background-color: ${({ theme }) => theme.secondary};
  }

  &:checked {
    &::before {
      transform: scale(1) rotateZ(${CHECK_ANGLE}deg);
    }
    &::after {
      transform: scale(1) rotateZ(${CHECK_ANGLE + 90}deg);
    }
    border-color: ${({ theme }) => theme.secondary};
  }
`
