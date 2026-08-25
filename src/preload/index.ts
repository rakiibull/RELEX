import { contextBridge, ipcRenderer } from 'electron'
import { CH } from '../shared/channels'
import type { BreakAction, ReminderShowPayload, Settings, TimerState } from '../shared/types'

/** Every on* method returns an unsubscribe fn — React StrictMode double-invokes
 *  effects in dev, and without cleanup you get duplicate listeners and
 *  double-fired reminders. */
function subscribe<T>(channel: string, cb: (payload: T) => void): () => void {
  const handler = (_e: Electron.IpcRendererEvent, payload: T): void => cb(payload)
  ipcRenderer.on(channel, handler)
  return () => ipcRenderer.removeListener(channel, handler)
}

const api = {
  breakAction: (action: BreakAction): Promise<void> =>
    ipcRenderer.invoke(CH.BREAK_ACTION, action),

  getSettings: (): Promise<Settings> => ipcRenderer.invoke(CH.SETTINGS_GET),
  setSettings: (s: Settings): Promise<Settings> => ipcRenderer.invoke(CH.SETTINGS_SET, s),
  /** Returns the file URL and volume so the settings window can play it,
   *  plus what the Mac's own output will do with it. */
  testSound: (): Promise<{
    url: string
    volume: number
    systemMuted: boolean
    systemVolume: number | null
  }> => ipcRenderer.invoke(CH.SETTINGS_TEST_SOUND),
  closeWindow: (): Promise<void> => ipcRenderer.invoke(CH.WINDOW_CLOSE),

  onReminderShow: (cb: (p: ReminderShowPayload) => void) =>
    subscribe<ReminderShowPayload>(CH.REMINDER_SHOW, cb),
  onTimerState: (cb: (s: TimerState) => void) => subscribe<TimerState>(CH.TIMER_STATE, cb),
  onBreakComplete: (cb: () => void) => subscribe<void>(CH.BREAK_COMPLETE, cb),
  onSettingsChanged: (cb: (s: Settings) => void) => subscribe<Settings>(CH.SETTINGS_CHANGED, cb),
}

contextBridge.exposeInMainWorld('relex', api)

export type RelexApi = typeof api
