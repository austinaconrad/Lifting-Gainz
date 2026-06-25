// ============================================================
//  IRON SQUAD — 12-Week Upper/Lower Split (4 days/week)
//  Goal: Muscle Gain | Equinox Master Trainer Protocol
// ============================================================

// ── PHASE DEFINITIONS ─────────────────────────────────────
export const PHASES = [
  {
    id: "foundation",
    name: "Foundation",
    weeks: [1, 4],
    label: "Weeks 1–4",
    description: "Master movement patterns. Build structural integrity. Prime the CNS. The biggest mistake beginners make is going heavy before they're ready — this phase fixes that.",
    focus: "Technique + Base Strength",
    repRange: "10–12",
    sets: "3",
    rpe: "6–7",
    progression: "+2.5–5 lbs per week on main lifts if form is perfect"
  },
  {
    id: "building",
    name: "Building",
    weeks: [5, 8],
    label: "Weeks 5–8",
    description: "Volume increases. Rep ranges tighten. You're earning the right to train hard — and you'll feel the difference by week 6.",
    focus: "Hypertrophy + Volume",
    repRange: "6–10",
    sets: "4",
    rpe: "7–8",
    progression: "+5 lbs per week on compounds, +2.5 on isolations"
  },
  {
    id: "peak",
    name: "Peak",
    weeks: [9, 12],
    label: "Weeks 9–12",
    description: "High intensity, strategic volume. Deload at week 11 or 12 based on fatigue. You'll finish this phase lifting weights you didn't think were possible 12 weeks ago.",
    focus: "Strength + Peak Performance",
    repRange: "4–8",
    sets: "4–5",
    rpe: "8–9",
    progression: "+5–10 lbs per week on compounds, aim for new PRs"
  }
];

// ── DELOAD PROTOCOL ───────────────────────────────────────
export const DELOAD = {
  weeks: [4, 8, 12],
  description: "Every 4th week: reduce volume by 40%, keep intensity. Same exercises, same weight — but drop to 2 sets per exercise and stop 2 reps short of failure. You're not getting weaker, you're supercompensating.",
  modifications: [
    "Cut to 2 sets per exercise (drop volume, not intensity)",
    "Stop 2 reps short of failure on every set",
    "Focus on perfect form and mind-muscle connection",
    "Add 10 minutes of extra mobility/stretching",
    "Sleep 8+ hours — this is where the gains actually happen"
  ]
};

// ── WARM-UP PROTOCOLS ─────────────────────────────────────
export const WARMUPS = {
  upper: {
    label: "Upper Body Warm-Up (8–10 min)",
    items: [
      "Band Pull-Aparts × 20 reps — activate posterior shoulder",
      "Wall Slides × 10 reps — thoracic extension + scap mobility",
      "Arm Circles (forward + backward) × 10 each direction",
      "Push-Up to Downward Dog × 8 reps — chest + shoulder prep",
      "Face Pull with band × 15 reps — external rotation pattern",
      "Barbell bar warm-up: 2×10 at 50% → 1×5 at 75% of working weight"
    ]
  },
  lower: {
    label: "Lower Body Warm-Up (8–10 min)",
    items: [
      "Hip Circles × 10 each direction — hip joint mobilization",
      "Leg Swings (front/back + lateral) × 10 each — dynamic hip flexor",
      "Bodyweight Squat to Stand × 10 reps — ankle/hip mobility",
      "Glute Bridge × 15 reps — glute activation before heavy loading",
      "Walking Lunges × 10 steps — hip flexor stretch + activation",
      "Barbell warm-up sets: 2×10 at 40%, 1×5 at 65% of working weight"
    ]
  }
};

// ── COOLDOWN / MOBILITY ───────────────────────────────────
export const COOLDOWNS = {
  upper: {
    label: "Upper Body Cooldown (5–7 min)",
    items: [
      "Doorway chest stretch — 2×30 sec each side",
      "Cross-body shoulder stretch — 2×30 sec each side",
      "Lat hang / dead hang — 2×30 sec (grip bar, relax shoulders)",
      "Neck side stretch — 30 sec each side",
      "Wrist circles and flexion/extension — 30 sec each"
    ]
  },
  lower: {
    label: "Lower Body Cooldown (5–7 min)",
    items: [
      "Hip flexor lunge stretch — 2×45 sec each side",
      "Seated hamstring stretch — 2×45 sec each side",
      "Figure-4 glute stretch (lying) — 45 sec each side",
      "Calf stretch against wall — 30 sec each side",
      "Supine spinal twist — 30 sec each side"
    ]
  }
};

