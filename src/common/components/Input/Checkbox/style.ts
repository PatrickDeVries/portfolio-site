import styled, { css } from 'styled-components'

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
  margin: 0;
  position: relative;

  box-sizing: border-box;

  font: inherit;
  width: 1rem;
  aspect-ratio: 1;
  border: 1px solid ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.backgroundHighlight};

  &::before {
    content: '';
    ${CHECK_POSITION}
    width: 0.2rem;
    height: 1px;
    transform: scale(0) rotateZ(${CHECK_ANGLE}deg);
    background-color: ${({ theme }) => theme.secondary};
  }

  &::after {
    content: '';
    ${CHECK_POSITION}
    width: 0.65rem;
    height: 1px;
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
