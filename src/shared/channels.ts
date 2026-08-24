export const CH = {
  // main -> renderer
  REMINDER_SHOW: 'reminder:show',
  TIMER_STATE: 'timer:state',
  BREAK_COMPLETE: 'break:complete',
  SETTINGS_CHANGED: 'settings:changed',
  // renderer -> main
  BREAK_ACTION: 'break:action',
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',
  SETTINGS_TEST_SOUND: 'settings:testSound',
  WINDOW_CLOSE: 'window:close',
} as const
