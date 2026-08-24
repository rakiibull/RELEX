/** Shared building blocks so each exercise file stays about its own motion.
 *  Everything uses currentColor, so one figure works in any theme. */

export const STROKE = 7

export function Limb(props: {
  x1: number
  y1: number
  x2: number
  y2: number
  className?: string
}): React.JSX.Element {
  return (
    <line
      {...props}
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
    />
  )
}

export function Head({
  cx,
  cy,
  r = 20,
  className,
}: {
  cx: number
  cy: number
  r?: number
  className?: string
}): React.JSX.Element {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
    />
  )
}

/** The standing figure every exercise starts from, so the drawings read as
 *  one person rather than a set of unrelated diagrams. Any part can be left
 *  out when an exercise animates its own version of it. */
export function Body({
  head = true,
  torso = true,
  arms = true,
  legs = true,
}: {
  head?: boolean
  torso?: boolean
  arms?: boolean
  legs?: boolean
} = {}): React.JSX.Element {
  return (
    <>
      {head && <Head cx={100} cy={44} />}
      {torso && <Limb x1={100} y1={64} x2={100} y2={124} />}
      {arms && (
        <>
          <Limb x1={100} y1={78} x2={70} y2={104} />
          <Limb x1={70} y1={104} x2={64} y2={132} />
          <Limb x1={100} y1={78} x2={130} y2={104} />
          <Limb x1={130} y1={104} x2={136} y2={132} />
        </>
      )}
      {legs && (
        <>
          <Limb x1={100} y1={124} x2={82} y2={158} />
          <Limb x1={82} y1={158} x2={78} y2={186} />
          <Limb x1={100} y1={124} x2={118} y2={158} />
          <Limb x1={118} y1={158} x2={122} y2={186} />
        </>
      )}
    </>
  )
}

/** Wraps each exercise drawing so they share a viewBox and sizing. */
export function Figure({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <svg viewBox="0 0 200 200" className="exercise-svg" role="img" aria-hidden="true">
      {children}
    </svg>
  )
}
