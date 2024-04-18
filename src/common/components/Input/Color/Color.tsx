import React from 'react'
import { useTheme } from 'styled-components'
import { InputProps } from '../Input'
import { TextLabel } from '../style'
import { ColorInput } from './style'

const Color: React.FC<InputProps> = ({ $variant = 'outline', color, ...props }) => {
  const theme = useTheme()
  color ??= $variant === 'outline' ? theme.secondary : theme.background

  return (
    <TextLabel>
      {props.label ?? ''}
      <ColorInput $variant={$variant} color={color} {...props} />
    </TextLabel>
  )
}

export default Color