// ── CARDIO PROTOCOL ───────────────────────────────────────
export const CARDIO = {
  type: "LISS (Low Intensity Steady State)",
  frequency: "2–3 days/week, on rest days or post-workout",
  duration: "25–40 minutes",
  options: ["Incline treadmill walk", "Stationary bike", "Stair climber", "Swimming"],
  timing: "Always AFTER weights if done same day — never before. Prefer separate sessions.",
  heartRate: "Zone 2 (60–70% max HR). You should be able to hold a conversation.",
  note: "Cardio is for recovery and heart health — not fat loss. The weights create the muscle. The nutrition creates the body composition. Don't over-cardio when your goal is muscle gain."
};

// ── PROGRESSIVE OVERLOAD PLAN ─────────────────────────────
export const OVERLOAD = {
  rules: [
    { label: "Double progression", detail: "Complete all prescribed reps at current weight → add weight next session. Never skip ahead." },
    { label: "Compound lifts", detail: "Add 5 lbs when you hit the top of your rep range for all sets with clean form." },
    { label: "Isolation lifts", detail: "Add 2.5 lbs when you hit the top of your rep range for all sets." },
    { label: "Failed reps", detail: "If you miss reps, stay at the same weight next session. Perfect form always wins." },
    { label: "Deload trigger", detail: "If you fail the same weight 2 sessions in a row, take a deload week." }
  ]
};

// ── EXERCISE DATABASE ─────────────────────────────────────
// Sets/reps encoded as [phase1, phase2, phase3]
// format: "sets×reps" or "sets×rep_range"

