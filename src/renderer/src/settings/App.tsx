import { useEffect, useState } from 'react'
import type { Settings } from '@shared/types'

function Row({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <label className="row">
      <span className="row-text">
        <span className="row-label">{label}</span>
        {hint && <span className="row-hint">{hint}</span>}
      </span>
      <span className="row-control">{children}</span>
    </label>
  )
}

export function App(): React.JSX.Element {
  const [settings, setSettings] = useState<Settings | null>(null)
  // What the Mac's own output did with the last test, so a silent chime is
  // explained rather than looking like a broken app.
  const [soundWarning, setSoundWarning] = useState<string | null>(null)

  useEffect(() => {
    void window.relex.getSettings().then(setSettings)
    // Another window (or the tray) can change settings too.
    return window.relex.onSettingsChanged(setSettings)
  }, [])

  if (!settings) return <div className="loading">Loading…</div>

  /** Optimistic: show the change at once, then let main echo back the
   *  clamped value it actually stored.
   *
   *  patch may be a function so it can build on the latest state rather than
   *  whatever was captured at render time — without that, two quick changes to
   *  the same nested object (tick the box, then edit a time) make the second
   *  overwrite the first. */
  function update(patch: Partial<Settings> | ((prev: Settings) => Partial<Settings>)): void {
    setSettings((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }
      void window.relex.setSettings(next).then(setSettings)
      return next
    })
  }

  async function testSound(): Promise<void> {
    const { url, volume, systemMuted, systemVolume } = await window.relex.testSound()

    if (systemMuted) {
      setSoundWarning('Your Mac is muted, so you will not hear this. Unmute it and try again.')
    } else if (systemVolume !== null && systemVolume < 10) {
      setSoundWarning(`Your Mac's volume is ${systemVolume}%. Turn it up to hear the chime.`)
    } else if (volume < 0.05) {
      setSoundWarning('The volume slider is almost at zero.')
    } else {
      setSoundWarning(null)
    }

    const audio = new Audio(url)
    audio.volume = volume
    await audio.play().catch((e: unknown) => {
      console.error('[relex] test sound:', e)
      setSoundWarning('The chime could not be played.')
    })
  }

  return (
    <div className="settings">
      <h1 className="settings-title">RELEX</h1>

      <section className="group">
        <h2 className="group-title">Timing</h2>

        <Row label="Remind me every" hint="minutes between breaks">
          <input
            type="number"
            min={1}
            max={240}
            value={settings.intervalMinutes}
            onChange={(e) => update({ intervalMinutes: Number(e.target.value) })}
          />
          <span className="unit">min</span>
        </Row>

        <Row label="Break length" hint="how long to move for">
          <input
            type="number"
            min={30}
            max={900}
            step={30}
            value={settings.breakDurationSec}
            onChange={(e) => update({ breakDurationSec: Number(e.target.value) })}
          />
          <span className="unit">sec</span>
        </Row>

        <Row label="Snooze length">
          <input
            type="number"
            min={1}
            max={60}
            value={settings.snoozeMinutes}
            onChange={(e) => update({ snoozeMinutes: Number(e.target.value) })}
          />
          <span className="unit">min</span>
        </Row>

        <Row label="Snoozes allowed" hint="before the button disappears">
          <input
            type="number"
            min={0}
            max={10}
            value={settings.maxSnoozes}
            onChange={(e) => update({ maxSnoozes: Number(e.target.value) })}
          />
          {/* Keeps this row's input aligned with the ones that have units. */}
          <span className="unit" />
        </Row>
      </section>

      <section className="group">
        <h2 className="group-title">Sound</h2>

        <Row label="Play a chime">
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => update({ soundEnabled: e.target.checked })}
          />
        </Row>

        <Row label="Volume">
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            disabled={!settings.soundEnabled}
            onChange={(e) => update({ volume: Number(e.target.value) })}
          />
          <button className="btn-small" onClick={testSound} disabled={!settings.soundEnabled}>
            Test
          </button>
        </Row>

        {soundWarning && <p className="warning">{soundWarning}</p>}
      </section>

      <section className="group">
        <h2 className="group-title">Work hours</h2>

        <Row label="Only remind me during work hours">
          <input
            type="checkbox"
            checked={settings.workHours.enabled}
            onChange={(e) =>
              update((prev) => ({
                workHours: { ...prev.workHours, enabled: e.target.checked },
              }))
            }
          />
        </Row>

        <Row label="From">
          <input
            type="time"
            value={settings.workHours.start}
            disabled={!settings.workHours.enabled}
            onChange={(e) =>
              update((prev) => ({
                workHours: { ...prev.workHours, start: e.target.value },
              }))
            }
          />
          <span className="unit unit-inline">to</span>
          <input
            type="time"
            value={settings.workHours.end}
            disabled={!settings.workHours.enabled}
            onChange={(e) =>
              update((prev) => ({
                workHours: { ...prev.workHours, end: e.target.value },
              }))
            }
          />
        </Row>
      </section>

      <section className="group">
        <h2 className="group-title">Startup</h2>
        <Row label="Launch RELEX at login" hint="takes effect in the installed app">
          <input
            type="checkbox"
            checked={settings.launchAtLogin}
            onChange={(e) => update({ launchAtLogin: e.target.checked })}
          />
        </Row>
      </section>

      <footer className="settings-footer">
        <button className="btn-primary-small" onClick={() => window.relex.closeWindow()}>
          Done
        </button>
      </footer>
    </div>
  )
}
