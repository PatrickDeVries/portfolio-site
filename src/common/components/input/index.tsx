import React from 'react'
import Checkbox from './checkbox'
import Text from './text'
import { InputProps } from './types'

const inputs = {
  checkbox: Checkbox,
  text: Text,
}

const Input: React.FC<InputProps> = ({ type, ...props }) =>
  React.createElement(inputs[type ?? 'text'], {
    type: type,
    ...props,
  })

export default Input
