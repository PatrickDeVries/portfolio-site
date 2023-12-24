import React from 'react'
import { BsGithub } from 'react-icons/bs'
import { MdEmail, MdLocalPhone, MdMessage } from 'react-icons/md'
import { RiLinkedinBoxFill } from 'react-icons/ri'
import { useTheme } from 'styled-components'
import Layout from '../common/components/Layout'
import { ContactText, SocialLink, SocialLinks, Wrapper } from './style'

interface Social {
  site: string
  href: string
  icon: React.ReactNode
  text: string
}

const Contact: React.FC = () => {
  const theme = useTheme()

  const SOCIALS: Social[] = [
    {
      site: 'LinkedIn',
      href: 'https://www.linkedin.com/in/pcdevri/',
      icon: <RiLinkedinBoxFill size="10rem" color={theme.secondary} />,
      text: 'https://www.linkedin.com/in/pcdevri/',
    },
    {
      site: 'GitHub',
      href: 'https://github.com/PatrickDeVries',
      icon: <BsGithub size="10rem" color={theme.secondary} />,
      text: 'https://github.com/PatrickDeVries',
    },
    {
      site: 'Email',
      href: 'mailto:pcdevri@gmail.com',
      icon: <MdEmail size="10rem" color={theme.secondary} />,
      text: 'pcdevri@gmail.com',
    },
    {
      site: 'Text',
      href: 'sms:8178881514',
      icon: <MdMessage size="10rem" color={theme.secondary} />,
      text: '(817) 888-1514',
    },
    {
      site: 'Phone',
      href: 'tel:8178881514',
      icon: <MdLocalPhone size="10rem" color={theme.secondary} />,
      text: '(817) 888-1514',
    },
  ]

  return (
    <Layout>
      <Wrapper>
        <ContactText>Contact me:</ContactText>
        <SocialLinks>
          {SOCIALS.map(social => (
            <SocialLink key={social.site} as={'a'} href={social.href}>
              {social.icon}
              <div>{social.text}</div>
            </SocialLink>
          ))}
        </SocialLinks>
      </Wrapper>
    </Layout>
  )
}

export default Contact
