import styled from 'styled-components'
import { InputProps } from '../Input'
import { TEXT_FIELD } from '../style'

export const ColorInput = styled.input<InputProps>`
  ${TEXT_FIELD}

  padding: 1px 2px;

  background-color: ${({ theme }) => theme.strongHighlight};
  border: 1px solid ${({ theme }) => theme.secondary};

  cursor: pointer;
`
