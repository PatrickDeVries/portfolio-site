import Button from '@/common/components/Button'
import Flex from '@/common/components/Flex'
import Input from '@/common/components/Input'
import { MAX_PARTICLES } from '@/common/components/Layout/Background/LavaLamp'
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
          value={lavaLampSnap.particleScale}
          min={-10}
          max={100}
          onChange={newVal =>
            (lavaLampSettings.particleScale =
              newVal === 0 ? (lavaLampSnap.particleScale > 0 ? -1 : 1) : newVal)
          }
          label="Particle radius scale"
        />
        <RangeSlider
          value={lavaLampSnap.convectionCoefficientScale}
          min={-100}
          max={100}
          onChange={newVal =>
            (lavaLampSettings.convectionCoefficientScale =
              newVal === 0 ? (lavaLampSnap.convectionCoefficientScale > 0 ? -1 : 1) : newVal)
          }
          label="Convection coefficient scale"
        />
        <RangeSlider
          value={lavaLampSnap.lampTempScale}
          min={-100}
          max={100}
          onChange={newVal =>
            (lavaLampSettings.lampTempScale =
              newVal === 0 ? (lavaLampSnap.lampTempScale > 0 ? -1 : 1) : newVal)
          }
          label="Lamp temperature scale"
        />
        <RangeSlider
          value={lavaLampSnap.mouseSize}
          min={0}
          max={5}
          step={0.01}
          onChange={newVal => (lavaLampSettings.mouseSize = newVal)}
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
      <Button onClick={resetSettings}>Reset Settings</Button>
    </ControlCard>
  )
}

export default LavaLampControlCard
