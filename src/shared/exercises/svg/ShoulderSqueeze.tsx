import { Body, Figure, Limb } from './figure'

export function ShoulderSqueeze(): React.JSX.Element {
  return (
    <Figure>
      <style>{`
        .sq-l, .sq-r { transform-box: fill-box; transform-origin: 100% 0; }
        .sq-l { animation: sq-pull-l 3s ease-in-out infinite; }
        .sq-r { animation: sq-pull-r 3s ease-in-out infinite; }
        /* Elbows drawing back toward the spine, then releasing. */
        @keyframes sq-pull-l {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          40%, 60% { transform: translateX(16px) rotate(10deg); }
        }
        @keyframes sq-pull-r {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          40%, 60% { transform: translateX(-16px) rotate(-10deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sq-l, .sq-r { animation: none; }
        }
      `}</style>
      <Body arms={false} />
      <g className="sq-l">
        <Limb x1={100} y1={78} x2={68} y2={98} />
        <Limb x1={68} y1={98} x2={74} y2={126} />
      </g>
      <g className="sq-r">
        <Limb x1={100} y1={78} x2={132} y2={98} />
        <Limb x1={132} y1={98} x2={126} y2={126} />
      </g>
    </Figure>
  )
}
