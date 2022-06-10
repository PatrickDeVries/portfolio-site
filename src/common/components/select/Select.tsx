import React from 'react'
import { StyledSelect, TextLabel } from './style'

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

const Select: React.FC<Props> = ({ label, ...props }) => {
  return (
    <TextLabel>
      {label && label} <StyledSelect {...props} />
    </TextLabel>
  )
}

export default Select
