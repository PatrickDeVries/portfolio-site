import Button from '@/common/components/Button'
import Flex from '@/common/components/Flex'
import Input from '@/common/components/Input'
import { MAX_PARTICLES } from '@/common/components/Layout/Background/Particles'
import particleSettings, {
  resetSettings,
} from '@/common/components/Layout/Background/Particles/settings-store'
import { RepellentShape } from '@/common/components/Layout/Background/types'
import RangeSlider from '@/common/components/RangeSlider'
import Select from '@/common/components/Select'
import React from 'react'
import { useSnapshot } from 'valtio'
import ControlCard from './ControlCard'
import { formatMouseShape } from './formatters'
import { WrappingRow } from './style'

const ParticleControlCard: React.FC = () => {
  const particleSnap = useSnapshot(particleSettings)

  return (
    <ControlCard areControlsOpen={particleSnap.areControlsOpen}>
      <WrappingRow>
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
          value={particleSnap.freeThinkers}
          min={0}
          max={particleSnap.particleCount}
          step={1}
          onChange={newVal => (particleSettings.freeThinkers = newVal)}
          label="Free thinkers"
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
      </WrappingRow>
      <WrappingRow>
        <Select
          label="Mouse shape"
          options={Object.values(RepellentShape).map(shape => ({
            value: shape,
            label: formatMouseShape(shape),
          }))}
          value={particleSnap.mouseShape}
          onChange={value => (particleSettings.mouseShape = value)}
        />
        <RangeSlider
          value={particleSnap.mouseSize}
          min={0}
          max={5}
          step={0.01}
          onChange={newVal => (particleSettings.mouseSize = newVal)}
          label="Mouse radius"
          title="Press '-' to shrink, '=' to grow"
        />
      </WrappingRow>
      <Flex $stretch $justifyContent="space-between" $gap="1rem">
        <Input
          type="color"
          label="Left color"
          value={particleSnap.colorA}
          onChange={event => (particleSettings.colorA = event.target.value)}
        />
        <Input
          type="color"
          label="Right color"
          value={particleSnap.colorB}
          onChange={event => (particleSettings.colorB = event.target.value)}
        />
      </Flex>
      <Button onClick={resetSettings}>Reset Settings</Button>
    </ControlCard>
  )
}

export default ParticleControlCard
