import { useProxy } from 'valtio/macro'
import Layout from '../common/components/layout'
import ParticleControlCard from '../common/components/particleControlCard'
import particleSettings from '../common/components/particleControlCard/store'
import { GearIndicator, Instructions, Wrapper } from './style'

const Particles: React.FC = () => {
  useProxy(particleSettings)
  return (
    <Layout>
      <ParticleControlCard />
      <Wrapper firstHit={particleSettings.firstHit}>
        <GearIndicator>^</GearIndicator>
        <Instructions>Click the gear to open the particle settings </Instructions>
      </Wrapper>
    </Layout>
  )
}

export default Particles
