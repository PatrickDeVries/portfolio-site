import React from 'react'
import { ControlCardMenu } from './style'

interface Props {
  areControlsOpen: boolean
  children: React.ReactNode
}

const ControlCard: React.FC<Props> = ({ areControlsOpen, children }) => (
  <ControlCardMenu $areControlsOpen={areControlsOpen}>{children}</ControlCardMenu>
)

export default ControlCard
