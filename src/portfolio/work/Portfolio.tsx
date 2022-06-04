import React from 'react'
import { useTheme } from 'styled-components/macro'
import Layout from '../../common/components/layout'
import { myWork } from './constants'
import { ReadmeStats, SectionHeader, WorkItems, Wrapper } from './style'
import WorkCard from './workCard'

const colorArg = (color: string) => color.replace('#', '')

const Portfolio: React.FC = () => {
  const theme = useTheme()

  return (
    <Layout>
      <Wrapper>
        {Object.keys(myWork).map(key => (
          <section key={`${key}-section`}>
            <SectionHeader>{key}:</SectionHeader>
            <WorkItems key={`${key}-work-items`}>
              {myWork[key].map(item => (
                <WorkCard key={item.header} item={item} />
              ))}
              {key === 'Github Contributions' && (
                <ReadmeStats
                  src={`https://github-readme-stats.vercel.app/api?username=patrickdevries&count_private=true&show_icons=true&title_color=${colorArg(
                    theme.primary,
                  )}&text_color=${colorArg(theme.text)}&icon_color=${colorArg(
                    theme.secondary,
                  )}&bg_color=${colorArg(theme.backgroundHighlight)}&hide_border=true&hide=issues`}
                  alt="GitHub user stats for patrickdevries"
                />
              )}
            </WorkItems>
          </section>
        ))}
      </Wrapper>
    </Layout>
  )
}

export default Portfolio
