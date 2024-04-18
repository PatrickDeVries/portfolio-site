import React from 'react'
import styled, { css } from 'styled-components'

interface FlexProps {
  $flexDirection?: React.CSSProperties['flexDirection']
  $flexWrap?: React.CSSProperties['flexWrap']
  $justifyContent?: React.CSSProperties['justifyContent']
  $alignItems?: React.CSSProperties['alignItems']
  $gap?: React.CSSProperties['gap']
}

const Flex = styled.div<FlexProps>`
  display: flex;
  ${({ $flexDirection }) =>
    $flexDirection &&
    css`
      flex-direction: ${$flexDirection};
    `}
  ${({ $flexWrap }) =>
    $flexWrap &&
    css`
      flex-wrap: ${$flexWrap};
    `}
  ${({ $justifyContent }) =>
    $justifyContent &&
    css`
      justify-content: ${$justifyContent};
    `}
  ${({ $alignItems }) =>
    $alignItems &&
    css`
      align-items: ${$alignItems};
    `}
  ${({ $gap }) =>
    $gap &&
    css`
      gap: ${$gap};
    `}
`

export default Flex
