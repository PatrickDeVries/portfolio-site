import { To } from 'react-router-dom'

export type WorkItem = {
  header: string
  image: string
  description: string
  tags?: string[]
  href?: string
  to?: To
}
