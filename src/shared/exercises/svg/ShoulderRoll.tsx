import { Body, Figure, Limb } from './figure'

export function ShoulderRoll(): React.JSX.Element {
  return (
    <Figure>
      <style>{`
        .sr-arm { transform-box: fill-box; transform-origin: 50% 0;
                  animation: sr-circle 2.6s linear infinite; }
        /* A small orbit at the shoulder, so it rolls rather than swings. */
        @keyframes sr-circle {
          0%   { transform: translate(0, 0) rotate(0deg); }
          25%  { transform: translate(3px, -8px) rotate(6deg); }
          50%  { transform: translate(0, -11px) rotate(0deg); }
          75%  { transform: translate(-3px, -4px) rotate(-6deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @media (prefers-reduced-motion: reduce) { .sr-arm { animation: none; } }
      `}</style>
      <Body arms={false} />
      <g className="sr-arm">
        <Limb x1={100} y1={78} x2={70} y2={104} />
        <Limb x1={70} y1={104} x2={64} y2={132} />
        <Limb x1={100} y1={78} x2={130} y2={104} />
        <Limb x1={130} y1={104} x2={136} y2={132} />
      </g>
    </Figure>
  )
}
