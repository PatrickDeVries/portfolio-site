import React from 'react'
import { useTheme } from 'styled-components'
import { Wrapper } from './style'

const colorArg = (color: string) => color.replace('#', '')

const GithubStats: React.FC = () => {
  const theme = useTheme()

  return (
    <Wrapper
      src={`https://github-readme-stats.vercel.app/api?username=patrickdevries&count_private=true&show_icons=true&title_color=${colorArg(
        theme.secondary,
      )}&text_color=${colorArg(theme.text)}&icon_color=${colorArg(
        theme.secondary,
      )}&bg_color=${colorArg(theme.backgroundHighlight)}&hide_border=true&hide=issues`}
      alt="GitHub user stats for patrickdevries"
    />
  )
}

export default GithubStats
