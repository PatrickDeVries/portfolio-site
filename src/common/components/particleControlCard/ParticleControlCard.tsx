import React from 'react'
import { useProxy } from 'valtio/macro'
import Button from '../button'
import RangeSlider from '../rangeSlider'
import store, { MouseShape } from './store'
import { ColorInput, ControlCard, ControlRows, Footer, Label } from './style'

const ParticleControlCard: React.FC = () => {
  useProxy(store)

  return (
    <>
      <ControlCard controlsOpen={store.controlsOpen}>
        <span>Controls</span>
        <ControlRows>
          <RangeSlider
            value={store.particleCount}
            min={1}
            max={99999}
            onChange={newVal => {
              store.particleCount = newVal
              if (store.freeThinkers > newVal) store.freeThinkers = newVal
            }}
            label="Particle count"
          />
          <RangeSlider
            value={parseFloat(store.baseV.toFixed(4))}
            min={0}
            max={1}
            step={0.0001}
            onChange={newVal => (store.baseV = newVal)}
            label="Base velocity"
          />
          <RangeSlider
            value={parseFloat(store.vVar.toFixed(4))}
            min={0}
            max={1}
            step={0.0001}
            onChange={newVal => (store.vVar = newVal)}
            label="Velocity variance"
          />
          <RangeSlider
            value={parseFloat(store.baseTurnV.toFixed(5))}
            min={0}
            max={parseFloat((Math.PI / 4).toFixed(5))}
            step={0.00001}
            onChange={newVal => (store.baseTurnV = newVal)}
            label="Base turn speed"
            labels={{ max: 'π/4' }}
          />
          <RangeSlider
            value={parseFloat(store.turnVar.toFixed(5))}
            min={0}
            max={parseFloat((Math.PI / 4).toFixed(5))}
            step={0.00001}
            onChange={newVal => (store.turnVar = newVal)}
            label="Turn speed variance"
            labels={{ max: 'π/4' }}
          />
          <RangeSlider
            value={store.freeThinkers}
            min={0}
            max={store.particleCount}
            step={1}
            onChange={newVal => (store.freeThinkers = newVal)}
            label="Free thinkers"
          />
          <Label>
            Left color
            <ColorInput
              type="color"
              value={store.colorA}
              onChange={event => (store.colorA = event.target.value)}
            />
          </Label>
          <RangeSlider
            value={store.mouseSize}
            min={0}
            max={5}
            step={0.01}
            onChange={newVal => (store.mouseSize = newVal)}
            label="Mouse social distancing"
            title="Press '-' to shrink, '=' to grow"
          />
          <Label>
            Right color
            <ColorInput
              type="color"
              value={store.colorB}
              onChange={event => (store.colorB = event.target.value)}
            />
          </Label>
          <Label>
            Mouse shape
            <select
              value={store.mouseShape}
              onChange={e => (store.mouseShape = MouseShape[e.target.value as MouseShape])}
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
          <Button
            onClick={() => {
              // TODO reset settings
              // resetSettings()
            }}
          >
            Restore settings to Default
          </Button>
          <Label>
            Mouse shape
            <select
              value={store.mouseShape}
              onChange={e => (store.mouseShape = MouseShape[e.target.value as MouseShape])}
            >
              {Object.keys(MouseShape).map(shape => (
                <option key={shape} value={shape}>
                  {shape}
                </option>
              ))}
            </select>
          </Label>
          <Button
            onClick={() => {
              store.positions = []
              store.velocities = []
              store.angles = []
            }}
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
