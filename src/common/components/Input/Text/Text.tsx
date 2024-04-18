import React from 'react'
import { InputProps } from '../Input'
import { TextLabel } from '../style'
import { TextInput } from './style'

const Text: React.FC<InputProps> = ({ $variant = 'outline', ...props }) => (
  <TextLabel>
    {props.label ?? ''}
    <TextInput $variant={$variant} {...props} />
  </TextLabel>
)

export default Text
