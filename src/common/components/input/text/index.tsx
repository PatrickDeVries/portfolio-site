import React from 'react'
import { useTheme } from 'styled-components/macro'
import { TextLabel } from '../style'
import { InputProps } from '../types'
import { TextInput } from './style'

const Text: React.FC<InputProps> = ({ variant = 'outline', color, ...props }) => {
  const theme = useTheme()
  color ??= variant === 'outline' ? theme.secondary : theme.background

  return (
    <TextLabel>
      {props.label ?? ''}
      <TextInput variant={variant} color={color} {...props} />
    </TextLabel>
  )
}

export default Text
