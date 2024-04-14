import { useMutationObserver, useResizeObserver } from '@yobgob/too-many-hooks'
import { useCallback, useEffect, useRef } from 'react'
import { useSnapshot } from 'valtio'
import store from '../../store'

const useVisibleParticleRepellents = () => {
  const bodyElement = document.querySelector('body')
  const { scrollPosition } = useSnapshot(store)

  const repellentsRef = useRef<Element[]>([])

  const updateVisibleParticleRepellents = useCallback(() => {
    const allRepellents = document.querySelectorAll('*[data-repel-particles="true"]')
    const visibleRepellents = Array.from(allRepellents).filter(repellent => {
      const { top, bottom, left, right } = repellent.getBoundingClientRect()

      const verticallyVisible =
        (top > 0 && top < window.innerHeight) || (bottom > 0 && bottom < window.innerHeight)
      const horizontallyVisible =
        (left > 0 && left < window.innerWidth) || (right > 0 && right < window.innerWidth)

      return verticallyVisible && horizontallyVisible
    })
    repellentsRef.current = visibleRepellents
  }, [])

  const mutationRecords = useMutationObserver(bodyElement, {
    attributes: true,
    childList: true,
  })
  const resizeRecords = useResizeObserver(bodyElement)
  useEffect(updateVisibleParticleRepellents, [
    updateVisibleParticleRepellents,
    scrollPosition,
    mutationRecords,
    resizeRecords,
  ])

  return repellentsRef
}

export default useVisibleParticleRepellents
