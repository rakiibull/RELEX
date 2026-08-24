import { Figure, Limb } from './figure'

/** Close-up of a forearm and open hand — a whole body would hide the motion. */
export function WristCircles(): React.JSX.Element {
  return (
    <Figure>
      <style>{`
        .wc-hand { transform-box: fill-box; transform-origin: 50% 100%;
                   animation: wc-spin 3s ease-in-out infinite; }
        /* A wobble reads as a circle better than a full spin at this size. */
        @keyframes wc-spin {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(26deg); }
          75%      { transform: rotate(-26deg); }
        }
        @media (prefers-reduced-motion: reduce) { .wc-hand { animation: none; } }
      `}</style>
      {/* Forearm rising to the wrist joint. */}
      <Limb x1={100} y1={188} x2={100} y2={126} />
      <circle cx={100} cy={120} r={8} fill="currentColor" />

      <g className="wc-hand">
        {/* Palm. */}
        <path
          d="M84 118 L84 84 Q84 74 100 74 Q116 74 116 84 L116 118 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={7}
          strokeLinejoin="round"
        />
        {/* Fingers. */}
        <Limb x1={87} y1={76} x2={83} y2={44} />
        <Limb x1={97} y1={74} x2={96} y2={38} />
        <Limb x1={107} y1={74} x2={109} y2={40} />
        <Limb x1={115} y1={80} x2={121} y2={52} />
        {/* Thumb. */}
        <Limb x1={84} y1={98} x2={64} y2={84} />
      </g>
    </Figure>
  )
}
