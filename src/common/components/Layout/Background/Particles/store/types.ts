export type PositionStore = {
  viewport: { width: number; height: number; top: number }
  pointsRef: React.MutableRefObject<THREE.Points | null>
}
