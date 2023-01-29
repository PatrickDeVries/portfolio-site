import styled from 'styled-components'
import { MOBILE } from '../../../theme/mediaQueries'

export const Wrapper = styled.img`
  width: calc(50% - 1rem);
  height: 25rem;

  border: 1px solid ${({ theme }) => theme.secondary};
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.backgroundHighlight};

  ${MOBILE} {
    width: 100%;
  }
`
