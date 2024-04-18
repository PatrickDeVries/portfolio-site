import React, { HTMLAttributes } from 'react'
import { SelectLabel, StyledOption, StyledSelect } from './style'

interface Props<T extends string | number | readonly string[]>
  extends Omit<HTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  value?: T
  defaultValue?: T
}

const Select = <T extends string>({
  label,
  options,
  onChange,
  ...selectProps
}: Props<T>): ReturnType<React.FC<Props<T>>> => (
  <SelectLabel>
    {label}
    <StyledSelect onChange={e => onChange(e.target.value as T)} {...selectProps}>
      {options.map(({ label, value }) => (
        <StyledOption key={value} value={value}>
          {label}
        </StyledOption>
      ))}
    </StyledSelect>
  </SelectLabel>
)

export default Select
