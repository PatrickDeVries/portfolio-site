import styled from 'styled-components/macro'

export const TextLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  text-indent: 0.85em;
`

export const StyledSelect = styled.select`
  padding: 0.75rem 0.5rem;

  border: 0.1em solid ${({ theme }) => theme.secondary};
  border-radius: 0.25rem;
  outline: none;

  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.background};

  &:focus {
    border-color: ${({ theme }) => theme.focus};
  }
`
