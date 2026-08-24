import { app } from 'electron'

/** No-op in dev: it would register the Electron binary, not RELEX. */
export function setLaunchAtLogin(enabled: boolean): void {
  if (!app.isPackaged) return
  app.setLoginItemSettings({ openAtLogin: enabled, openAsHidden: true })
}

/** Read back from the system — the user can revoke this in System Settings
 *  without the app knowing. */
export function getLaunchAtLogin(): boolean {
  if (!app.isPackaged) return false
  return app.getLoginItemSettings().openAtLogin
}
