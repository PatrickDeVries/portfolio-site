import React from 'react'
import Layout from '../../common/components/layout'
import { myWork } from './constants'
import GithubStats from './githubStats'
import { SectionHeader, WorkItems, Wrapper } from './style'
import WorkCard from './workCard'

const Portfolio: React.FC = () => (
  <Layout>
    <Wrapper>
      {Object.keys(myWork).map(section => (
        <section key={`${section}-section`}>
          <SectionHeader>{section}:</SectionHeader>
          <WorkItems key={`${section}-work-items`}>
            {myWork[section].map(item => (
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
