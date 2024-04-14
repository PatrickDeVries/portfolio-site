import { DEFAULT_SETTINGS } from './initial'
import particleSettings from './store'

export const resetSettings = () => Object.assign(particleSettings, DEFAULT_SETTINGS)
