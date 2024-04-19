import React, { useEffect, useMemo, useRef, useState } from 'react'
import { RouteObject, matchPath, matchRoutes, useLocation } from 'react-router-dom'
import Background from './Background'
import Header from './Header'
import { Body, Main, Wrapper } from './style'

const BACKGROUND_WHITELIST: RouteObject[] = [
  { path: '/' },
  { path: '/background-editor' },
  { path: '/contact' },
  { path: '/portfolio' },
]
interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  const location = useLocation()
  const [bodyElement, setBodyElement] = useState<HTMLBodyElement | null>(null)

  const background = useMemo(
    () => <Background top={bodyElement?.getBoundingClientRect().top ?? 0} />,
    [bodyElement],
  )

  return (
    <Wrapper>
      {matchRoutes(BACKGROUND_WHITELIST, location.pathname) && background}
      <Main>
        <Header />
        <Body $tint={!matchPath(location.pathname, '/particles')} ref={setBodyElement}>
          {children}
        </Body>
      </Main>
    </Wrapper>
  )
}

export const LayoutFallback: React.FC = () => {
  const location = useLocation()
  const bodyRef = useRef<HTMLBodyElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <Wrapper>
      <Header />
      <Body $tint={!matchPath(location.pathname, '/particles')} ref={bodyRef} />
    </Wrapper>
  )
}

export default Layout
