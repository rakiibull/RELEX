import { Figure, Head, Limb } from './figure'

export function BackExtension(): React.JSX.Element {
  return (
    <Figure>
      <style>{`
        /* The whole upper body arches back over the hips. */
        .be-upper { transform-box: fill-box; transform-origin: 50% 100%;
                    animation: be-arch 4s ease-in-out infinite; }
        @keyframes be-arch {
          0%, 100%   { transform: rotate(0deg); }
          40%, 60%   { transform: rotate(-16deg); }
        }
        @media (prefers-reduced-motion: reduce) { .be-upper { animation: none; } }
      `}</style>
      <Limb x1={100} y1={124} x2={82} y2={158} />
      <Limb x1={82} y1={158} x2={78} y2={186} />
      <Limb x1={100} y1={124} x2={118} y2={158} />
      <Limb x1={118} y1={158} x2={122} y2={186} />
      <g className="be-upper">
        <Head cx={100} cy={44} />
        <Limb x1={100} y1={64} x2={100} y2={124} />
        {/* Hands resting on the lower back. */}
        <Limb x1={100} y1={84} x2={76} y2={104} />
        <Limb x1={76} y1={104} x2={88} y2={118} />
        <Limb x1={100} y1={84} x2={124} y2={104} />
        <Limb x1={124} y1={104} x2={112} y2={118} />
      </g>
    </Figure>
  )
}
