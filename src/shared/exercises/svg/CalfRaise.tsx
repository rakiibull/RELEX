import { Figure, Head, Limb } from './figure'

export function CalfRaise(): React.JSX.Element {
  return (
    <Figure>
      <style>{`
        /* The whole body lifts; only the toes stay planted. */
        .cr-body { animation: cr-rise 2.6s ease-in-out infinite; }
        @keyframes cr-rise {
          0%, 100% { transform: translateY(0); }
          45%, 60% { transform: translateY(-16px); }
        }
        @media (prefers-reduced-motion: reduce) { .cr-body { animation: none; } }
      `}</style>
      {/* Ground line. */}
      <line x1={44} y1={188} x2={156} y2={188} stroke="currentColor" strokeWidth={4}
            strokeLinecap="round" opacity={0.45} />
      <g className="cr-body">
        <Head cx={100} cy={38} />
        <Limb x1={100} y1={58} x2={100} y2={116} />
        <Limb x1={100} y1={72} x2={72} y2={92} />
        <Limb x1={100} y1={72} x2={128} y2={92} />
        <Limb x1={100} y1={116} x2={84} y2={152} />
        <Limb x1={100} y1={116} x2={116} y2={152} />
        {/* Feet: heels lift, toes stay near the ground line. */}
        <Limb x1={84} y1={152} x2={80} y2={182} />
        <Limb x1={116} y1={152} x2={120} y2={182} />
      </g>
    </Figure>
  )
}
