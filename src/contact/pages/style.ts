import { RepellentShape } from '@/common/components/Layout/Background/types'
import styled from 'styled-components'

export const Wrapper = styled.div`
  padding: 3rem;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
`

export const ContactText = styled.div`
  font-size: 2rem;
  padding: 1rem;
`

export const SocialLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`

export const SocialLink = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  color: ${({ theme }) => theme.secondary};

  svg {
    height: 10rem;
    width: 10rem;
  }

  svg[data-repel-shape=${RepellentShape.Circle}] {
    padding: 1rem;
  }

  &:hover,
  &:focus {
    outline: none;
    color: ${({ theme }) => theme.primary};
  }

  &:focus {
    filter: drop-shadow(-1px -1px 0 black) drop-shadow(1px -1px 0 black)
      drop-shadow(1px 1px 0 black) drop-shadow(-1px 1px 0 black);
  }
`
