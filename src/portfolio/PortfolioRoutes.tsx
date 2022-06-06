import { Route, Routes } from 'react-router-dom'
import Portfolio from './work'
import Sseo from './work/sseo'

const PortfolioRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Portfolio />} />
    <Route path="sseo" element={<Sseo />} />
  </Routes>
)

export default PortfolioRoutes
