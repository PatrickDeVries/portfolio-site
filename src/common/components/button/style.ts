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
    border: none;
    &:hover {
      text-decoration: underline;
    }
  `,
  outline: css`
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.focus};
    border: 1px solid ${({ theme }) => theme.focus};
  `,
  fill: css`
    background-color: ${({ theme }) => theme.focus};
    color: ${({ theme }) => theme.background};
    border: 1px solid ${({ theme }) => theme.backgroundHighlight};
  `,
}

export const StyledButton = styled.button<{ variant: Variant }>`
  all: unset;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  cursor: pointer;
  border-radius: 0.6em;
  padding: 0.5em 0.75em;

  user-select: none;

  :disabled {
    pointer-events: none;
  }

  ${({ variant }) => VARIANT_STYLE[variant]}
`
