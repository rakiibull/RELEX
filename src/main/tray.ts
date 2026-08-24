import { Menu, Tray, nativeImage } from 'electron'
import type { TimerState } from '../shared/types'
import { assetPath } from './paths'

export interface TrayActions {
  breakNow: () => void
  skipNext: () => void
  pauseFor: (minutes: number) => void
  pauseUntilTomorrow: () => void
  resume: () => void
  quit: () => void
}

/** Module scope on purpose: a local Tray gets garbage-collected and the icon
 *  silently vanishes from the menu bar after a few seconds. */
let tray: Tray | null = null
let actions: TrayActions
let lastPhase: TimerState['phase'] | null = null
let lastPausedUntil: number | null = null

function formatMMSS(ms: number): string {
  const total = Math.ceil(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Deliberately free of a live countdown: the menu is only rebuilt on phase
 *  changes, so a ticking value here would go stale. The countdown lives in
 *  the tray title, which does update every second. */
function summary(state: TimerState): string {
  switch (state.phase) {
    case 'counting':
      return 'Counting down to your next break'
    case 'breaking':
      return 'Break in progress'
    case 'paused':
      return state.pausedUntil === null
        ? 'Paused'
        : `Paused until ${new Date(state.pausedUntil).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
          })}`
  }
}

function buildMenu(state: TimerState): void {
  if (!tray) return
  const paused = state.phase === 'paused'

  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: summary(state), enabled: false },
      { type: 'separator' },
      { label: 'Take a break now', enabled: state.phase !== 'breaking', click: actions.breakNow },
      { label: 'Skip next break', enabled: state.phase === 'counting', click: actions.skipNext },
      { type: 'separator' },
      {
        label: 'Pause',
        enabled: !paused,
        submenu: [
          { label: 'for 30 minutes', click: () => actions.pauseFor(30) },
          { label: 'for 1 hour', click: () => actions.pauseFor(60) },
          { label: 'until tomorrow', click: actions.pauseUntilTomorrow },
        ],
      },
      { label: 'Resume', enabled: paused, click: actions.resume },
      { type: 'separator' },
      { label: 'Quit RELEX', accelerator: 'Command+Q', click: actions.quit },
    ]),
  )
}

export function createTray(a: TrayActions): void {
  actions = a
  const iconPath = assetPath('trayTemplate.png')
  const icon = nativeImage.createFromPath(iconPath)
  // createFromPath returns an empty image for a bad path rather than throwing,
  // which shows up as an invisible tray icon and nothing in the log.
  if (icon.isEmpty()) console.error(`[relex] tray icon failed to load: ${iconPath}`)
  // Template images are black + alpha only; macOS recolours them for
  // light/dark. Set the flag as well as using the …Template.png name.
  icon.setTemplateImage(true)
  tray = new Tray(icon)
  tray.setToolTip('RELEX')
}

export function updateTray(state: TimerState): void {
  if (!tray) return

  const label = state.phase === 'paused' ? '' : ` ${formatMMSS(state.remainingMs)}`
  tray.setTitle(label)

  // Rebuild only when the menu's own contents change: rebuilding every second
  // would close the menu under the user's cursor while it is open.
  if (state.phase !== lastPhase || state.pausedUntil !== lastPausedUntil) {
    lastPhase = state.phase
    lastPausedUntil = state.pausedUntil
    buildMenu(state)
  }
}

export function destroyTray(): void {
  tray?.destroy()
  tray = null
}
