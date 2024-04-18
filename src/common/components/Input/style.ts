import styled, { css } from 'styled-components'
import { InputProps } from './Input'

export const TEXT_FIELD = css<InputProps>`
  appearance: none;
  outline: none;

  height: 2.5rem;
  padding: 0.5rem 0.75rem;

  background-color: ${({ $variant, theme }) =>
    $variant === 'outline' ? theme.backgroundHighlight : theme.background};
  border-radius: calc(1rem / 3);
  border: ${({ $variant }) => ($variant === 'outline' ? '1px' : '0')} solid
    ${({ $variant, theme }) => ($variant === 'outline' ? theme.secondary : theme.background)};
  color: ${({ theme }) => theme.text};

  &:focus-within,
  &:active {
    border-color: ${({ theme }) => theme.focus};
  }
`

export const TextLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  white-space: nowrap;
`
