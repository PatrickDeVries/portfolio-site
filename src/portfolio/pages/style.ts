import { TABLET } from '@/common/theme/media-queries'
import styled from 'styled-components'

export const Wrapper = styled.div`
  padding: 2rem;

  ${TABLET} {
    padding: 1.5rem;
  }

  display: flex;
  flex-direction: column;
  gap: 2rem;
`

export const SectionHeader = styled.h2`
  width: fit-content;
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
