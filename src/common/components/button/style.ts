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
    &:hover {
      text-decoration: underline;
    }
  `,
  outline: css`
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.focus};
    border-color: ${({ theme }) => theme.focus};
  `,
  fill: css`
    background-color: ${({ theme }) => theme.focus};
    color: ${({ theme }) => theme.background};
    border-color: ${({ theme }) => theme.backgroundHighlight};
  `,
}

export const StyledButton = styled.button<{ variant: Variant }>`
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

  :disabled {
    pointer-events: none;
  }

  ${({ variant }) => VARIANT_STYLE[variant]}
`
