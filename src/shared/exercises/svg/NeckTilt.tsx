import { Body, Figure, Head, Limb } from './figure'

export function NeckTilt(): React.JSX.Element {
  return (
    <Figure>
      <style>{`
        /* transform-box is required or transform-origin resolves against the
           whole viewport instead of the element's own box. */
        .nt-head { transform-box: fill-box; transform-origin: 50% 100%;
                   animation: nt-tilt 4s ease-in-out infinite; }
        @keyframes nt-tilt {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(-22deg); }
          50%      { transform: rotate(0deg); }
          75%      { transform: rotate(22deg); }
        }
        @media (prefers-reduced-motion: reduce) { .nt-head { animation: none; } }
      `}</style>
      <Body head={false} />
      <g className="nt-head">
        <Head cx={100} cy={44} />
        <Limb x1={100} y1={64} x2={100} y2={70} />
      </g>
    </Figure>
  )
}
