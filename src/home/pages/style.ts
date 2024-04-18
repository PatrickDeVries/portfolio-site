import styled from 'styled-components'

export const PageWrapper = styled.div`
  flex: 1;
  padding: 1rem 2rem;

  display: flex;
  flex-direction: column;
  justify-content: center;

  font-size: 2rem;
`

export const IntroBlock = styled.div`
  padding: 2rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
`

export const IntroText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > span {
    text-align: center;
    font-size: 3rem;
  }
`
