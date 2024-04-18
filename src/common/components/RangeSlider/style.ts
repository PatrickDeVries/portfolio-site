import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const Header = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  color: ${({ theme }) => theme.text};
`

export const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  justify-content: center;
  width: 100%;
`

interface RangeWrapperProps {
  $percentFilled: number
}

// @ts-expect-error React types are bad for CSS variables
export const RangeWrapper = styled.div.attrs<RangeWrapperProps>(({ $percentFilled }) => ({
  style: {
    '--percent-filled': $percentFilled,
  },
}))<RangeWrapperProps>`
  display: grid;
  grid-template: 1fr;

  &::after {
    content: '';
    padding: 0;
    margin: 0;
    grid-column: 1;
    grid-row: 1;
    height: 5px;
    width: calc(100% * var(--percent-filled));
    background-color: ${({ theme }) => theme.primary};
    cursor: pointer;
    border-radius: 2.5px;

    transition: width 100ms ease-in-out;
    pointer-events: none;
  }
`

export const RangeInput = styled.input`
  all: unset;
  appearance: none;
  grid-column: 1;
  grid-row: 1;

  padding: 0;
  margin: 0;
  height: 5px;
  width: 100%;

  cursor: pointer;

  background-color: ${({ theme }) => theme.empty};
  ${({ theme }) => theme.name === 'light' && 'border: 1px solid black;'}
  border-radius: 2.5px;

  &::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 16px;
    background: ${({ theme }) => theme.primary};
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  &::-mo1range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 16px;
    background: ${({ theme }) => theme.primary};
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }
`

export const Labels = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
`

export const Label = styled.p`
  color: ${({ theme }) => theme.text};
  padding: 0;
  margin: 0;
  user-select: none;
`
