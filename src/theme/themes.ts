import { Theme } from './styled'

export type ThemeName = 'dark' | 'light'

export const dark: Theme = {
  name: 'dark',
  text: '#FFFFFF',
  primary: '#00FF9D',
  secondary: '#03FFFF',
  danger: '#EC4678',
  background: '#031016',
  backgroundHighlight: '#0B232E',
  strongHighlight: '#113547',
  empty: '#FFFFFF',
  focus: '#00FF00',
}

export const light: Theme = {
  name: 'light',
  text: '#000000',
  primary: '#12CE5A',
  secondary: '#3277B3',
  danger: '#EC4678',
  background: '#FFFFFF',
  backgroundHighlight: '#EEEEEE',
  strongHighlight: '#DDDDDD',
  empty: '#EEEEEE',
  focus: '#2C00A3',
}
