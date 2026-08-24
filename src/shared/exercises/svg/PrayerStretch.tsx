import { Figure, Limb } from './figure'

/** Palms pressed together, lowering — shown as a close-up of both hands. */
export function PrayerStretch(): React.JSX.Element {
  return (
    <Figure>
      <style>{`
        .ps-hands { transform-box: fill-box; transform-origin: 50% 0;
                    animation: ps-lower 4s ease-in-out infinite; }
        @keyframes ps-lower {
          0%, 100% { transform: translateY(0); }
          45%, 65% { transform: translateY(30px); }
        }
        /* Forearms rotate outward as the hands drop, showing the stretch. */
        .ps-arm-l { transform-box: fill-box; transform-origin: 100% 100%;
                    animation: ps-open-l 4s ease-in-out infinite; }
        .ps-arm-r { transform-box: fill-box; transform-origin: 0 100%;
                    animation: ps-open-r 4s ease-in-out infinite; }
        @keyframes ps-open-l {
          0%, 100% { transform: rotate(0deg); }
          45%, 65% { transform: rotate(-18deg); }
        }
        @keyframes ps-open-r {
          0%, 100% { transform: rotate(0deg); }
          45%, 65% { transform: rotate(18deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ps-hands, .ps-arm-l, .ps-arm-r { animation: none; }
        }
      `}</style>
      <g className="ps-arm-l">
        <Limb x1={54} y1={150} x2={90} y2={112} />
      </g>
      <g className="ps-arm-r">
        <Limb x1={146} y1={150} x2={110} y2={112} />
      </g>
      <g className="ps-hands">
        {/* Two palms meeting at the centre line. */}
        <Limb x1={92} y1={112} x2={92} y2={54} />
        <Limb x1={108} y1={112} x2={108} y2={54} />
        <Limb x1={92} y1={54} x2={100} y2={42} />
        <Limb x1={108} y1={54} x2={100} y2={42} />
      </g>
    </Figure>
  )
}
