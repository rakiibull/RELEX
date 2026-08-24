import { Figure, Head, Limb } from './figure'

export function HipFlexor(): React.JSX.Element {
  return (
    <Figure>
      <style>{`
        /* Hips press forward into the lunge, then ease back. */
        .hf-body { animation: hf-press 4.5s ease-in-out infinite; }
        @keyframes hf-press {
          0%, 100% { transform: translateX(0); }
          40%, 65% { transform: translateX(10px); }
        }
        @media (prefers-reduced-motion: reduce) { .hf-body { animation: none; } }
      `}</style>
      <line x1={30} y1={188} x2={170} y2={188} stroke="currentColor" strokeWidth={4}
            strokeLinecap="round" opacity={0.45} />
      {/* Back leg stays put — it is the one being stretched. */}
      <Limb x1={104} y1={122} x2={62} y2={158} />
      <Limb x1={62} y1={158} x2={40} y2={184} />
      <g className="hf-body">
        <Head cx={104} cy={44} />
        <Limb x1={104} y1={64} x2={104} y2={122} />
        <Limb x1={104} y1={80} x2={86} y2={106} />
        <Limb x1={104} y1={80} x2={124} y2={106} />
        {/* Front leg: bent knee taking the weight. */}
        <Limb x1={104} y1={122} x2={140} y2={146} />
        <Limb x1={140} y1={146} x2={142} y2={184} />
      </g>
    </Figure>
  )
}
