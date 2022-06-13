import styled from 'styled-components/macro'
import { MOBILE } from '../../../../theme/mediaQueries'

export const Wrapper = styled.div`
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  ${MOBILE} {
    flex-direction: column;
    align-items: center;
  }
  gap: 2rem;
  padding: 1rem 3rem;
  ${MOBILE} {
    padding: 1rem;
  }
  margin: 0 auto;
  color: ${({ theme }) => theme.text};
`

export const LeftSection = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 2rem;

  > button {
    align-self: flex-start;
  }
`

export const RightSection = styled.div`
  flex: 1;
  width: 100%;
`

export const Header = styled.header`
  display: flex;
  gap: 1rem;
  align-items: center;

  font-size: 1.2rem;
`
