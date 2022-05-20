import { useProxy } from 'valtio/macro'
import Layout from '../common/components/layout'
import ParticleControlCard from '../common/components/particleControlCard'
import store from '../common/components/particleControlCard/store'
import { GearIndicator, Instructions, Wrapper } from './style'

const Particles: React.FC = () => {
  useProxy(store)
  return (
    <Layout>
      <ParticleControlCard />
      <Wrapper firstHit={store.firstHit}>
        <GearIndicator>^</GearIndicator>
        <Instructions>Click the gear to open the particle settings </Instructions>
      </Wrapper>
    </Layout>
  )
}

export default Particles
