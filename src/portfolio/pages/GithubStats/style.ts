import { TABLET } from '@/common/theme/media-queries'
import styled from 'styled-components'

export const Wrapper = styled.img`
  width: calc(50% - 1rem);
  height: 25%;

  border: 1px solid ${({ theme }) => theme.secondary};
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.backgroundHighlight};

  ${TABLET} {
    width: 100%;
  }
`
