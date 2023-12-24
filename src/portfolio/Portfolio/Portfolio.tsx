import React from 'react'
import Layout from '../../common/components/Layout'
import WorkCard from './2workCard'
import GithubStats from './GithubStats'
import { MY_WORK } from './constants'
import { SectionHeader, WorkItems, Wrapper } from './style'

const Portfolio: React.FC = () => (
  <Layout>
    <Wrapper>
      {Object.keys(MY_WORK).map(section => (
        <section key={`${section}-section`}>
          <SectionHeader>{section}:</SectionHeader>
          <WorkItems key={`${section}-work-items`}>
            {MY_WORK[section].map(item => (
              <WorkCard key={item.header} item={item} />
            ))}
            {section === 'Github Contributions' && <GithubStats />}
          </WorkItems>
        </section>
      ))}
    </Wrapper>
  </Layout>
)

export default Portfolio
