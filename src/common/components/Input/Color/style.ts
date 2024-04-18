import styled from 'styled-components'
import { InputProps } from '../Input'
import { TEXT_FIELD } from '../style'

export const ColorInput = styled.input<InputProps>`
  ${TEXT_FIELD}

  min-width: 8rem;
  padding: 1px 2px;

  cursor: pointer;
`
