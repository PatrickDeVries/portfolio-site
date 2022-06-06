import { Route, Routes } from 'react-router-dom'
import Portfolio from './work'
import Sseo from './work/pool/sseo'

const PortfolioRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Portfolio />} />
    <Route path="pool/sseo" element={<Sseo />} />
  </Routes>
)

export default PortfolioRoutes
