import styled, { css } from 'styled-components/macro'
import { InputProps } from './types'

export const OUTLINE_WIDTH = `0.1em`

export const TEXT_FIELD = css<InputProps>`
  appearance: none;
  padding: 0.5em 0.75em;
  font: inherit;
  box-sizing: border-box;

  background-color: ${({ variant, color, theme }) =>
    variant === 'fill' ? color : theme.backgroundHighlight};
  border-radius: calc(1em / 3);
  border: ${({ variant }) => (variant === 'outline' ? OUTLINE_WIDTH : '0')} solid
    ${({ color }) => color};
  outline: none;

  color: ${({ theme }) => theme.text};

  &:focus-within {
    border-color: ${({ theme }) => theme.focus};
  }
`

export const TextLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  text-indent: calc(${OUTLINE_WIDTH} + 0.75em);
`
