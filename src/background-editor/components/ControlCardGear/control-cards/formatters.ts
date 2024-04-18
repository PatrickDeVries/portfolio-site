import { RepellentShape } from '@/common/components/Layout/Background'
import { titleize } from '@/common/formatters'

export const formatMouseShape = (shape: RepellentShape) =>
  shape === RepellentShape.Rectangle ? 'Square' : titleize(shape.toLocaleLowerCase()) ?? ''
