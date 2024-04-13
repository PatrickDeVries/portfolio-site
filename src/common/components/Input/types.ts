import { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: 'checkbox' | 'text'
  label?: string
  variant?: 'outline' | 'fill'
}
