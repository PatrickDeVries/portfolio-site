import 'styled-components'

export interface Theme {
  name: string
  text: string
  primary: string
  secondary: string
  danger: string
  background: string
  backgroundHighlight: string
  strongHighlight: string
  empty: string
  focus: string
  disabled: string
  hot: string
  cold: string
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
