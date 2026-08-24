import type { Exercise } from '../types'

/** Metadata only — no React here, so the main process can import this to
 *  pick an exercise without pulling .tsx into its bundle. */
export const EXERCISES: Exercise[] = [
  {
    id: 'neck-tilt',
    name: { en: 'Neck Tilt', bn: 'ঘাড় কাত' },
    bodyArea: 'neck',
    reps: '5x each side',
    steps: {
      en: ['Sit or stand tall', 'Drop your right ear toward your shoulder', 'Hold 10 seconds, then switch'],
      bn: ['সোজা হয়ে বসুন বা দাঁড়ান', 'ডান কান কাঁধের দিকে নামান', '১০ সেকেন্ড ধরে রাখুন, তারপর অন্য দিকে'],
    },
  },
  {
    id: 'neck-rotation',
    name: { en: 'Neck Rotation', bn: 'ঘাড় ঘোরানো' },
    bodyArea: 'neck',
    reps: '5x each side',
    steps: {
      en: ['Look straight ahead', 'Turn your head slowly to the right', 'Hold 5 seconds, then to the left'],
      bn: ['সামনে তাকান', 'ধীরে ধীরে মাথা ডানে ঘোরান', '৫ সেকেন্ড ধরে রাখুন, তারপর বামে'],
    },
  },
  {
    id: 'shoulder-roll',
    name: { en: 'Shoulder Roll', bn: 'কাঁধ ঘোরানো' },
    bodyArea: 'shoulder',
    reps: '10x each way',
    steps: {
      en: ['Let your arms hang loose', 'Roll both shoulders backward in big circles', 'Then reverse the direction'],
      bn: ['হাত দুটো ঢিলে ছেড়ে দিন', 'দুই কাঁধ পিছন দিকে বড় করে ঘোরান', 'তারপর উল্টো দিকে ঘোরান'],
    },
  },
  {
    id: 'shoulder-squeeze',
    name: { en: 'Shoulder Blade Squeeze', bn: 'কাঁধের পাতা চাপ' },
    bodyArea: 'shoulder',
    reps: '10x',
    steps: {
      en: ['Sit tall, arms at your sides', 'Pull your shoulder blades together', 'Hold 5 seconds, then release'],
      bn: ['সোজা হয়ে বসুন, হাত পাশে', 'কাঁধের পাতা দুটো একসাথে চাপুন', '৫ সেকেন্ড ধরে রাখুন, তারপর ছাড়ুন'],
    },
  },
  {
    id: 'back-extension',
    name: { en: 'Standing Back Extension', bn: 'দাঁড়িয়ে পিঠ বাঁকানো' },
    bodyArea: 'back',
    reps: '8x',
    steps: {
      en: ['Stand up, hands on your lower back', 'Lean back gently, look up', 'Hold 5 seconds, return slowly'],
      bn: ['উঠে দাঁড়ান, কোমরে হাত রাখুন', 'আলতো করে পিছনে হেলুন, উপরে তাকান', '৫ সেকেন্ড ধরে রাখুন, ধীরে ফিরুন'],
    },
  },
  {
    id: 'spinal-twist',
    name: { en: 'Seated Spinal Twist', bn: 'বসে মেরুদণ্ড মোচড়' },
    bodyArea: 'back',
    reps: '3x each side',
    steps: {
      en: ['Sit tall, feet flat on the floor', 'Turn your torso to the right, hold the chair', 'Hold 15 seconds, then switch'],
      bn: ['সোজা হয়ে বসুন, পা মেঝেতে', 'শরীর ডানে ঘোরান, চেয়ার ধরুন', '১৫ সেকেন্ড ধরে রাখুন, তারপর অন্য দিকে'],
    },
  },
  {
    id: 'wrist-circles',
    name: { en: 'Wrist Circles', bn: 'কব্জি ঘোরানো' },
    bodyArea: 'wrist',
    reps: '10x each way',
    steps: {
      en: ['Stretch both arms out in front', 'Make slow circles with your wrists', 'Then reverse the direction'],
      bn: ['দুই হাত সামনে বাড়ান', 'কব্জি দিয়ে ধীরে ধীরে বৃত্ত আঁকুন', 'তারপর উল্টো দিকে ঘোরান'],
    },
  },
  {
    id: 'prayer-stretch',
    name: { en: 'Prayer Stretch', bn: 'নমস্কার ভঙ্গি' },
    bodyArea: 'wrist',
    reps: 'Hold 20 seconds',
    steps: {
      en: ['Press your palms together at chest height', 'Lower your hands, keeping palms touching', 'Feel the stretch in your forearms'],
      bn: ['বুকের কাছে দুই হাতের তালু মেলান', 'তালু লাগিয়ে রেখে হাত নিচে নামান', 'বাহুতে টান অনুভব করুন'],
    },
  },
  {
    id: 'focus-shift',
    name: { en: '20-20-20 Focus Shift', bn: '২০-২০-২০ দৃষ্টি বদল' },
    bodyArea: 'eyes',
    reps: 'Hold 20 seconds',
    steps: {
      en: ['Look away from the screen', 'Focus on something about 20 feet away', 'Hold your gaze for 20 seconds'],
      bn: ['স্ক্রিন থেকে চোখ সরান', '২০ ফুট দূরের কিছুতে তাকান', '২০ সেকেন্ড ধরে তাকিয়ে থাকুন'],
    },
  },
  {
    id: 'eye-palming',
    name: { en: 'Eye Palming', bn: 'চোখ ঢাকা' },
    bodyArea: 'eyes',
    reps: 'Hold 30 seconds',
    steps: {
      en: ['Rub your palms together until warm', 'Cup them gently over closed eyes', 'Breathe slowly in the darkness'],
      bn: ['দুই হাতের তালু ঘষে গরম করুন', 'বন্ধ চোখের উপর আলতো করে রাখুন', 'অন্ধকারে ধীরে শ্বাস নিন'],
    },
  },
  {
    id: 'calf-raise',
    name: { en: 'Standing Calf Raise', bn: 'পায়ের গোছা তোলা' },
    bodyArea: 'legs',
    reps: '15x',
    steps: {
      en: ['Stand up, hold a chair for balance', 'Rise onto your toes', 'Lower slowly back down'],
      bn: ['উঠে দাঁড়ান, ভারসাম্যের জন্য চেয়ার ধরুন', 'পায়ের আঙুলে ভর দিয়ে উঠুন', 'ধীরে ধীরে নামুন'],
    },
  },
  {
    id: 'hip-flexor',
    name: { en: 'Hip Flexor Stretch', bn: 'কোমর টান' },
    bodyArea: 'legs',
    reps: '20 seconds each side',
    steps: {
      en: ['Stand and step one foot far back', 'Bend your front knee, push hips forward', 'Hold 20 seconds, then switch legs'],
      bn: ['দাঁড়িয়ে এক পা অনেক পিছনে নিন', 'সামনের হাঁটু ভাঁজ করুন, কোমর সামনে ঠেলুন', '২০ সেকেন্ড ধরে রাখুন, তারপর পা বদলান'],
    },
  },
  {
    id: 'overhead-reach',
    name: { en: 'Overhead Reach & Side Bend', bn: 'উপরে হাত ও পাশে ঝোঁকা' },
    bodyArea: 'fullBody',
    reps: '5x each side',
    steps: {
      en: ['Stand and reach both arms overhead', 'Lean gently to the right', 'Hold 10 seconds, then to the left'],
      bn: ['দাঁড়িয়ে দুই হাত উপরে তুলুন', 'আলতো করে ডানে ঝুঁকুন', '১০ সেকেন্ড ধরে রাখুন, তারপর বামে'],
    },
  },
]
