import { app, ipcMain } from 'electron'
import { CH } from '../shared/channels'
import type { BreakAction } from '../shared/types'
import { createReminderWindow, showReminder, hideReminder } from './windows/reminderWindow'

// Phase 1: hardcoded so the popup can be exercised quickly.
// Phase 2 replaces this with the deadline-based scheduler.
const INTERVAL_MS = 10_000
const BREAK_DURATION_SEC = 180

let timer: NodeJS.Timeout | null = null

function scheduleNext(): void {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    showReminder({ breakDurationSec: BREAK_DURATION_SEC })
  }, INTERVAL_MS)
}

// Two copies running would mean two sets of reminders.
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.whenReady().then(() => {
    // Menu-bar app: no Dock icon.
    app.dock?.hide()

    ipcMain.handle(CH.BREAK_ACTION, (_e, action: BreakAction) => {
      // Phase 1 treats every action the same; Phase 3 gives them distinct
      // scheduling behaviour.
      void action
      hideReminder()
      scheduleNext()
    })

    createReminderWindow()
    scheduleNext()
  })

  // Keep running with no visible window — this is a menu-bar app.
  app.on('window-all-closed', () => {
    // Intentionally empty: do not quit.
  })
}
