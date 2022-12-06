import styled from 'styled-components/macro'
import { MOBILE } from '../../../theme/mediaQueries'

export const Wrapper = styled.img`
  width: calc(50% - 1rem);

  border: 1px solid ${({ theme }) => theme.secondary};
  border-radius: 0.5rem;

  ${MOBILE} {
    width: 100%;
  }
`
