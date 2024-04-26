import Button from '@/common/components/Button'
import Flex from '@/common/components/Flex'
import Input from '@/common/components/Input'
import {
  MAX_PARTICLES,
  randomizeLavaLampData,
} from '@/common/components/Layout/Background/LavaLamp'
import lavaLampSettings, {
  resetSettings,
} from '@/common/components/Layout/Background/LavaLamp/settings-store'
import { RepellentShape } from '@/common/components/Layout/Background/types'
import RangeSlider from '@/common/components/RangeSlider'
import Select from '@/common/components/Select'
import { useWindowListener } from '@yobgob/too-many-hooks'
import React from 'react'
import { useSnapshot } from 'valtio'
import { formatMouseShape } from './formatters'
import { WrappingRow } from './style'

const LavaLampControlFields: React.FC = () => {
  const lavaLampSnap = useSnapshot(lavaLampSettings)

  useWindowListener('keyup', event => {
    if (event.key === '=') {
      lavaLampSettings.mouseSize =
        lavaLampSettings.mouseSize + 0.5 < 5 ? lavaLampSettings.mouseSize + 0.5 : 5
    } else if (event.key === '-') {
      lavaLampSettings.mouseSize =
        lavaLampSettings.mouseSize - 0.5 > 0 ? lavaLampSettings.mouseSize - 0.5 : 0
    }
  })

  return (
    <>
      <WrappingRow>
        <RangeSlider
          value={lavaLampSnap.particleCount}
          min={1}
          max={MAX_PARTICLES}
          onChange={newVal => {
            lavaLampSettings.particleCount = newVal
          }}
          label="Particle count"
        />
        <RangeSlider
          value={lavaLampSnap.particleScale}
          min={-100}
          max={1000}
          onChange={newVal => {
            lavaLampSettings.particleScale = newVal
          }}
          label="Particle radius Δ%"
          labels={{ min: '-100%', max: '1000%' }}
        />
        <RangeSlider
          value={lavaLampSnap.convectionCoefficientScale}
          min={-100}
          max={1000}
          onChange={newVal => {
            lavaLampSettings.convectionCoefficientScale = newVal
          }}
          label="Conv. coeff. Δ%"
          labels={{ min: '-100%', max: '1000%' }}
        />
        <RangeSlider
          value={lavaLampSnap.conductionCoefficientScale}
          min={-100}
          max={1000}
          onChange={newVal => {
            lavaLampSettings.conductionCoefficientScale = newVal
          }}
          label="Cond. coeff. Δ%"
          labels={{ min: '-100%', max: '1000%' }}
        />
        <RangeSlider
          value={lavaLampSnap.lampTempScale}
          min={-100}
          max={1000}
          onChange={newVal => {
            lavaLampSettings.lampTempScale = newVal
          }}
          label="Lamp temperature Δ%"
          labels={{ min: '-100%', max: '1000%' }}
        />
        <RangeSlider
          value={lavaLampSnap.mouseSize}
          min={0}
          max={5}
          step={0.01}
          onChange={newVal => {
            lavaLampSettings.mouseSize = newVal
          }}
          label="Mouse radius"
          title="Press '-' to shrink, '=' to grow"
        />
        <Select
          label="Mouse shape"
          options={Object.values(RepellentShape).map(shape => ({
            value: shape,
            label: formatMouseShape(shape),
          }))}
          value={lavaLampSnap.mouseShape}
          onChange={value => {
            lavaLampSettings.mouseShape = value
          }}
        />
      </WrappingRow>
      <Flex $stretch $justifyContent="space-between" $gap="1rem">
        <Input
          type="color"
          label="Hot color"
          value={lavaLampSnap.hotColor}
          onChange={event => {
            lavaLampSettings.hotColor = event.target.value
          }}
        />
        <Input
          type="color"
          label="Cold color"
          value={lavaLampSnap.coldColor}
          onChange={event => {
            lavaLampSettings.coldColor = event.target.value
          }}
        />
      </Flex>
      <Button onClick={resetSettings}>Reset Settings</Button>
      <Button onClick={randomizeLavaLampData}>Randomize Lava</Button>
    </>
  )
}

export default LavaLampControlFields
