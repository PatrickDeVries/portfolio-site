import { Route, Routes } from 'react-router-dom'
import Portfolio from './work'
import { SseoContainer } from './work/sseo'

const PortfolioRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Portfolio />} />
    <Route path="sseo" element={<SseoContainer />} />
  </Routes>
)

export default PortfolioRoutes
