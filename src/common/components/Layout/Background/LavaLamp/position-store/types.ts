import React from 'react'
import { Points } from 'three'

export type PositionStore = {
  viewport: { width: number; height: number; top: number }
  pointsRef: React.MutableRefObject<Points | null>
}
