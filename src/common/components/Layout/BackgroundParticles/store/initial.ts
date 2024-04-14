import React from 'react'
import { PositionStore } from './types'

export const INITIAL_POSITION_STORE: PositionStore = {
  viewport: { width: 0, height: 0, top: 0 },
  pointsRef: React.createRef(),
}
