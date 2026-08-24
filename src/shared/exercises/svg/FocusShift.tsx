import { Figure } from './figure'

/** An eye whose focus travels from a near screen to a far point. */
export function FocusShift(): React.JSX.Element {
  return (
    <Figure>
      <style>{`
        .fs-pupil { animation: fs-look 5s ease-in-out infinite; }
        @keyframes fs-look {
          0%, 20%   { transform: translateY(0); }
          40%, 80%  { transform: translateY(-6px); }
          100%      { transform: translateY(0); }
        }
        /* The near screen dims while the far point lights up. */
        .fs-near { animation: fs-near 5s ease-in-out infinite; }
        .fs-far  { animation: fs-far  5s ease-in-out infinite; }
        @keyframes fs-near { 0%,20%{opacity:1} 40%,80%{opacity:.2} 100%{opacity:1} }
        @keyframes fs-far  { 0%,20%{opacity:.2} 40%,80%{opacity:1} 100%{opacity:.2} }
        @media (prefers-reduced-motion: reduce) {
          .fs-pupil, .fs-near, .fs-far { animation: none; }
        }
      `}</style>
      {/* Far point: a distant horizon line. */}
      <g className="fs-far">
        <line x1={44} y1={34} x2={156} y2={34} stroke="currentColor" strokeWidth={5}
              strokeLinecap="round" />
        <circle cx={100} cy={34} r={9} fill="currentColor" />
      </g>

      {/* The eye. */}
      <path d="M52 108 Q100 68 148 108 Q100 148 52 108 Z" fill="none"
            stroke="currentColor" strokeWidth={7} strokeLinejoin="round" />
      <circle className="fs-pupil" cx={100} cy={108} r={13} fill="currentColor" />

      {/* Near screen. */}
      <g className="fs-near">
        <rect x={64} y={160} width={72} height={28} rx={4} fill="none"
              stroke="currentColor" strokeWidth={6} />
      </g>
    </Figure>
  )
}
