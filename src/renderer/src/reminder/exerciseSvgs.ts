import { BackExtension } from '@shared/exercises/svg/BackExtension'
import { CalfRaise } from '@shared/exercises/svg/CalfRaise'
import { EyePalming } from '@shared/exercises/svg/EyePalming'
import { FocusShift } from '@shared/exercises/svg/FocusShift'
import { HipFlexor } from '@shared/exercises/svg/HipFlexor'
import { NeckRotation } from '@shared/exercises/svg/NeckRotation'
import { NeckTilt } from '@shared/exercises/svg/NeckTilt'
import { OverheadReach } from '@shared/exercises/svg/OverheadReach'
import { PrayerStretch } from '@shared/exercises/svg/PrayerStretch'
import { ShoulderRoll } from '@shared/exercises/svg/ShoulderRoll'
import { ShoulderSqueeze } from '@shared/exercises/svg/ShoulderSqueeze'
import { SpinalTwist } from '@shared/exercises/svg/SpinalTwist'
import { WristCircles } from '@shared/exercises/svg/WristCircles'

/** Lives in the renderer so no .tsx ever reaches the main bundle — main only
 *  ever picks an id. Keys must match ids in shared/exercises/data.ts. */
export const EXERCISE_SVGS: Record<string, () => React.JSX.Element> = {
  'neck-tilt': NeckTilt,
  'neck-rotation': NeckRotation,
  'shoulder-roll': ShoulderRoll,
  'shoulder-squeeze': ShoulderSqueeze,
  'back-extension': BackExtension,
  'spinal-twist': SpinalTwist,
  'wrist-circles': WristCircles,
  'prayer-stretch': PrayerStretch,
  'focus-shift': FocusShift,
  'eye-palming': EyePalming,
  'calf-raise': CalfRaise,
  'hip-flexor': HipFlexor,
  'overhead-reach': OverheadReach,
}
