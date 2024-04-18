import styled from 'styled-components'

export const SelectLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  white-space: nowrap;
`

export const StyledSelect = styled.select`
  outline: none;

  height: 2.5rem;
  padding: 0.5rem 0.75rem 0.5rem 0.25rem;

  background-color: ${({ theme }) => theme.backgroundHighlight};
  border-radius: calc(1rem / 3);
  border: 1px solid ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.text};

  &:hover,
  &:active,
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.focus};
  }
`

export const StyledOption = styled.option`
  background-color: ${({ theme }) => theme.backgroundHighlight};
  color: ${({ theme }) => theme.text};
`
