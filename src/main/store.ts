import { app } from 'electron'
import type { Settings } from '../shared/types'

// electron-store 11 is ESM-only; Electron's require can load it, but the
// namespace comes back wrapped.
const mod = require('electron-store')
const Store = (mod.default || mod) as typeof import('electron-store').default

export const DEFAULT_SETTINGS: Settings = {
  intervalMinutes: 30,
  breakDurationSec: 180,
  soundEnabled: true,
  volume: 0.7,
  snoozeMinutes: 5,
  maxSnoozes: 3,
  workHours: { enabled: false, start: '09:00', end: '18:00' },
  launchAtLogin: false,
}

interface Schema {
  settings: Settings
  recentExerciseIds: string[]
}

const store = new Store<Schema>({
  name: 'config',
  defaults: { settings: DEFAULT_SETTINGS, recentExerciseIds: [] },
})

/** Merged with defaults so a config written by an older version, or one the
 *  user hand-edited, cannot leave a field undefined. */
export function getSettings(): Settings {
  const saved = store.get('settings')
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    workHours: { ...DEFAULT_SETTINGS.workHours, ...saved?.workHours },
  }
}

export function setSettings(next: Settings): Settings {
  const merged = clampSettings({ ...getSettings(), ...next })
  store.set('settings', merged)
  return merged
}

/** Keeps hand-edited or malformed values inside usable bounds. */
export function clampSettings(s: Settings): Settings {
  const clamp = (n: number, lo: number, hi: number, fallback: number): number =>
    Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback

  return {
    ...s,
    intervalMinutes: clamp(s.intervalMinutes, 1, 240, DEFAULT_SETTINGS.intervalMinutes),
    breakDurationSec: clamp(s.breakDurationSec, 30, 900, DEFAULT_SETTINGS.breakDurationSec),
    volume: clamp(s.volume, 0, 1, DEFAULT_SETTINGS.volume),
    snoozeMinutes: clamp(s.snoozeMinutes, 1, 60, DEFAULT_SETTINGS.snoozeMinutes),
    maxSnoozes: clamp(s.maxSnoozes, 0, 10, DEFAULT_SETTINGS.maxSnoozes),
  }
}

export function getRecentExerciseIds(): string[] {
  return store.get('recentExerciseIds') ?? []
}

export function setRecentExerciseIds(ids: string[]): void {
  store.set('recentExerciseIds', ids)
}

export function configPath(): string {
  return store.path
}

export function userDataPath(): string {
  return app.getPath('userData')
}
