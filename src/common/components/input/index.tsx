import React from 'react'
import Checkbox from './checkbox'
import Text from './text'
import { InputProps } from './types'

const INPUTS = {
  checkbox: Checkbox,
  text: Text,
}

const Input: React.FC<InputProps> = ({ type, ...props }) =>
  React.createElement(INPUTS[type], {
    type: type,
    ...props,
  })

export default Input
