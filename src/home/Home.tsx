import { Link } from 'react-router-dom'
import Button from '../common/components/button'
import Layout from '../common/components/layout'
import { GreetingBlock, IntroText } from './style'

const Home: React.FC = () => (
  <Layout>
    <GreetingBlock>
      <IntroText>
        Hello, I&apos;m &nbsp;<b>Patrick DeVries</b>, a full-stack developer
      </IntroText>
      <Button as={Link} to="/portfolio" $variant="text">
        Check out my projects
      </Button>
    </GreetingBlock>
  </Layout>
)

export default Home
