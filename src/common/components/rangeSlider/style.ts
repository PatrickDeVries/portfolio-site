import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const Header = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
  align-items: center;

  color: ${({ theme }) => theme.text};

  padding: 0;
  margin: 0;
  user-select: none;

  input[type='number'] {
    all: unset;

    background-color: ${({ theme }) => theme.backgroundHighlight};
    color: ${({ theme }) => theme.text};
    padding: 0.1rem 0.5rem;
    margin: 1px;
    border: 1px solid ${({ theme }) => theme.secondary};
    border-radius: 5px;

    &:focus {
      margin: 0;
      border: 2px solid ${({ theme }) => theme.primary};
    }
  }
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
  percentFilled: number
}

// @ts-expect-error React types are bad for CSS variables
export const RangeWrapper = styled.div.attrs<RangeWrapperProps>(({ percentFilled }) => ({
  style: {
    '--percent-filled': percentFilled,
  },
}))<RangeWrapperProps>`
  display: grid;
  grid-template: 1fr;

  > div {
    background-color: ${({ theme }) => theme.primary};
    cursor: pointer;

    z-index: 2;
    width: calc(100% * var(--percent-filled));
    transition: width 100ms ease-in-out;
    pointer-events: none;
  }

  input[type='range'] {
    appearance: unset;
    background-color: ${({ theme }) => theme.empty};
    ${({ theme }) => theme.name === 'light' && 'border: 1px solid black;'}
    width: 100%;
    cursor: pointer;
  }

  input[type='range']::-webkit-slider-thumb {
    appearance: none;
    z-index: 3;
    height: 16px;
    width: 16px;
    border-radius: 16px;
    background: ${({ theme }) => theme.primary};
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  input[type='range']::-moz-range-thumb {
    z-index: 3;
    height: 16px;
    width: 16px;
    border-radius: 16px;
    background: ${({ theme }) => theme.primary};
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  > * {
    padding: 0;
    margin: 0;
    grid-column: 1;
    grid-row: 1;
    height: 5px;
    border-radius: 5px;
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
