import styled from 'styled-components'

export const Wrapper = styled.div`
  padding: 3rem;
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ContactText = styled.div`
  font-size: 2rem;
`

export const SocialLinks = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`

export const SocialLink = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;

  text-decoration: none;

  color: ${({ theme }) => theme.text};

  &:hover {
    text-decoration: underline;
  }
`
