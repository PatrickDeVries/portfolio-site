import React from 'react'
import { InputProps } from '../types'
import { CheckboxInput, ToggleLabel } from './style'

const Checkbox: React.FC<InputProps> = ({ disabled, ...props }) => (
  <ToggleLabel disabled={disabled}>
    <CheckboxInput disabled={disabled} {...props} />
    {props.label ?? ''}
  </ToggleLabel>
)

export default Checkbox
