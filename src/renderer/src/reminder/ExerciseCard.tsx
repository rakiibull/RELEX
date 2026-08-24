import type { Exercise } from '@shared/types'
import { EXERCISE_SVGS } from './exerciseSvgs'

export function ExerciseCard({ exercise }: { exercise: Exercise }): React.JSX.Element | null {
  const Svg = EXERCISE_SVGS[exercise.id]
  if (!Svg) return null

  return (
    <div className="exercise">
      <div className="exercise-art">
        <Svg />
      </div>
      <div className="exercise-text">
        <h2 className="exercise-name">
          {exercise.name.en}
          <span className="exercise-name-bn">{exercise.name.bn}</span>
        </h2>
        <ol className="exercise-steps">
          {exercise.steps.en.map((step, i) => (
            <li key={step}>
              {step}
              <span className="exercise-step-bn">{exercise.steps.bn[i]}</span>
            </li>
          ))}
        </ol>
        {exercise.reps && <p className="exercise-reps">{exercise.reps}</p>}
      </div>
    </div>
  )
}
