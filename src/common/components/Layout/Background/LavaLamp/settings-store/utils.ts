import { DEFAULT_SETTINGS } from './initial'
import lavaLampSettings from './store'

export const resetSettings = () => Object.assign(lavaLampSettings, DEFAULT_SETTINGS)
