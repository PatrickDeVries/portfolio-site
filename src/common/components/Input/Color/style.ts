import styled from 'styled-components'
import { TEXT_FIELD } from '../style'
import { InputProps } from '../types'

export const ColorInput = styled.input<InputProps>`
  ${TEXT_FIELD}

  padding: 1px 2px;

  background-color: ${({ theme }) => theme.strongHighlight};
  border: 1px solid ${({ theme }) => theme.secondary};

  cursor: pointer;
`
