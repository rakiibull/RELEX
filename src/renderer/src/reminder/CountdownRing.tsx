interface Props {
  /** 0 to 1, how much of the break is still left. */
  progress: number
  label: string
}

const SIZE = 132
const STROKE = 8
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function CountdownRing({ progress, label }: Props): React.JSX.Element {
  const clamped = Math.min(1, Math.max(0, progress))

  return (
    <div className="ring">
      <svg width={SIZE} height={SIZE} aria-hidden="true">
        {/* Rotated so the arc drains from 12 o'clock. */}
        <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#2a2e37"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#4c8dff"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - clamped)}
          />
        </g>
      </svg>
      <span className="ring-label">{label}</span>
    </div>
  )
}
