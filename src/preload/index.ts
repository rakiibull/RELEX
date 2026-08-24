import { contextBridge, ipcRenderer } from 'electron'
import { CH } from '../shared/channels'
import type { BreakAction, ReminderShowPayload } from '../shared/types'

const api = {
  breakAction: (action: BreakAction): Promise<void> =>
    ipcRenderer.invoke(CH.BREAK_ACTION, action),

  /** Returns an unsubscribe fn — React StrictMode double-invokes effects in dev,
   *  and without cleanup you get duplicate listeners and double-fired reminders. */
  onReminderShow: (cb: (p: ReminderShowPayload) => void): (() => void) => {
    const handler = (_e: Electron.IpcRendererEvent, p: ReminderShowPayload) => cb(p)
    ipcRenderer.on(CH.REMINDER_SHOW, handler)
    return () => ipcRenderer.removeListener(CH.REMINDER_SHOW, handler)
  },
}

contextBridge.exposeInMainWorld('relex', api)

export type RelexApi = typeof api
