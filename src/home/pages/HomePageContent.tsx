import Button from '@/common/components/Button'
import { RepellentShape } from '@/common/components/Layout/Background'
import { Link } from 'react-router-dom'
import { IntroBlock, IntroText, PageWrapper } from './style'

const HomePageContent: React.FC = () => (
  <PageWrapper>
    <IntroBlock data-repel-particles data-repel-shape={RepellentShape.Circle}>
      <IntroText>
        <span>
          Hello, I&apos;m <b>Patrick DeVries</b>,
        </span>
        <span>a full-stack developer</span>
      </IntroText>
      <Button as={Link} to="/portfolio" $variant="fill">
        Check out my projects
      </Button>
    </IntroBlock>
  </PageWrapper>
)

export default HomePageContent
