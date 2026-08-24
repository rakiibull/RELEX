import { Body, Figure, Head } from './figure'

export function NeckRotation(): React.JSX.Element {
  return (
    <Figure>
      <style>{`
        /* scaleX fakes the head turning away from the viewer. */
        .nr-head { transform-box: fill-box; transform-origin: 50% 100%;
                   animation: nr-turn 4s ease-in-out infinite; }
        @keyframes nr-turn {
          0%, 100% { transform: scaleX(1); }
          25%      { transform: scaleX(0.5) translateX(-16px); }
          50%      { transform: scaleX(1); }
          75%      { transform: scaleX(0.5) translateX(16px); }
        }
        .nr-nose { animation: nr-nose 4s ease-in-out infinite; }
        @keyframes nr-nose {
          0%, 100% { opacity: 0.2; }
          25%, 75% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nr-head, .nr-nose { animation: none; }
        }
      `}</style>
      <Body head={false} />
      <g className="nr-head">
        <Head cx={100} cy={44} />
        <circle className="nr-nose" cx={100} cy={48} r={4} fill="currentColor" />
      </g>
    </Figure>
  )
}
