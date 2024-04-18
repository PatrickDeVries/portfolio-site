import React, { InputHTMLAttributes } from 'react'
import Checkbox from './Checkbox'
import Color from './Color'
import Text from './Text'

const INPUTS = {
  checkbox: Checkbox,
  text: Text,
  number: Text,
  color: Color,
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: keyof typeof INPUTS
  label?: string
  variant?: 'outline' | 'fill'
}

const Input: React.FC<InputProps> = ({ type = 'text', ...props }) =>
  React.createElement(INPUTS[type], {
    type: type,
    ...props,
  })

export default Input
