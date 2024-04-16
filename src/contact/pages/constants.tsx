import { RepellentShape } from '@/common/components/Layout/Background/types'
import { BsGithub } from 'react-icons/bs'
import { MdEmail, MdLocalPhone, MdMessage } from 'react-icons/md'
import { RiLinkedinBoxFill } from 'react-icons/ri'
import { Social } from './types'

export const SOCIALS: Social[] = [
  {
    site: 'LinkedIn',
    href: 'https://www.linkedin.com/in/pcdevri/',
    icon: <RiLinkedinBoxFill data-repel-particles />,
    text: 'https://www.linkedin.com/in/pcdevri/',
  },
  {
    site: 'GitHub',
    href: 'https://github.com/PatrickDeVries',
    icon: <BsGithub data-repel-particles data-repel-shape={RepellentShape.Circle} />,
    text: 'https://github.com/PatrickDeVries',
  },
  {
    site: 'Email',
    href: 'mailto:pcdevri@gmail.com',
    icon: <MdEmail data-repel-particles />,
    text: 'pcdevri@gmail.com',
  },
  {
    site: 'Text',
    href: 'sms:8178881514',
    icon: <MdMessage data-repel-particles />,
    text: '(817) 888-1514',
  },
  {
    site: 'Phone',
    href: 'tel:8178881514',
    icon: <MdLocalPhone data-repel-particles />,
    text: '(817) 888-1514',
  },
]
