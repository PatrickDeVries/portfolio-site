import Flex from '@/common/components/Flex'
import Input from '@/common/components/Input'
import { MAX_PARTICLES } from '@/common/components/Layout/Background/LavaLamp'
import { RepellentShape } from '@/common/components/Layout/Background/types'
import RangeSlider from '@/common/components/RangeSlider'
import { titleize } from '@/common/formatters'
import React from 'react'
import { useSnapshot } from 'valtio'
import { ControlCard } from '../style'
import lavaLampSettings from './store'
import { Label } from './style'

const formatMouseShape = (shape: RepellentShape) =>
  shape === RepellentShape.Rectangle ? 'Square' : titleize(shape.toLocaleLowerCase())

const LavaLampControlCard: React.FC = () => {
  const lavaLampSnap = useSnapshot(lavaLampSettings)

  return (
    <>
      <ControlCard $areControlsOpen={lavaLampSnap.areControlsOpen}>
        <Flex $justifyContent="space-between" $gap="1rem">
          <Flex $flexDirection="column" $gap="1rem">
            <RangeSlider
              value={lavaLampSnap.particleCount}
              min={1}
              max={MAX_PARTICLES}
              onChange={newVal => (lavaLampSettings.particleCount = newVal)}
              label="Particle count"
            />
          </Flex>
          <Flex $flexDirection="column" $gap="1rem">
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
            <RangeSlider
              value={lavaLampSnap.mouseSize}
              min={0}
              max={5}
              step={0.01}
              onChange={newVal => (lavaLampSettings.mouseSize = newVal)}
              label="Mouse social distancing"
              title="Press '-' to shrink, '=' to grow"
            />
          </Flex>
          <Flex $flexDirection="column" $gap="1rem">
            <Input
              type="color"
              label="Hot color"
              value={lavaLampSnap.hotColor}
              onChange={event => (lavaLampSettings.hotColor = event.target.value)}
            />
            <Input
              type="color"
              label="Cold color"
              value={lavaLampSnap.coldColor}
              onChange={event => (lavaLampSettings.coldColor = event.target.value)}
            />
          </Flex>
        </Flex>
        {/* <ControlRows>

         
          
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
        </Footer> */}
      </ControlCard>
    </>
  )
}

export default LavaLampControlCard
