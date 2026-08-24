import { Figure, Head, Limb } from './figure'

export function SpinalTwist(): React.JSX.Element {
  return (
    <Figure>
      <style>{`
        /* skewX plus a squeeze reads as the torso rotating on a seat. */
        .st-upper { transform-box: fill-box; transform-origin: 50% 100%;
                    animation: st-twist 5s ease-in-out infinite; }
        @keyframes st-twist {
          0%, 100% { transform: skewX(0deg) scaleX(1); }
          25%      { transform: skewX(-12deg) scaleX(0.85); }
          50%      { transform: skewX(0deg) scaleX(1); }
          75%      { transform: skewX(12deg) scaleX(0.85); }
        }
        @media (prefers-reduced-motion: reduce) { .st-upper { animation: none; } }
      `}</style>
      {/* Chair: seat and back, so the pose reads as seated. */}
      <line x1={62} y1={140} x2={140} y2={140} stroke="currentColor" strokeWidth={6}
            strokeLinecap="round" opacity={0.4} />
      <line x1={138} y1={140} x2={138} y2={92} stroke="currentColor" strokeWidth={6}
            strokeLinecap="round" opacity={0.4} />
      <line x1={70} y1={140} x2={70} y2={180} stroke="currentColor" strokeWidth={5}
            strokeLinecap="round" opacity={0.4} />
      <line x1={132} y1={140} x2={132} y2={180} stroke="currentColor" strokeWidth={5}
            strokeLinecap="round" opacity={0.4} />

      {/* Thighs forward along the seat, shins straight down. */}
      <Limb x1={100} y1={134} x2={64} y2={134} />
      <Limb x1={64} y1={134} x2={62} y2={176} />

      <g className="st-upper">
        <Head cx={100} cy={54} />
        <Limb x1={100} y1={74} x2={100} y2={134} />
        {/* One arm reaches across to hold the chair — that is the twist. */}
        <Limb x1={100} y1={88} x2={126} y2={104} />
        <Limb x1={126} y1={104} x2={134} y2={126} />
        <Limb x1={100} y1={88} x2={76} y2={106} />
      </g>
    </Figure>
  )
}
