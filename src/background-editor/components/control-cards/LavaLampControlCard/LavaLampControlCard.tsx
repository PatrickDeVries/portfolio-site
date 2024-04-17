import Button from '@/common/components/Button'
import { MAX_PARTICLES, randomizeLocations } from '@/common/components/Layout/Background/LavaLamp'
import { RepellentShape } from '@/common/components/Layout/Background/types'
import RangeSlider from '@/common/components/RangeSlider'
import { titleize } from '@/common/formatters'
import React from 'react'
import { useSnapshot } from 'valtio'
import { ControlCard } from '../style'
import lavaLampSettings, { resetSettings } from './store'
import { ColorInput, ControlRows, Footer, Label } from './style'

const formatMouseShape = (shape: RepellentShape) =>
  shape === RepellentShape.Rectangle ? 'Square' : titleize(shape.toLocaleLowerCase())

const LavaLampControlCard: React.FC = () => {
  const lavaLampSnap = useSnapshot(lavaLampSettings)

  return (
    <>
      <ControlCard $areControlsOpen={lavaLampSnap.areControlsOpen}>
        <span>Controls</span>
        <ControlRows>
          <RangeSlider
            value={lavaLampSnap.particleCount}
            min={1}
            max={MAX_PARTICLES}
            onChange={newVal => (lavaLampSettings.particleCount = newVal)}
            label="Particle count"
          />
          <Label>
            Hot color
            <ColorInput
              type="color"
              value={lavaLampSnap.hotColor}
              onChange={event => (lavaLampSettings.hotColor = event.target.value)}
            />
          </Label>
          <RangeSlider
            value={lavaLampSnap.mouseSize}
            min={0}
            max={5}
            step={0.01}
            onChange={newVal => (lavaLampSettings.mouseSize = newVal)}
            label="Mouse social distancing"
            title="Press '-' to shrink, '=' to grow"
          />
          <Label>
            Cold color
            <ColorInput
              type="color"
              value={lavaLampSnap.coldColor}
              onChange={event => (lavaLampSettings.coldColor = event.target.value)}
            />
          </Label>
          <Label>
            Mouse shape
            <select
              value={lavaLampSnap.mouseShape}
              onChange={e => (lavaLampSettings.mouseShape = e.target.value as RepellentShape)}
            >
              {Object.values(RepellentShape).map(shape => (
                <option key={shape} value={shape}>
                  {formatMouseShape(shape)}
                </option>
              ))}
            </select>
          </Label>
        </ControlRows>
        <Footer>
          <Button onClick={resetSettings}>Restore settings to Default</Button>
          <Label>
            Mouse shape
            <select
              value={lavaLampSnap.mouseShape}
              onChange={e => (lavaLampSettings.mouseShape = e.target.value as RepellentShape)}
            >
              {Object.values(RepellentShape).map(shape => (
                <option key={shape} value={shape}>
                  {formatMouseShape(shape)}
                </option>
              ))}
            </select>
          </Label>
          <Button
            onClick={randomizeLocations}
            title="This will randomize the positions of all particles"
          >
            Reset Particle Locations
          </Button>
        </Footer>
      </ControlCard>
    </>
  )
}

export default LavaLampControlCard
