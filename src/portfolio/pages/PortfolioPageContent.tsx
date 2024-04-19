import React from 'react'
import GithubStats from './GithubStats'
import WorkCard from './WorkCard'
import { MY_WORK } from './constants'
import { formatWorkCategory } from './formatters'
import { SectionHeader, WorkItems, Wrapper } from './style'
import { WorkCategory } from './types'

const PortfolioPageContent: React.FC = () => (
  <Wrapper>
    {Object.keys(MY_WORK).map(section => {
      const typedSection = section as WorkCategory

      return (
        <section key={`${typedSection}-section`}>
          <SectionHeader data-repel-particles>{formatWorkCategory(typedSection)}:</SectionHeader>
          <WorkItems>
            {MY_WORK[typedSection].map(item => (
              <WorkCard key={item.header} item={item} />
            ))}
            {typedSection === WorkCategory.GithubContributions && <GithubStats />}
          </WorkItems>
        </section>
      )
    })}
  </Wrapper>
)

export default PortfolioPageContent