export const EXERCISES = {
  // UPPER A — Strength Focus (Push + Pull heavy compounds)
  upperA: [
    {
      id: "bench_press",
      name: "Barbell Bench Press",
      category: "Push — Chest (Primary)",
      prescription: { foundation: "3×8–10", building: "4×6–8", peak: "5×4–6" },
      rest: { foundation: "90s", building: "2–3 min", peak: "3–4 min" },
      tempo: "3-0-1-0 (3 sec down, explode up)",
      tip: "Retract scapulae before unracking. Drive feet into the floor. The bar should touch your lower chest — not your neck.",
      coachNote: "Foundation phase: focus on the arch and leg drive. Building phase: feel the pec stretch at the bottom. Peak phase: compete with yourself."
    },
    {
      id: "barbell_row",
      name: "Barbell Bent-Over Row",
      category: "Pull — Back (Primary)",
      prescription: { foundation: "3×8–10", building: "4×6–8", peak: "4×5–6" },
      rest: { foundation: "90s", building: "2 min", peak: "2–3 min" },
      tempo: "2-0-1-1 (pull explosively, 1 sec squeeze, 2 sec lower)",
      tip: "Hinge at 45°, not 90°. Pull to your lower stomach. Every rep starts dead on the floor — no bouncing.",
      coachNote: "Think 'elbows to hips' not 'hands to chest.' This cue alone will transform your lat engagement."
    },
    {
      id: "ohp",
      name: "Barbell Overhead Press",
      category: "Push — Shoulders (Primary)",
      prescription: { foundation: "3×8–10", building: "3×6–8", peak: "4×5–6" },
      rest: { foundation: "90s", building: "2 min", peak: "2–3 min" },
      tempo: "2-0-1-0",
      tip: "Brace your abs hard. Keep elbows slightly in front of the bar. Lock out fully at the top.",
      coachNote: "OHP is the ultimate shoulder builder — but it's also unforgiving to ego. Drop the weight and learn the pattern first."
    },
    {
      id: "lat_pulldown",
      name: "Lat Pulldown (Overhand Wide)",
      category: "Pull — Lats",
      prescription: { foundation: "3×10–12", building: "4×8–10", peak: "4×8–10" },
      rest: { foundation: "75s", building: "90s", peak: "90s" },
      tempo: "2-0-1-1",
      tip: "Lead with your elbows, not your hands. Pull to your upper chest. Slight lean back is fine.",
      coachNote: "Squeeze your lats at the bottom like you're trying to put your shoulder blades in your back pockets."
    },
    {
      id: "incline_db_press",
      name: "Incline Dumbbell Press",
      category: "Push — Upper Chest",
      prescription: { foundation: "3×10–12", building: "3×10–12", peak: "4×8–10" },
      rest: { foundation: "75s", building: "75s", peak: "90s" },
      tempo: "3-0-1-0",
      tip: "30–45° incline max. Higher than that and it becomes a shoulder press. Full stretch at the bottom.",
      coachNote: "Upper chest is the most neglected part of the chest. This exercise builds the 'shelf' look."
    },
    {
      id: "face_pulls",
      name: "Cable Face Pulls",
      category: "Rear Delts + Rotator Cuff",
      prescription: { foundation: "3×15–20", building: "3×15–20", peak: "4×15–20" },
      rest: { foundation: "60s", building: "60s", peak: "60s" },
      tempo: "2-1-1-0",
      tip: "Rope to forehead. External rotate at the top. This is a HEALTH exercise — don't ego lift it.",
      coachNote: "Do these every single upper day for your entire lifting career. They prevent shoulder impingement and balance all the pressing you do."
    },
    {
      id: "tricep_pushdown",
      name: "Tricep Rope Pushdown",
      category: "Triceps (Isolation)",
      prescription: { foundation: "3×12–15", building: "3×10–12", peak: "3×10–12" },
      rest: { foundation: "60s", building: "60s", peak: "60s" },
      tempo: "2-0-1-1",
      tip: "Elbows pinned to sides. Spread the rope at the bottom. Full extension at lockout.",
      coachNote: "Triceps are 2/3 of your arm. Don't skip these."
    },
    {
      id: "barbell_curl",
      name: "Barbell Curl",
      category: "Biceps (Isolation)",
      prescription: { foundation: "3×12–15", building: "3×10–12", peak: "3×10–12" },
      rest: { foundation: "60s", building: "60s", peak: "60s" },
      tempo: "2-0-1-1",
      tip: "Don't swing. Full range of motion — dead hang at the bottom, squeeze at the top.",
      coachNote: "Supinate (rotate palms out) at the top for maximum bicep peak contraction."
    }
  ],

  // LOWER A — Squat Focus (Quad dominant + posterior chain)
  lowerA: [
    {
      id: "back_squat",
      name: "Barbell Back Squat",
      category: "Quads + Glutes (Primary)",
      prescription: { foundation: "3×8–10", building: "4×6–8", peak: "5×4–6" },
      rest: { foundation: "2 min", building: "3 min", peak: "3–4 min" },
      tempo: "3-0-1-0 (3 sec down, drive up fast)",
      tip: "Feet shoulder-width, toes 15–30° out. Break at hips AND knees simultaneously. Go to parallel minimum.",
      coachNote: "The squat is king. Nothing builds an athletic physique like heavy squats done consistently for 12 weeks. Protect the movement — never rush progression."
    },
    {
      id: "rdl",
      name: "Romanian Deadlift",
      category: "Hamstrings + Glutes",
      prescription: { foundation: "3×10–12", building: "4×8–10", peak: "4×8–10" },
      rest: { foundation: "90s", building: "2 min", peak: "2 min" },
      tempo: "3-1-1-0 (slow eccentric, feel the stretch)",
      tip: "Push hips back, not down. Bar stays dragging your legs. Feel a deep hamstring stretch before reversing.",
      coachNote: "The RDL is the single best hamstring mass builder when loaded correctly. If you don't feel your hamstrings, you're squatting — not hinging."
    },
    {
      id: "leg_press",
      name: "Leg Press",
      category: "Quads + Glutes (Accessory)",
      prescription: { foundation: "3×12–15", building: "4×10–12", peak: "4×10–12" },
      rest: { foundation: "90s", building: "90s", peak: "90s" },
      tempo: "2-0-1-0",
      tip: "Full range — bring knees close to chest. Don't lock out the knees at the top. High foot placement = more glutes.",
      coachNote: "Your squat weight will feel lighter after leg press. Load this up — it's a safe way to add quad volume."
    },
    {
      id: "bulgarian",
      name: "Bulgarian Split Squat",
      category: "Quads + Glutes (Unilateral)",
      prescription: { foundation: "3×10–12 each", building: "3×10–12 each", peak: "4×8–10 each" },
      rest: { foundation: "90s", building: "90s", peak: "90s" },
      tempo: "3-0-1-0",
      tip: "Back foot on bench, front foot far enough forward that your shin is vertical at the bottom. Sink straight down.",
      coachNote: "These are brutal. That's why they work. They fix every asymmetry your bilateral squats are hiding."
    },
    {
      id: "leg_extension",
      name: "Leg Extension",
      category: "Quads (Isolation)",
      prescription: { foundation: "3×15–20", building: "3×12–15", peak: "3×12–15" },
      rest: { foundation: "60s", building: "60s", peak: "60s" },
      tempo: "2-1-1-0",
      tip: "Don't use momentum. Pause at top. Full extension. This is for the lower quad sweep.",
      coachNote: "Always do these AFTER your compound lifts — never before. Pre-fatiguing the quads before squats is a recipe for injury."
    },
    {
      id: "leg_curl",
      name: "Seated Leg Curl",
      category: "Hamstrings (Isolation)",
      prescription: { foundation: "3×12–15", building: "3×12–15", peak: "3×10–12" },
      rest: { foundation: "60s", building: "60s", peak: "60s" },
      tempo: "2-1-1-0",
      tip: "Seated curl hits the hamstring at a stretched position — better than lying curl for hypertrophy.",
      coachNote: "Pair with RDL for a complete hamstring stimulus — RDL trains the stretch, curl trains the contraction."
    },
    {
      id: "calf_raise_seated",
      name: "Seated Calf Raises",
      category: "Calves — Soleus",
      prescription: { foundation: "4×15–20", building: "4×15–20", peak: "4×15–20" },
      rest: { foundation: "60s", building: "60s", peak: "60s" },
      tempo: "2-2-1-0 (2 sec up, 2 sec hold, 2 sec down)",
      tip: "Full range — all the way down to feel the stretch. Bounce-reps do nothing.",
      coachNote: "Calves respond to high volume and slow tempos. Most people never stretch them properly — that's why their calves don't grow."
    }
  ],

  // UPPER B — Hypertrophy Focus (higher volume, more angles)
  upperB: [
    {
      id: "incline_barbell",
      name: "Incline Barbell Press",
      category: "Push — Upper Chest (Primary)",
      prescription: { foundation: "3×10–12", building: "4×8–10", peak: "4×6–8" },
      rest: { foundation: "90s", building: "2 min", peak: "2 min" },
      tempo: "3-0-1-0",
      tip: "30° incline. Touch upper chest. Shoulder blades pinched together the whole set.",
      coachNote: "Upper chest is what separates a developed chest from a flat one. Treat this like a primary movement."
    },
    {
      id: "cable_row",
      name: "Seated Cable Row (Close Grip)",
      category: "Pull — Mid Back + Lats",
      prescription: { foundation: "3×10–12", building: "4×10–12", peak: "4×8–10" },
      rest: { foundation: "75s", building: "90s", peak: "90s" },
      tempo: "2-1-1-1",
      tip: "Sit tall, slight forward lean, pull to belly button. 1 second squeeze. Don't pull your torso back.",
      coachNote: "Cable rows build the 'thickness' of your back. Barbell rows build width. You need both."
    },
    {
      id: "arnold_press",
      name: "Arnold Press",
      category: "Push — Full Deltoid",
      prescription: { foundation: "3×10–12", building: "3×10–12", peak: "4×8–10" },
      rest: { foundation: "75s", building: "75s", peak: "90s" },
      tempo: "2-0-2-0",
      tip: "Start with palms facing you, rotate out as you press. Hits all 3 heads of the deltoid.",
      coachNote: "Named after Arnold Schwarzenegger for a reason. Complete shoulder developer."
    },
    {
      id: "pullups",
      name: "Pull-Ups / Assisted Pull-Ups",
      category: "Pull — Lats + Biceps",
      prescription: { foundation: "3×6–10", building: "4×6–10", peak: "4×8–12" },
      rest: { foundation: "90s", building: "90s", peak: "90s" },
      tempo: "2-0-1-1",
      tip: "Dead hang start. Pull elbows to hips. Chin over bar. Use assistance band until you can do 8 clean.",
      coachNote: "Pull-ups are the ultimate test of relative strength. Chase them. They'll build your lats faster than any machine."
    },
    {
      id: "pec_deck",
      name: "Pec Deck / Cable Fly",
      category: "Push — Chest (Isolation)",
      prescription: { foundation: "3×12–15", building: "3×12–15", peak: "4×12–15" },
      rest: { foundation: "60s", building: "60s", peak: "60s" },
      tempo: "2-1-2-0",
      tip: "Feel the stretch. Don't slam the weight together — control the whole movement.",
      coachNote: "This is a detail exercise — it builds the inner chest and the 'squeeze' feeling. Never substitute it for pressing."
    },
    {
      id: "rear_delt_fly",
      name: "Rear Delt Cable Fly",
      category: "Rear Delts (Isolation)",
      prescription: { foundation: "3×15–20", building: "3×15–20", peak: "4×15–20" },
      rest: { foundation: "60s", building: "60s", peak: "60s" },
      tempo: "2-1-1-0",
      tip: "Light weight. Arms almost straight. Lead with elbows.",
      coachNote: "Rear delts are the most undertrained muscle in the gym. They're also what makes your upper back look 3D."
    },
    {
      id: "skull_crushers",
      name: "EZ-Bar Skull Crushers",
      category: "Triceps (Long Head)",
      prescription: { foundation: "3×12–15", building: "3×10–12", peak: "4×10–12" },
      rest: { foundation: "60s", building: "75s", peak: "75s" },
      tempo: "3-0-1-0",
      tip: "Elbows point at the ceiling — don't flare them out. Lower to forehead, not behind head.",
      coachNote: "Best long-head tricep builder. The long head = most of your tricep mass. Do these every Upper B."
    },
    {
      id: "hammer_curls",
      name: "Dumbbell Hammer Curls",
      category: "Biceps + Brachialis",
      prescription: { foundation: "3×12–15", building: "3×12–15", peak: "3×10–12" },
      rest: { foundation: "60s", building: "60s", peak: "60s" },
      tempo: "2-0-1-1",
      tip: "Neutral grip. Alternate sides. Full extension at the bottom.",
      coachNote: "Hammer curls build the brachialis — the muscle that pushes the bicep up and makes your arms look bigger from every angle."
    }
  ],

  // LOWER B — Hinge Focus (Deadlift + hip dominant)
  lowerB: [
    {
      id: "deadlift",
      name: "Conventional Deadlift",
      category: "Full Posterior Chain (Primary)",
      prescription: { foundation: "3×6–8", building: "4×5–6", peak: "5×3–5" },
      rest: { foundation: "2–3 min", building: "3–4 min", peak: "4–5 min" },
      tempo: "1-0-3-0 (pull explosively, control the descent)",
      tip: "Bar over mid-foot. Hips hinge, lats tight, chest up. Push the floor away — don't pull the bar up.",
      coachNote: "The deadlift is the most powerful muscle-building movement in existence. Treat it with respect. Warm up properly. Every rep should look like a PR attempt."
    },
    {
      id: "front_squat",
      name: "Front Squat / Goblet Squat",
      category: "Quads + Core (Accessory)",
      prescription: { foundation: "3×10–12", building: "3×8–10", peak: "3×8–10" },
      rest: { foundation: "90s", building: "2 min", peak: "2 min" },
      tempo: "3-0-1-0",
      tip: "Beginner: goblet squat with dumbbell. More advanced: front squat with bar. Keep torso upright.",
      coachNote: "Front loading = more quad, more core, more upright torso. Perfect complement to the hinge-dominant deadlift."
    },
    {
      id: "hip_thrust",
      name: "Barbell Hip Thrust",
      category: "Glutes (Primary)",
      prescription: { foundation: "3×12–15", building: "4×10–12", peak: "4×10–12" },
      rest: { foundation: "75s", building: "90s", peak: "90s" },
      tempo: "2-1-2-0",
      tip: "Bench at shoulder blades. Drive hips to full extension. Squeeze glutes HARD at top — don't hyperextend the low back.",
      coachNote: "Deadlifts build the glutes. Hip thrusts sculpt them. You need both. This is the #1 glute hypertrophy exercise."
    },
    {
      id: "walking_lunges",
      name: "Dumbbell Walking Lunges",
      category: "Quads + Glutes (Unilateral)",
      prescription: { foundation: "3×12 each", building: "3×12 each", peak: "4×12 each" },
      rest: { foundation: "75s", building: "75s", peak: "90s" },
      tempo: "2-0-1-0",
      tip: "Long stride. Front shin vertical. Back knee kisses the floor. Keep torso upright.",
      coachNote: "Walking lunges on Lower B + Bulgarian split squats on Lower A = unilateral training 2x/week. This is what separates balanced athletes from lopsided gym-goers."
    },
    {
      id: "nordic_curl",
      name: "Nordic Curl / Leg Curl",
      category: "Hamstrings (Eccentric Focus)",
      prescription: { foundation: "3×8–10", building: "3×8–10", peak: "4×8–10" },
      rest: { foundation: "75s", building: "75s", peak: "90s" },
      tempo: "4-0-1-0 (4 sec eccentric)",
      tip: "Nordic: partner holds ankles, lower yourself slowly. Lying curl: if no Nordic available.",
      coachNote: "Eccentric hamstring work is the single best injury prevention exercise for the legs. NFL teams use Nordic curls to slash hamstring tear rates by 70%."
    },
    {
      id: "standing_calf",
      name: "Standing Calf Raises",
      category: "Calves — Gastrocnemius",
      prescription: { foundation: "4×15–20", building: "4×15–20", peak: "4×15–20" },
      rest: { foundation: "60s", building: "60s", peak: "60s" },
      tempo: "2-2-2-0",
      tip: "Toes on a step for full range of motion. All the way down. All the way up.",
      coachNote: "The gastrocnemius (standing calf) needs heavy load and full stretch. The soleus (seated calf) needs slow tempo and contraction. Train both."
    }
  ]
};

