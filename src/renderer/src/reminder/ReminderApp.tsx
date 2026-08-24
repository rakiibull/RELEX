import { useEffect, useState } from 'react'

export function ReminderApp(): React.JSX.Element {
  const [breakDurationSec, setBreakDurationSec] = useState(180)

  useEffect(() => {
    // The unsubscribe matters: StrictMode runs this effect twice in dev.
    return window.relex.onReminderShow((p) => setBreakDurationSec(p.breakDurationSec))
  }, [])

  const minutes = Math.round(breakDurationSec / 60)

  return (
    <div className="card">
      <p className="eyebrow">RELEX</p>
      <h1 className="title">Stand up and move</h1>
      <p className="subtitle">
        Take {minutes} {minutes === 1 ? 'minute' : 'minutes'} away from the screen.
      </p>

      <div className="actions">
        <button className="btn btn-primary" onClick={() => window.relex.breakAction({ type: 'done' })}>
          Done
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => window.relex.breakAction({ type: 'snooze', minutes: 5 })}
        >
          Snooze 5 min
        </button>
        <button className="btn btn-quiet" onClick={() => window.relex.breakAction({ type: 'dismiss' })}>
          Dismiss
        </button>
      </div>
    </div>
  )
}
