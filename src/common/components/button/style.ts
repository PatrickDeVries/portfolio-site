import styled, {
  css,
  DefaultTheme,
  FlattenInterpolation,
  ThemeProps,
} from 'styled-components/macro'
import { Variant } from '../../types/inputs'

const VARIANT_STYLE: Record<Variant, FlattenInterpolation<ThemeProps<DefaultTheme>>> = {
  text: css`
    background-color: transparent;
    color: ${({ theme }) => theme.focus};
    border-color: ${({ theme }) => theme.focus};

    &:disabled {
      color: ${({ theme }) => theme.disabled};
      border-color: ${({ theme }) => theme.disabled};
    }
  `,
  outline: css`
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.focus};
    border-color: ${({ theme }) => theme.focus};
    &:disabled {
      color: ${({ theme }) => theme.disabled};
      border-color: ${({ theme }) => theme.disabled};
    }
  `,
  fill: css`
    background-color: ${({ theme }) => theme.focus};
    color: ${({ theme }) => theme.background};
    border-color: ${({ theme }) => theme.backgroundHighlight};
    &:disabled {
      color: ${({ theme }) => theme.disabled};
      border-color: ${({ theme }) => theme.disabled};
    }
  `,
}

export const Button = styled.button<{ variant?: Variant }>`
  all: unset;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;

  cursor: pointer;
  border-radius: 0.25em;
  padding: 0.5em 0.75em;

  user-select: none;

  border: 1px solid;

  &:hover,
  &:focus {
    text-decoration: underline;
  }

  &:disabled {
    pointer-events: none;
  }

  ${({ variant = 'fill' }) => VARIANT_STYLE[variant]}
`
