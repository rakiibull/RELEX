import { useEffect, useRef, useState } from 'react'
import { findExercise } from '@shared/exercises'
import type { Exercise } from '@shared/types'
import { CountdownRing } from './CountdownRing'
import { ExerciseCard } from './ExerciseCard'

function formatMMSS(ms: number): string {
  const total = Math.ceil(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function ReminderApp(): React.JSX.Element {
  const [durationSec, setDurationSec] = useState(180)
  const [remainingMs, setRemainingMs] = useState(180_000)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [finished, setFinished] = useState(false)
  // Held in a ref so the timer effect does not re-run on every tick.
  const wasBreaking = useRef(false)

  useEffect(() => {
    return window.relex.onReminderShow((p) => {
      setDurationSec(p.breakDurationSec)
      setRemainingMs(p.breakDurationSec * 1000)
      setExercise(findExercise(p.exerciseId) ?? null)
      setFinished(false)
      wasBreaking.current = false
    })
  }, [])

  useEffect(() => {
    return window.relex.onTimerState((s) => {
      if (s.phase === 'breaking') {
        wasBreaking.current = true
        setRemainingMs(s.remainingMs)
      } else if (wasBreaking.current) {
        // The break ran to completion rather than being dismissed.
        wasBreaking.current = false
        setRemainingMs(0)
        setFinished(true)
      }
    })
  }, [])

  if (finished) {
    return (
      <div className="card card-centred">
        <p className="eyebrow">RELEX</p>
        <h1 className="title">Nice work</h1>
        <p className="subtitle">Back to it — the next break is already counting down.</p>
      </div>
    )
  }

  const progress = durationSec > 0 ? remainingMs / (durationSec * 1000) : 0

  return (
    <div className="card">
      <header className="card-head">
        <div>
          <p className="eyebrow">RELEX</p>
          <h1 className="title">Stand up and move</h1>
        </div>
        <CountdownRing progress={progress} label={formatMMSS(remainingMs)} />
      </header>

      {exercise && <ExerciseCard exercise={exercise} />}

      <div className="actions">
        <button
          className="btn btn-primary"
          onClick={() => window.relex.breakAction({ type: 'done' })}
        >
          Done
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => window.relex.breakAction({ type: 'snooze', minutes: 5 })}
        >
          Snooze 5 min
        </button>
        <button
          className="btn btn-quiet"
          onClick={() => window.relex.breakAction({ type: 'dismiss' })}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