// ── WORKOUT SCHEDULE (7-day cycle) ───────────────────────
// Index: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
export const WEEKLY_SCHEDULE = [
  { day: "Monday",    type: "upperA", label: "Upper A — Strength",    restDay: false },
  { day: "Tuesday",   type: "lowerA", label: "Lower A — Squat",       restDay: false },
  { day: "Wednesday", type: "rest",   label: "Active Recovery",       restDay: true  },
  { day: "Thursday",  type: "upperB", label: "Upper B — Hypertrophy", restDay: false },
  { day: "Friday",    type: "lowerB", label: "Lower B — Hinge",       restDay: false },
  { day: "Saturday",  type: "rest",   label: "Rest + Cardio (Optional)", restDay: true },
  { day: "Sunday",    type: "rest",   label: "Full Recovery",         restDay: true  }
];

// ── HELPER: Get phase for week number ────────────────────
export function getPhaseForWeek(week) {
  if (week <= 4) return PHASES[0];
  if (week <= 8) return PHASES[1];
  return PHASES[2];
}

// ── HELPER: Is this a deload week? ───────────────────────
export function isDeloadWeek(week) {
  return DELOAD.weeks.includes(week);
}

// ── HELPER: Get exercises for a workout type ─────────────
export function getExercisesForWorkout(type) {
  switch(type) {
    case 'upperA': return EXERCISES.upperA;
    case 'lowerA': return EXERCISES.lowerA;
    case 'upperB': return EXERCISES.upperB;
    case 'lowerB': return EXERCISES.lowerB;
    default: return [];
  }
}

