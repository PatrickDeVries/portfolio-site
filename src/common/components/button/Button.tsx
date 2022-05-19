import React, { ButtonHTMLAttributes } from 'react'
import { Variant } from '../../types/inputs'
import { StyledButton } from './style'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant
}

const Button: React.FC<Props> = ({ variant = 'fill', type = 'button', ...props }) => {
  return <StyledButton variant={variant} type={type} {...props} />
}

export default Button
