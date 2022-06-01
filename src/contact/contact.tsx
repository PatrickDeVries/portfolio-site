import { mdiEmail, mdiGithub, mdiLinkedin, mdiMessage, mdiPhone } from '@mdi/js'
import Icon from '@mdi/react'
import React from 'react'
import { useTheme } from 'styled-components/macro'
import Layout from '../common/components/layout'
import { ContactText, SocialLink, SocialLinks, Wrapper } from './style'

interface Social {
  site: string
  href: string
  src: string
  text: string
}

const socials: Social[] = [
  {
    site: 'LinkedIn',
    href: 'https://www.linkedin.com/in/pcdevri/',
    src: mdiLinkedin,
    text: 'https://www.linkedin.com/in/pcdevri/',
  },
  {
    site: 'GitHub',
    href: 'https://github.com/PatrickDeVries',
    src: mdiGithub,
    text: 'https://github.com/PatrickDeVries',
  },
  { site: 'Email', href: 'mailto:pcdevri@gmail.com', src: mdiEmail, text: 'pcdevri@gmail.com' },
  { site: 'Text', href: 'sms:8178881514', src: mdiMessage, text: '(817) 888-1514' },
  { site: 'Phone', href: 'tel:8178881514', src: mdiPhone, text: '(817) 888-1514' },
]

const Contact: React.FC = () => {
  const theme = useTheme()
  return (
    <Layout>
      <Wrapper>
        <ContactText>Contact me:</ContactText>
        <SocialLinks>
          {socials.map(social => (
            <SocialLink key={social.site}>
              <a href={social.href}>
                <Icon path={social.src} size="10rem" color={theme.secondary} />
              </a>
              <div>{social.text}</div>
            </SocialLink>
          ))}
        </SocialLinks>
      </Wrapper>
    </Layout>
  )
}

export default Contact
