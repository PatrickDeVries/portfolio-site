import styled, { css } from 'styled-components'
import { InputProps } from './types'

export const TEXT_FIELD = css<InputProps>`
  appearance: none;
  outline: none;

  padding: 0.5rem 0.75rem;

  background-color: ${({ variant, color, theme }) =>
    variant === 'fill' ? color : theme.backgroundHighlight};
  border-radius: calc(1rem / 3);
  border: ${({ variant }) => (variant === 'outline' ? '1px' : '0')} solid ${({ color }) => color};
  color: ${({ theme }) => theme.text};

  &:focus-within,
  &:active {
    border-color: ${({ theme }) => theme.focus};
  }
`

export const TextLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25em;
`
