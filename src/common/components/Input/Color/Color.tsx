import React from 'react'
import { InputProps } from '../Input'
import { TextLabel } from '../style'
import { ColorInput } from './style'

const Color: React.FC<InputProps> = ({ $variant = 'outline', ...props }) => (
  <TextLabel>
    {props.label ?? ''}
    <ColorInput $variant={$variant} {...props} />
  </TextLabel>
)

export default Color