// ── HELPER: Get warmup for workout type ──────────────────
export function getWarmupForWorkout(type) {
  if (type.startsWith('upper')) return WARMUPS.upper;
  return WARMUPS.lower;
}

// ── HELPER: Get cooldown for workout type ────────────────
export function getCooldownForWorkout(type) {
  if (type.startsWith('upper')) return COOLDOWNS.upper;
  return COOLDOWNS.lower;
}

// ── HELPER: Get today's workout based on program start ───
export function getTodaysWorkout(programStartDate) {
  const start = new Date(programStartDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  if (daysSinceStart < 0) return null;

  const weekNumber = Math.floor(daysSinceStart / 7) + 1;
  const dayOfWeek  = daysSinceStart % 7;

  const schedule   = WEEKLY_SCHEDULE[dayOfWeek];
  const phase      = getPhaseForWeek(weekNumber);
  const deload     = isDeloadWeek(weekNumber);

  return {
    weekNumber,
    dayOfWeek,
    schedule,
    phase,
    deload,
    exercises: schedule.restDay ? [] : getExercisesForWorkout(schedule.type),
    warmup:    schedule.restDay ? null : getWarmupForWorkout(schedule.type),
    cooldown:  schedule.restDay ? null : getCooldownForWorkout(schedule.type)
  };
}

// Expose globally for non-module use
window.PROGRAM = {
  PHASES, DELOAD, WARMUPS, COOLDOWNS, CARDIO, OVERLOAD,
  EXERCISES, WEEKLY_SCHEDULE,
  getPhaseForWeek, isDeloadWeek, getExercisesForWorkout,
  getWarmupForWorkout, getCooldownForWorkout, getTodaysWorkout
};
