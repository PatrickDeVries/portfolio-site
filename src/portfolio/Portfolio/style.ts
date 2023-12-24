import styled from 'styled-components'
import { TABLET } from '../../theme/media-queries'

export const Wrapper = styled.div`
  padding: 2rem;

  ${TABLET} {
    padding: 1rem;
  }

  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const SectionHeader = styled.h2`
  width: 100%;
  padding: 1rem;
  color: ${({ theme }) => theme.primary};

  font-size: 1.4rem;
  text-transform: uppercase;
`

export const WorkItems = styled.div`
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;

  ${TABLET} {
    align-items: center;
    justify-content: center;
  }
`

export const ReadmeStats = styled.img`
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.secondary};
  width: calc(50% - 1rem);

  ${TABLET} {
    width: 100%;
  }
`
