import { powerMonitor } from 'electron'
import * as scheduler from './scheduler'

/** Grace period after wake so the reminder does not ambush the user the
 *  instant the lid opens. */
const WAKE_GRACE_MS = 60_000

export function registerPowerEvents(): void {
  powerMonitor.on('suspend', () => scheduler.pauseFor(null, { system: true }))
  powerMonitor.on('lock-screen', () => scheduler.pauseFor(null, { system: true }))

  const wake = (): void => {
    if (!scheduler.isSystemPaused()) return
    if (scheduler.isOverdue()) scheduler.rescheduleIn(WAKE_GRACE_MS)
    else scheduler.resume({ system: true })
  }

  powerMonitor.on('resume', wake)
  powerMonitor.on('unlock-screen', wake)
}
