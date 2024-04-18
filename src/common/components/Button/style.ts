import { Variant } from '@/common/types/inputs'
import styled, { css, Interpolation } from 'styled-components'

const VARIANT_STYLE: Record<Variant, Interpolation<object>> = {
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
    color: ${({ theme }) => theme.text};
    border-color: ${({ theme }) => theme.secondary};

    &:hover,
    &:focus,
    &:active {
      border-color: ${({ theme }) => theme.primary};
    }

    &:focus {
      outline: ${({ theme }) => theme.focus};
    }

    &:disabled {
      color: ${({ theme }) => theme.disabled};
      border-color: ${({ theme }) => theme.disabled};
    }
  `,
  fill: css`
    background-color: ${({ theme }) => theme.secondary};
    color: ${({ theme }) => theme.background};
    border-color: ${({ theme }) => theme.secondary};

    &:hover,
    &:focus,
    &:active {
      border-color: ${({ theme }) => theme.background};
    }

    &:focus {
      outline-color: ${({ theme }) => theme.focus};
    }

    &:disabled {
      color: ${({ theme }) => theme.disabled};
      border-color: ${({ theme }) => theme.disabled};
    }
  `,
}

export const Button = styled.button<{ $variant?: Variant }>`
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
  &:focus,
  &:active {
    text-decoration: underline;
  }

  &:focus {
    outline-width: 2px;
    outline-style: solid;
  }

  &:disabled {
    pointer-events: none;
  }

  ${({ $variant = 'outline' }) => VARIANT_STYLE[$variant]}
`
