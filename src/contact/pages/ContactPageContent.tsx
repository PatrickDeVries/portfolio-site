import React from 'react'
import { SOCIALS } from './constants'
import { ContactText, SocialLink, SocialLinks, Wrapper } from './style'

const ContactPageContent: React.FC = () => (
  <Wrapper>
    <ContactText data-repel-particles>Contact me:</ContactText>
    <SocialLinks>
      {SOCIALS.map(social => (
        <SocialLink key={social.site} as="a" href={social.href}>
          {social.icon}
        </SocialLink>
      ))}
    </SocialLinks>
  </Wrapper>
)

export default ContactPageContent
