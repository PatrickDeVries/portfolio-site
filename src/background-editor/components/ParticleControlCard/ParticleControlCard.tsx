import Button from '@/common/components/Button'
import { MAX_PARTICLES } from '@/common/components/Layout/Background/Particles/constants'
import { randomizeLocations } from '@/common/components/Layout/Background/Particles/store'
import { RepellentShape } from '@/common/components/Layout/Background/types'
import RangeSlider from '@/common/components/RangeSlider'
import { titleize } from '@/common/formatters'
import React from 'react'
import { useSnapshot } from 'valtio'
import particleSettings, { resetSettings } from './store'
import { ColorInput, ControlCard, ControlRows, Footer, Label } from './style'

const formatMouseShape = (shape: RepellentShape) =>
  shape === RepellentShape.Rectangle ? 'Square' : titleize(shape.toLocaleLowerCase())

const ParticleControlCard: React.FC = () => {
  const particleSnap = useSnapshot(particleSettings)

  return (
    <>
      <ControlCard $areControlsOpen={particleSnap.controlsOpen}>
        <span>Controls</span>
        <ControlRows>
          <RangeSlider
            value={particleSnap.particleCount}
            min={1}
            max={MAX_PARTICLES}
            onChange={newVal => {
              particleSettings.particleCount = newVal
              if (particleSnap.freeThinkers > newVal) particleSettings.freeThinkers = newVal
            }}
            label="Particle count"
          />
          <RangeSlider
            value={parseFloat(particleSnap.baseV.toFixed(4))}
            min={0}
            max={1}
            step={0.0001}
            onChange={newVal => {
              particleSettings.baseV = newVal
            }}
            label="Base velocity"
          />
          <RangeSlider
            value={parseFloat(particleSnap.vVar.toFixed(4))}
            min={0}
            max={1}
            step={0.0001}
            onChange={newVal => (particleSettings.vVar = newVal)}
            label="Velocity variance"
          />
          <RangeSlider
            value={parseFloat(particleSnap.baseTurnV.toFixed(5))}
            min={0}
            max={parseFloat((Math.PI / 4).toFixed(5))}
            step={0.00001}
            onChange={newVal => (particleSettings.baseTurnV = newVal)}
            label="Base turn speed"
            labels={{ max: 'π/4' }}
          />
          <RangeSlider
            value={parseFloat(particleSnap.turnVar.toFixed(5))}
            min={0}
            max={parseFloat((Math.PI / 4).toFixed(5))}
            step={0.00001}
            onChange={newVal => (particleSettings.turnVar = newVal)}
            label="Turn speed variance"
            labels={{ max: 'π/4' }}
          />
          <RangeSlider
            value={particleSnap.freeThinkers}
            min={0}
            max={particleSnap.particleCount}
            step={1}
            onChange={newVal => (particleSettings.freeThinkers = newVal)}
            label="Free thinkers"
          />
          <Label>
            Left color
            <ColorInput
              type="color"
              value={particleSnap.colorA}
              onChange={event => (particleSettings.colorA = event.target.value)}
            />
          </Label>
          <RangeSlider
            value={particleSnap.mouseSize}
            min={0}
            max={5}
            step={0.01}
            onChange={newVal => (particleSettings.mouseSize = newVal)}
            label="Mouse social distancing"
            title="Press '-' to shrink, '=' to grow"
          />
          <Label>
            Right color
            <ColorInput
              type="color"
              value={particleSnap.colorB}
              onChange={event => (particleSettings.colorB = event.target.value)}
            />
          </Label>
          <Label>
            Mouse shape
            <select
              value={particleSnap.mouseShape}
              onChange={e => (particleSettings.mouseShape = e.target.value as RepellentShape)}
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
              value={particleSnap.mouseShape}
              onChange={e => (particleSettings.mouseShape = e.target.value as RepellentShape)}
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

export default ParticleControlCard
