import { titleize } from '@/common/formatters'
import { WorkCategory } from './types'

export const formatWorkCategory = (category: WorkCategory) =>
  titleize(category.toLocaleLowerCase()) ?? ''
