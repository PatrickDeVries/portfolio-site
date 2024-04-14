import { Size } from '@react-three/fiber'
import { useWindowListener } from '@yobgob/too-many-hooks'
import { useRef } from 'react'
import { Point2d } from '../utils'

const usePoint2dMouse = (viewport: Size) => {
  const mouse = useRef<Point2d>({ x: 0, y: 0 })
  useWindowListener('mousemove', event => {
    mouse.current = {
      x: ((event.clientX - 0) * viewport.width) / window.innerWidth + -viewport.width / 2,
      y: ((event.clientY - 0) * -viewport.height) / window.innerHeight + viewport.height / 2,
    }
  })
  useWindowListener('touchmove', event => {
    mouse.current = {
      x:
        ((event.changedTouches[0].clientX - 0) * viewport.width) / window.innerWidth +
        -viewport.width / 2,
      y:
        ((event.changedTouches[0].clientY - 0) * -viewport.height) / window.innerHeight +
        viewport.height / 2,
    }
  })

  return mouse
}

export default usePoint2dMouse
