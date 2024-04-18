import { Size } from '@react-three/fiber'
import { useMemo } from 'react'
import { Point2d, isCircle } from './types'
import { generateStar } from './utils'

interface Props {
  pathname: string
  viewport: Size
}

const useFixedRepellents = ({ pathname, viewport }: Props) => {
  const viewportScale = {
    xMin: -viewport.width / 2,
    xMax: viewport.width / 2,
    yMin: -viewport.height / 2,
    yMax: viewport.height / 2,
  }

  const fixedRepellentShapes = useMemo(() => {
    if (pathname === '/')
      return viewport.width < viewport.height
        ? []
        : [
            {
              vertices: generateStar(viewport.width * 0.1, {
                x: (viewportScale.xMin * 3) / 4,
                y: 0,
              }),
            },
            {
              vertices: generateStar(viewport.width * 0.1, {
                x: (viewportScale.xMax * 3) / 4,
                y: 0,
              }),
            },
          ]

    return []
  }, [pathname, viewport.height, viewport.width, viewportScale.xMax, viewportScale.xMin])
  const fixedRepellentMaxes: Point2d[] = useMemo(
    () =>
      fixedRepellentShapes.map(repellent =>
        isCircle(repellent)
          ? { x: 0, y: 0 }
          : {
              x: Math.max.apply(
                Math,
                repellent.vertices.map(v => v.x),
              ),
              y: Math.max.apply(
                Math,
                repellent.vertices.map(v => v.y),
              ),
            },
      ),
    [fixedRepellentShapes],
  )
  const fixedRepellentMins: Point2d[] = useMemo(
    () =>
      fixedRepellentShapes.map(repellent =>
        isCircle(repellent)
          ? { x: 0, y: 0 }
          : {
              x: Math.min.apply(
                Math,
                repellent.vertices.map(v => v.x),
              ),
              y: Math.min.apply(
                Math,
                repellent.vertices.map(v => v.y),
              ),
            },
      ),
    [fixedRepellentShapes],
  )

  return { fixedRepellentShapes, fixedRepellentMins, fixedRepellentMaxes }
}

export default useFixedRepellents
