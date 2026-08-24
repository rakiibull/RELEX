import { Figure, Head } from './figure'

/** Warm palms cupped over closed eyes. */
export function EyePalming(): React.JSX.Element {
  return (
    <Figure>
      <style>{`
        .ep-palm-l, .ep-palm-r { transform-box: fill-box; transform-origin: 50% 100%; }
        .ep-palm-l { animation: ep-cup-l 5s ease-in-out infinite; }
        .ep-palm-r { animation: ep-cup-r 5s ease-in-out infinite; }
        /* Hands rise to the face, rest, then lower. */
        @keyframes ep-cup-l {
          0%, 100% { transform: translate(-16px, 46px); opacity: .55; }
          30%, 75% { transform: translate(0, 0); opacity: 1; }
        }
        @keyframes ep-cup-r {
          0%, 100% { transform: translate(16px, 46px); opacity: .55; }
          30%, 75% { transform: translate(0, 0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ep-palm-l, .ep-palm-r { animation: none; }
        }
      `}</style>
      <Head cx={100} cy={96} r={46} />
      {/* Closed eyes behind the palms. */}
      <path d="M74 88 q10 8 20 0" fill="none" stroke="currentColor" strokeWidth={5}
            strokeLinecap="round" />
      <path d="M106 88 q10 8 20 0" fill="none" stroke="currentColor" strokeWidth={5}
            strokeLinecap="round" />
      <g className="ep-palm-l">
        <rect x={62} y={74} width={32} height={26} rx={9} fill="none"
              stroke="currentColor" strokeWidth={6} />
      </g>
      <g className="ep-palm-r">
        <rect x={106} y={74} width={32} height={26} rx={9} fill="none"
              stroke="currentColor" strokeWidth={6} />
      </g>
    </Figure>
  )
}
