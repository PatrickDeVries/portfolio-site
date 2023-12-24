import Button from '@/common/components/Button'
import { Link } from 'react-router-dom'
import { GreetingBlock, IntroText } from './style'

const HomePageContent: React.FC = () => (
  <GreetingBlock>
    <IntroText>
      Hello, I&apos;m &nbsp;<b>Patrick DeVries</b>, a full-stack developer
    </IntroText>
    <Button as={Link} to="/portfolio" $variant="text">
      Check out my projects
    </Button>
  </GreetingBlock>
)

export default HomePageContent
