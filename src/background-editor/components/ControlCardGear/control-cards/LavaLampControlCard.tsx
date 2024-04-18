import Button from '@/common/components/Button'
import Flex from '@/common/components/Flex'
import Input from '@/common/components/Input'
import { MAX_PARTICLES, randomizeLocations } from '@/common/components/Layout/Background/LavaLamp'
import lavaLampSettings, {
  resetSettings,
} from '@/common/components/Layout/Background/LavaLamp/settings-store'
import { RepellentShape } from '@/common/components/Layout/Background/types'
import RangeSlider from '@/common/components/RangeSlider'
import Select from '@/common/components/Select'
import React from 'react'
import { useSnapshot } from 'valtio'
import ControlCard from './ControlCard'
import { formatMouseShape } from './formatters'
import { WrappingRow } from './style'

const LavaLampControlCard: React.FC = () => {
  const lavaLampSnap = useSnapshot(lavaLampSettings)

  return (
    <ControlCard areControlsOpen={lavaLampSnap.areControlsOpen}>
      <WrappingRow>
        <RangeSlider
          value={lavaLampSnap.particleCount}
          min={1}
          max={MAX_PARTICLES}
          onChange={newVal => (lavaLampSettings.particleCount = newVal)}
          label="Particle count"
        />
        <RangeSlider
          value={lavaLampSnap.particleScale * 50}
          min={1}
          max={1000}
          onChange={newVal => (lavaLampSettings.particleScale = newVal / 50)}
          label="Particle radius"
        />
        <RangeSlider
          value={lavaLampSnap.mouseSize}
          min={0}
          max={5}
          step={0.01}
          onChange={newVal => (lavaLampSettings.mouseSize = newVal)}
          label="Mouse social distancing"
          title="Press '-' to shrink, '=' to grow"
        />
        <Select
          label="Mouse shape"
          options={Object.values(RepellentShape).map(shape => ({
            value: shape,
            label: formatMouseShape(shape),
          }))}
          value={lavaLampSnap.mouseShape}
          onChange={value => (lavaLampSettings.mouseShape = value)}
        />
      </WrappingRow>
      <Flex $stretch $justifyContent="space-between" $gap="1rem">
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
      <WrappingRow>
        <Button onClick={resetSettings}>Reset Settings</Button>
        <Button onClick={randomizeLocations}>Reset Particle Locations</Button>
      </WrappingRow>
    </ControlCard>
  )
}

export default LavaLampControlCard
