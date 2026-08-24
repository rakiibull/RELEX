import { Figure, Head, Limb } from './figure'

export function OverheadReach(): React.JSX.Element {
  return (
    <Figure>
      <style>{`
        /* Arms overhead, leaning side to side from the hips. */
        .or-upper { transform-box: fill-box; transform-origin: 50% 100%;
                    animation: or-bend 5s ease-in-out infinite; }
        @keyframes or-bend {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(15deg); }
          50%      { transform: rotate(0deg); }
          75%      { transform: rotate(-15deg); }
        }
        @media (prefers-reduced-motion: reduce) { .or-upper { animation: none; } }
      `}</style>
      <Limb x1={100} y1={130} x2={84} y2={162} />
      <Limb x1={84} y1={162} x2={80} y2={188} />
      <Limb x1={100} y1={130} x2={116} y2={162} />
      <Limb x1={116} y1={162} x2={120} y2={188} />
      <g className="or-upper">
        <Head cx={100} cy={62} />
        <Limb x1={100} y1={82} x2={100} y2={130} />
        {/* Both arms reaching straight up, hands nearly meeting. */}
        <Limb x1={100} y1={92} x2={86} y2={56} />
        <Limb x1={86} y1={56} x2={94} y2={22} />
        <Limb x1={100} y1={92} x2={114} y2={56} />
        <Limb x1={114} y1={56} x2={106} y2={22} />
      </g>
    </Figure>
  )
}
