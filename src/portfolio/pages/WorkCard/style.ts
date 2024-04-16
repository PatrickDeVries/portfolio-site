import { DESKTOP, MOBILE } from '@/common/theme/media-queries'
import styled, { css } from 'styled-components'

export const HeaderText = styled.span`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.secondary};
`

export const StyledCard = styled.div<{ $isLink: boolean }>`
  align-self: stretch;

  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  background-color: ${({ theme }) => theme.backgroundHighlight};
  border: 1px solid ${({ theme }) => theme.secondary};
  border-radius: 0.5rem;

  ${DESKTOP} {
    max-width: calc(50% - 1rem);
  }

  > div:first-child {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  text-decoration: none;

  ${({ $isLink, theme }) =>
    $isLink &&
    css`
      ${HeaderText} {
        text-decoration: underline;
      }

      &:hover,
      &:focus {
        ${HeaderText} {
          color: ${theme.primary};
        }
        border: 1px solid ${theme.primary};
        outline: none;
      }
    `}
`

export const BodySection = styled.div`
  display: block;

  padding: 1rem;
  width: 100%;

  font-size: 1.2rem;
`

export const ScalingImg = styled.img`
  display: block;

  float: left;
  padding: 1rem;

  max-height: 20vh;
  max-width: 100%;

  object-fit: contain;
  border-radius: 0.5rem;
`

export const BodyText = styled.p`
  color: ${({ theme }) => theme.text};
  font-size: 1.4rem;

  ${MOBILE} {
    font-size: 1.2rem;
  }
`

export const TagSection = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  align-items: flex-start;
  flex-flow: row wrap-reverse;
  justify-content: flex-start;
  gap: 0.5rem;
`

export const Tag = styled.p`
  padding: 0.5rem;
  margin: 0;

  color: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.secondary};
  border-radius: 0.25rem;
`
