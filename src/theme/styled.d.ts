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
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
