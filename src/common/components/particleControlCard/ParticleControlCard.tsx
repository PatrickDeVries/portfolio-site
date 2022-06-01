import React from 'react'
import { useProxy } from 'valtio/macro'
import Button from '../button'
import { MAX_PARTICLES } from '../layout/backgroundParticles/consts'
import { randomizeLocations } from '../layout/backgroundParticles/store'
import RangeSlider from '../rangeSlider'
import particleSettings, { MouseShape, resetSettings } from './store'
import { ColorInput, ControlCard, ControlRows, Footer, Label } from './style'

const ParticleControlCard: React.FC = () => {
  useProxy(particleSettings)

  return (
    <>
      <ControlCard controlsOpen={particleSettings.controlsOpen}>
        <span>Controls</span>
        <ControlRows>
          <RangeSlider
            value={particleSettings.particleCount}
            min={1}
            max={MAX_PARTICLES}
            onChange={newVal => {
              particleSettings.particleCount = newVal
              if (particleSettings.freeThinkers > newVal) particleSettings.freeThinkers = newVal
            }}
            label="Particle count"
          />
          <RangeSlider
            value={parseFloat(particleSettings.baseV.toFixed(4))}
            min={0}
            max={1}
            step={0.0001}
            onChange={newVal => {
              particleSettings.baseV = newVal
            }}
            label="Base velocity"
          />
          <RangeSlider
            value={parseFloat(particleSettings.vVar.toFixed(4))}
            min={0}
            max={1}
            step={0.0001}
            onChange={newVal => (particleSettings.vVar = newVal)}
            label="Velocity variance"
          />
          <RangeSlider
            value={parseFloat(particleSettings.baseTurnV.toFixed(5))}
            min={0}
            max={parseFloat((Math.PI / 4).toFixed(5))}
            step={0.00001}
            onChange={newVal => (particleSettings.baseTurnV = newVal)}
            label="Base turn speed"
            labels={{ max: 'π/4' }}
          />
          <RangeSlider
            value={parseFloat(particleSettings.turnVar.toFixed(5))}
            min={0}
            max={parseFloat((Math.PI / 4).toFixed(5))}
            step={0.00001}
            onChange={newVal => (particleSettings.turnVar = newVal)}
            label="Turn speed variance"
            labels={{ max: 'π/4' }}
          />
          <RangeSlider
            value={particleSettings.freeThinkers}
            min={0}
            max={particleSettings.particleCount}
            step={1}
            onChange={newVal => (particleSettings.freeThinkers = newVal)}
            label="Free thinkers"
          />
          <Label>
            Left color
            <ColorInput
              type="color"
              value={particleSettings.colorA}
              onChange={event => (particleSettings.colorA = event.target.value)}
            />
          </Label>
          <RangeSlider
            value={particleSettings.mouseSize}
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
              value={particleSettings.colorB}
              onChange={event => (particleSettings.colorB = event.target.value)}
            />
          </Label>
          <Label>
            Mouse shape
            <select
              value={particleSettings.mouseShape}
              onChange={e =>
                (particleSettings.mouseShape = MouseShape[e.target.value as MouseShape])
              }
            >
              {Object.keys(MouseShape).map(shape => (
                <option key={shape} value={shape}>
                  {shape}
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
              value={particleSettings.mouseShape}
              onChange={e =>
                (particleSettings.mouseShape = MouseShape[e.target.value as MouseShape])
              }
            >
              {Object.keys(MouseShape).map(shape => (
                <option key={shape} value={shape}>
                  {shape}
                </option>
              ))}
            </select>
          </Label>
          <Button
            onClick={randomizeLocations}
            title="This will randomise the positions of all particles"
          >
            Reset Particle Locations
          </Button>
        </Footer>
      </ControlCard>
    </>
  )
}

export default ParticleControlCard
