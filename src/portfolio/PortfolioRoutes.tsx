import { Route, Routes } from 'react-router-dom'
import Portfolio from './work'
import Fives from './work/pool/fives'
import Sseo from './work/pool/sseo'

const PortfolioRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Portfolio />} />
    <Route path="pool/sseo" element={<Sseo />} />
    <Route path="pool/fives" element={<Fives />} />
  </Routes>
)

export default PortfolioRoutes
