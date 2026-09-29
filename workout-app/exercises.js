/* Lift Log exercise library: what each move is, how to do it, and its animation.
   LIB[key]  = { name, g: group, eq: equipment, works, steps[], tip, easier?: key of a gentler move }
   FIG[key]  = the animated figure (see the engine at the bottom). */

const GROUPS = ["Glutes & legs", "Upper body", "Core", "Cardio"];

const LIB = {
  /* ---------- Glutes & legs ---------- */
  hipthrust: { name: "Hip thrust", g: "Glutes & legs", eq: "Barbell + bench", works: "Glutes, hamstrings", easier: "gluebridge", steps: [
    "Sit on the floor with your upper back against the long edge of a bench. Roll the bar over your hips (use a bar pad).",
    "Feet flat and about hip-width apart, far enough out that your shins are upright at the top.",
    "Drive through your heels and push your hips up until your body is flat from shoulders to knees.",
    "Squeeze your glutes for a second at the top, then lower with control."],
    tip: "Keep your chin tucked and ribs down. Don't arch your lower back to get higher." },
  gluebridge: { name: "Glute bridge", g: "Glutes & legs", eq: "None (add a dumbbell later)", works: "Glutes, hamstrings", steps: [
    "Lie on your back, knees bent, feet flat and close to your bum.",
    "Push through your heels and lift your hips until your body is straight from shoulders to knees.",
    "Squeeze your glutes for a second, then lower slowly."],
    tip: "A great first glute exercise. When 15 reps feel easy, rest a dumbbell on your hips." },
  rdl: { name: "Romanian deadlift", g: "Glutes & legs", eq: "Barbell or dumbbells", works: "Hamstrings, glutes, lower back", easier: "pullthrough", steps: [
    "Stand tall holding the bar at your thighs, hands just outside your legs, feet hip-width apart.",
    "Soften your knees slightly and keep them at that bend the whole time.",
    "Push your hips back and let the bar slide down your thighs with a flat back, until you feel a strong stretch in your hamstrings (usually just below the knee).",
    "Drive your hips forward to stand back up, squeezing your glutes at the top."],
    tip: "Keep the bar touching your legs all the way down. It's a hip hinge, not a squat." },
  slrdl: { name: "Single-leg Romanian deadlift", g: "Glutes & legs", eq: "Dumbbell", works: "Hamstrings, glutes, balance", easier: "rdl", steps: [
    "Stand on one leg with a dumbbell in the opposite hand, standing knee slightly soft.",
    "Hinge forward from your hip while your free leg goes straight back behind you.",
    "Lower until your body is nearly level with the floor or you feel a hamstring stretch.",
    "Squeeze your glute to stand back up. Do all reps, then swap legs."],
    tip: "Hold a wall or rack with your free hand until your balance improves." },
  deadlift: { name: "Deadlift", g: "Glutes & legs", eq: "Barbell", works: "Glutes, hamstrings, back, grip", easier: "kbdeadlift", steps: [
    "Stand with the bar over the middle of your feet, feet hip-width apart.",
    "Bend down and grip the bar just outside your legs. Push your hips back, chest up, back flat.",
    "Take a breath, brace your stomach and push the floor away to stand up, keeping the bar against your legs.",
    "Lower it the same way: hips back first, then bend your knees once it passes them."],
    tip: "Learn this with a coach or a light bar first. A flat back matters more than the weight." },
  kbdeadlift: { name: "Kettlebell deadlift", g: "Glutes & legs", eq: "Kettlebell", works: "Glutes, hamstrings", steps: [
    "Stand with a kettlebell on the floor between your feet.",
    "Push your hips back and bend your knees to grab the handle with both hands, back flat.",
    "Stand up tall by driving your hips forward.",
    "Lower it back to the floor the same way."],
    tip: "The best way to learn the deadlift movement before using a barbell." },
  goodmorning: { name: "Good morning", g: "Glutes & legs", eq: "Barbell", works: "Hamstrings, glutes, lower back", easier: "rdl", steps: [
    "Rest a light bar across your upper back like a squat, feet hip-width apart.",
    "Soften your knees and push your hips back, bending forward with a flat back.",
    "Stop when you feel a hamstring stretch or your body is nearly level with the floor.",
    "Drive your hips forward to stand up."],
    tip: "Start very light. This is a stretch-and-control exercise, not a heavy one." },
  squat: { name: "Back squat", g: "Glutes & legs", eq: "Barbell + rack", works: "Quads, glutes", easier: "gobletsquat", steps: [
    "Set the bar at shoulder height in the rack. Step under it so it rests across your upper back, not your neck.",
    "Stand with feet shoulder-width apart, toes turned out a little.",
    "Take a breath, brace your stomach, then sit down and back until your thighs are at least level with the floor.",
    "Drive up through your whole foot to stand."],
    tip: "Knees go the same way as your toes. Keep your chest up and heels down. Set the safety bars in case you need to drop the bar." },
  gobletsquat: { name: "Goblet squat", g: "Glutes & legs", eq: "Dumbbell or kettlebell", works: "Quads, glutes", easier: "boxsquat", steps: [
    "Hold a dumbbell upright against your chest with both hands.",
    "Stand with feet a little wider than your hips, toes slightly out.",
    "Sit down between your heels, keeping your chest tall, until your elbows reach your knees.",
    "Push through your whole foot to stand back up."],
    tip: "The best squat to learn first. The weight at the front helps you stay upright." },
  boxsquat: { name: "Box squat", g: "Glutes & legs", eq: "Bench or box", works: "Quads, glutes", steps: [
    "Stand in front of a bench, feet shoulder-width apart, arms out in front for balance.",
    "Sit back slowly until your bum lightly touches the bench.",
    "Without relaxing, push through your feet and stand back up."],
    tip: "Perfect for complete beginners. Use a lower seat as you get stronger." },
  sumosquat: { name: "Sumo squat", g: "Glutes & legs", eq: "Dumbbell or kettlebell", works: "Glutes, inner thighs, quads", easier: "boxsquat", steps: [
    "Stand with feet wide and toes turned out, holding one dumbbell hanging between your legs.",
    "Keep your chest up and sit straight down, knees pushing out over your toes.",
    "Go as low as feels comfortable, then push back up and squeeze your glutes."],
    tip: "Keep your knees pointing the same way as your toes the whole time." },
  wallsit: { name: "Wall sit", g: "Glutes & legs", eq: "A wall", works: "Quads", steps: [
    "Lean your back flat against a wall and walk your feet out.",
    "Slide down until your knees are bent to about 90°, knees over ankles.",
    "Hold, breathing normally."],
    tip: "Start with 20 seconds. Sit a little higher to make it easier." },
  jumpsquat: { name: "Jump squat", g: "Glutes & legs", eq: "None", works: "Quads, glutes, fitness", easier: "boxsquat", steps: [
    "Stand with feet shoulder-width apart.",
    "Squat down, swinging your arms back.",
    "Jump up explosively, swinging your arms up.",
    "Land softly with bent knees and go straight into the next squat."],
    tip: "Land quietly, like a cat. Skip this if your knees or pelvic floor don't like jumping." },
  legpress: { name: "Leg press", g: "Glutes & legs", eq: "Leg press machine", works: "Quads, glutes", steps: [
    "Sit back in the seat and put your feet hip-width apart in the middle of the platform.",
    "Push the platform up a little and release the safety handles.",
    "Lower it until your knees are bent to about 90°, keeping your lower back on the pad.",
    "Press back up without locking your knees straight."],
    tip: "Feet higher on the platform works your glutes more; lower works your quads more." },
  legext: { name: "Leg extension", g: "Glutes & legs", eq: "Leg extension machine", works: "Quads", steps: [
    "Sit with your back against the pad and the roller on the front of your lower shins.",
    "Line your knees up with the machine's pivot point.",
    "Straighten your legs all the way and squeeze your thighs.",
    "Lower slowly."],
    tip: "Hold the handles to keep your bum on the seat." },
  legcurl: { name: "Seated leg curl", g: "Glutes & legs", eq: "Leg curl machine", works: "Hamstrings", steps: [
    "Set the machine so your knees line up with its pivot point and the pad sits just above your heels.",
    "Hold the handles and keep your hips pressed into the seat.",
    "Curl your heels down and back as far as you can.",
    "Let the weight back slowly, taking 2 to 3 seconds."],
    tip: "Don't let the weight drop. The slow way back is where a lot of the work happens." },
  lyingcurl: { name: "Lying leg curl", g: "Glutes & legs", eq: "Lying leg curl machine", works: "Hamstrings", steps: [
    "Lie face down with the pad just above your heels and your knees just off the end of the bench.",
    "Hold the handles and keep your hips pressed down.",
    "Curl your heels towards your bum.",
    "Lower slowly."],
    tip: "If your hips lift off the bench, the weight is too heavy." },
  walklunge: { name: "Walking lunge", g: "Glutes & legs", eq: "Dumbbells (optional)", works: "Quads, glutes", easier: "revlunge", steps: [
    "Stand tall with a dumbbell in each hand at your sides.",
    "Take a long step forward and lower until your back knee almost touches the floor.",
    "Push through your front heel and bring your back foot through into the next step.",
    "Keep walking, alternating legs."],
    tip: "Keep your chest up and your front knee in line with your toes." },
  revlunge: { name: "Reverse lunge", g: "Glutes & legs", eq: "Dumbbells (optional)", works: "Glutes, quads", steps: [
    "Stand tall with a dumbbell in each hand at your sides.",
    "Take a big step backwards and lower until your back knee almost touches the floor.",
    "Push through your front heel to bring your back foot in and stand up.",
    "Alternate legs."],
    tip: "Easier on the knees than walking lunges. Start with bodyweight and hold a wall if you wobble." },
  bss: { name: "Bulgarian split squat", g: "Glutes & legs", eq: "Bench (+ dumbbells)", works: "Glutes, quads", easier: "revlunge", steps: [
    "Stand a big stride in front of a bench and rest the top of your back foot on it.",
    "Keep most of your weight on your front foot.",
    "Lower straight down until your front thigh is about level with the floor.",
    "Push through your front heel to come back up. Do all your reps, then swap legs."],
    tip: "Leaning your chest forward a little works the glutes more. Hold dumbbells once bodyweight gets easy." },
  stepup: { name: "Step-up", g: "Glutes & legs", eq: "Box or bench (+ dumbbells)", works: "Glutes, quads", steps: [
    "Stand facing a sturdy box or bench and put one whole foot on it.",
    "Push through that heel to step up, bringing your other foot up beside it.",
    "Step back down slowly with the same leg you finished with.",
    "Do all reps on one leg, then swap."],
    tip: "A lower step is easier. Try not to push off with the back foot." },
  kickback: { name: "Cable glute kickback", g: "Glutes & legs", eq: "Cable machine + ankle strap", works: "Glutes", easier: "donkeykick", steps: [
    "Clip an ankle strap to the low cable and put it on one ankle.",
    "Face the machine, hold it for balance and lean forward slightly from your hips.",
    "Keeping your leg almost straight, kick it back and up by squeezing your glute.",
    "Pause at the top, then return slowly. Do all your reps, then swap legs."],
    tip: "Stop before your lower back arches. The movement comes from your hip, not your back." },
  donkeykick: { name: "Donkey kick", g: "Glutes & legs", eq: "None (mat)", works: "Glutes", steps: [
    "Start on hands and knees, hands under shoulders, knees under hips.",
    "Keeping your knee bent at 90°, lift one leg until your thigh is level with your body, sole of your foot towards the ceiling.",
    "Squeeze your glute at the top, then lower without resting.",
    "Do all reps, then swap legs."],
    tip: "Keep your back flat like a table. Add an ankle weight or band when it gets easy." },
  pullthrough: { name: "Cable pull-through", g: "Glutes & legs", eq: "Cable machine + rope", works: "Glutes, hamstrings", steps: [
    "Clip a rope to the low cable. Stand facing away from the machine and hold the rope between your legs.",
    "Walk forward a couple of steps, feet a little wider than hips.",
    "Push your hips back and let the rope pull your hands back between your legs, back flat.",
    "Drive your hips forward to stand tall and squeeze your glutes."],
    tip: "A great way to learn the hip hinge before Romanian deadlifts." },
  kbswing: { name: "Kettlebell swing", g: "Glutes & legs", eq: "Kettlebell", works: "Glutes, hamstrings, fitness", easier: "kbdeadlift", steps: [
    "Stand with feet a little wider than hips, kettlebell held in both hands.",
    "Hinge at your hips and swing the bell back between your legs.",
    "Snap your hips forward hard so the bell floats up to chest height.",
    "Let it swing back down and go straight into the next rep."],
    tip: "Your hips do the work, not your arms. Master the kettlebell deadlift first." },
  calfraise: { name: "Calf raise", g: "Glutes & legs", eq: "None (or a step + dumbbell)", works: "Calves", steps: [
    "Stand tall, feet hip-width apart, holding something for balance.",
    "Rise up onto the balls of your feet as high as you can.",
    "Pause, then lower slowly."],
    tip: "Standing on a step with your heels hanging off gives a bigger stretch." },
  abduction: { name: "Hip abduction machine", g: "Glutes & legs", eq: "Hip abduction machine", works: "Outer glutes (glute medius)", steps: [
    "Sit with your back against the pad and the pads on the outside of your knees.",
    "Push your knees out as wide as you can.",
    "Hold for a second, then let them come back together slowly."],
    tip: "Leaning forward slightly from your hips puts more of the work on your glutes." },
  adduction: { name: "Hip adduction machine", g: "Glutes & legs", eq: "Hip adduction machine", works: "Inner thighs", steps: [
    "Sit with your back against the pad and the pads on the inside of your knees.",
    "Squeeze your knees together.",
    "Let them open back out slowly."],
    tip: "Start with the legs only a little apart until you're used to the stretch." },
  bandwalk: { name: "Banded side walk", g: "Glutes & legs", eq: "Mini resistance band", works: "Outer glutes", steps: [
    "Put a mini band just above your knees or around your ankles.",
    "Bend your knees slightly into a quarter squat.",
    "Step sideways, keeping tension on the band, for 10 to 15 steps.",
    "Walk back the other way."],
    tip: "Great as a warm-up before glute days." },

  /* ---------- Upper body ---------- */
  pushup: { name: "Push-up", g: "Upper body", eq: "None", works: "Chest, shoulders, triceps, core", easier: "kneepushup", steps: [
    "Hands a little wider than your shoulders, body straight from head to heels.",
    "Bend your elbows to lower your chest towards the floor, elbows angled slightly back.",
    "Push the floor away to come back up."],
    tip: "If you can't do 5 with good form, start on your knees or with hands on a bench." },
  kneepushup: { name: "Knee push-up", g: "Upper body", eq: "None (mat)", works: "Chest, shoulders, triceps", steps: [
    "Start on your hands and knees, then walk your hands forward so your body is straight from head to knees.",
    "Lower your chest towards the floor.",
    "Push back up."],
    tip: "Keep your hips in line. Don't stick your bum in the air." },
  benchpress: { name: "Bench press", g: "Upper body", eq: "Barbell or dumbbells + bench", works: "Chest, shoulders, triceps", easier: "pushup", steps: [
    "Lie on the bench with your eyes under the bar and feet flat on the floor.",
    "Grip the bar a little wider than your shoulders and lift it off the rack.",
    "Lower it slowly to the middle of your chest.",
    "Press it back up until your arms are straight."],
    tip: "Use dumbbells or ask someone to spot you until you're confident." },
  shoulderpress: { name: "Dumbbell shoulder press", g: "Upper body", eq: "Dumbbells + bench", works: "Shoulders, triceps", steps: [
    "Sit on an upright bench with a dumbbell in each hand at shoulder height, palms facing forward.",
    "Press the dumbbells up until your arms are straight above you.",
    "Lower them slowly back to shoulder height."],
    tip: "Keep your back against the pad and don't arch it to push the weight up." },
  lateralraise: { name: "Lateral raise", g: "Upper body", eq: "Dumbbells", works: "Side of the shoulders", steps: [
    "Stand with a light dumbbell in each hand at your sides.",
    "With a slight bend in your elbows, raise your arms out to the sides until they're level with your shoulders.",
    "Lower slowly."],
    tip: "Go light. 2 to 5 kg is plenty for most people starting out." },
  frontraise: { name: "Front raise", g: "Upper body", eq: "Dumbbells", works: "Front of the shoulders", steps: [
    "Stand with a light dumbbell in each hand in front of your thighs.",
    "Raise your arms straight in front of you to shoulder height.",
    "Lower slowly."],
    tip: "Don't swing. If you have to lean back, the weight is too heavy." },
  curl: { name: "Bicep curl", g: "Upper body", eq: "Dumbbells", works: "Biceps", steps: [
    "Stand with a dumbbell in each hand, palms facing forward.",
    "Keep your elbows at your sides and curl the weights up towards your shoulders.",
    "Lower slowly until your arms are straight."],
    tip: "Keep your elbows still. Only your forearms should move." },
  pushdown: { name: "Tricep pushdown", g: "Upper body", eq: "Cable machine + rope or bar", works: "Triceps", steps: [
    "Clip a rope to the high cable and stand facing the machine.",
    "Hold the rope with elbows tucked at your sides.",
    "Push down until your arms are straight, then let it come back up slowly."],
    tip: "Only your forearms move. Elbows stay glued to your sides." },
  ohtricep: { name: "Overhead tricep extension", g: "Upper body", eq: "Dumbbell", works: "Triceps", steps: [
    "Hold one dumbbell with both hands above your head.",
    "Keeping your elbows pointing up, lower the weight behind your head.",
    "Straighten your arms to lift it back up."],
    tip: "Sitting on a bench with back support makes this steadier." },
  bentrow: { name: "Bent-over row", g: "Upper body", eq: "Barbell or dumbbells", works: "Upper back, lats, biceps", easier: "cablerow", steps: [
    "Hold the weight, soften your knees and hinge forward until your body is at about 45°.",
    "Let your arms hang straight down.",
    "Pull the weight towards your belly button, squeezing your shoulder blades together.",
    "Lower slowly."],
    tip: "Keep your back flat. Resting one hand on a bench (one-arm row) is easier to learn." },
  pulldown: { name: "Lat pulldown", g: "Upper body", eq: "Lat pulldown machine", works: "Lats, upper back, biceps", steps: [
    "Sit with your knees under the pads and grip the bar a little wider than your shoulders.",
    "Lean back slightly and pull the bar down to your upper chest.",
    "Let it go back up slowly until your arms are straight."],
    tip: "Think about pulling your elbows down to your back pockets." },
  cablerow: { name: "Seated cable row", g: "Upper body", eq: "Cable row machine", works: "Upper back, lats, biceps", steps: [
    "Sit with your feet on the footplate, knees slightly bent, holding the handle.",
    "Sit tall and pull the handle to your belly, squeezing your shoulder blades together.",
    "Let your arms straighten slowly."],
    tip: "Don't rock backwards to move the weight. Your body stays still." },
  pullup: { name: "Pull-up (assisted)", g: "Upper body", eq: "Pull-up bar or assisted machine", works: "Lats, upper back, biceps", easier: "pulldown", steps: [
    "Grip the bar a little wider than your shoulders and hang with straight arms.",
    "Pull yourself up until your chin is over the bar.",
    "Lower slowly until your arms are straight."],
    tip: "Most beginners use the assisted machine or a band. That's normal, and a great goal to work towards." },
  facepull: { name: "Face pull", g: "Upper body", eq: "Cable machine + rope", works: "Rear shoulders, upper back, posture", steps: [
    "Set a rope at head height and hold it with thumbs pointing back at you.",
    "Step back until your arms are straight.",
    "Pull the rope towards your face, elbows high and out to the sides.",
    "Return slowly."],
    tip: "Light weight and a squeeze at the end. Great for posture." },
  benchdip: { name: "Bench dip", g: "Upper body", eq: "Bench", works: "Triceps", steps: [
    "Sit on the edge of a bench, hands beside your hips, fingers forward.",
    "Slide your bum off the bench with your knees bent.",
    "Bend your elbows to lower your hips, then push back up."],
    tip: "Stop if you feel it in the front of your shoulders. Keep your bum close to the bench." },

  /* ---------- Core ---------- */
  plank: { name: "Plank", g: "Core", eq: "None (mat)", works: "Whole core", steps: [
    "Forearms on the floor, elbows under your shoulders.",
    "Step your feet back so your body is a straight line from head to heels.",
    "Squeeze your glutes and stomach and hold. Keep breathing."],
    tip: "Don't let your hips sag or stick up. Drop to your knees to make it easier." },
  sideplank: { name: "Side plank", g: "Core", eq: "None (mat)", works: "Obliques, outer glutes", steps: [
    "Lie on your side with your elbow under your shoulder and your legs stacked.",
    "Lift your hips so your body is a straight line from head to feet.",
    "Hold, then switch sides."],
    tip: "Bend your bottom knee to make it easier." },
  shouldertaps: { name: "Plank shoulder taps", g: "Core", eq: "None", works: "Core, shoulders", easier: "plank", steps: [
    "Start in a high plank: hands under your shoulders, body straight, feet a bit wider than your hips.",
    "Lift one hand and tap the opposite shoulder.",
    "Put it back down and swap. Keep your hips as still as you can."],
    tip: "Wider feet make it easier to stop your hips rocking." },
  crunch: { name: "Crunch", g: "Core", eq: "None (mat)", works: "Abs", steps: [
    "Lie on your back, knees bent, feet flat, fingertips lightly behind your ears.",
    "Curl your head and shoulders off the floor by tightening your stomach.",
    "Lower slowly."],
    tip: "Look at the ceiling, not your knees, so you don't pull on your neck." },
  revcrunch: { name: "Reverse crunch", g: "Core", eq: "None (mat)", works: "Lower abs", steps: [
    "Lie on your back with your arms by your sides and knees bent at 90° above your hips.",
    "Tighten your stomach and curl your hips off the floor, bringing your knees towards your chest.",
    "Lower your hips back down slowly."],
    tip: "Use your abs to lift, not a swing of your legs." },
  bicycle: { name: "Bicycle crunch", g: "Core", eq: "None (mat)", works: "Abs, obliques", easier: "crunch", steps: [
    "Lie on your back with your hands lightly behind your head and your shoulders just off the floor.",
    "Bring one knee in while you straighten the other leg.",
    "Twist so your opposite elbow moves towards the bent knee.",
    "Switch sides in a slow pedalling motion."],
    tip: "Don't pull on your neck. Twist from your ribs." },
  deadbug: { name: "Dead bug", g: "Core", eq: "None (mat)", works: "Deep core", steps: [
    "Lie on your back with your arms pointing at the ceiling and knees bent at 90° above your hips.",
    "Press your lower back into the floor.",
    "Slowly lower one arm behind your head and the opposite leg towards the floor, without touching it.",
    "Bring them back and swap sides."],
    tip: "One of the safest core exercises. If your lower back lifts, don't lower as far." },
  birddog: { name: "Bird dog", g: "Core", eq: "None (mat)", works: "Core, lower back, glutes", steps: [
    "Start on hands and knees, back flat.",
    "Reach one arm forward and the opposite leg back until both are level with your body.",
    "Hold for a second, bring them back, then swap sides."],
    tip: "Move slowly. Imagine balancing a cup of tea on your lower back." },
  legraise: { name: "Lying leg raise", g: "Core", eq: "None (mat)", works: "Lower abs", easier: "revcrunch", steps: [
    "Lie on your back, legs straight up towards the ceiling, hands under your bum.",
    "Keeping your lower back pressed down, slowly lower your legs towards the floor.",
    "Stop before your back arches, then lift them back up."],
    tip: "Bend your knees a little to make it easier." },
  flutter: { name: "Flutter kicks", g: "Core", eq: "None (mat)", works: "Lower abs, hip flexors", easier: "deadbug", steps: [
    "Lie on your back, hands under your bum, legs straight and lifted just off the floor.",
    "Kick your legs up and down in small, quick movements.",
    "Keep your lower back pressed into the floor."],
    tip: "Lift your legs higher to make it easier." },
  hollow: { name: "Hollow hold", g: "Core", eq: "None (mat)", works: "Whole front of the core", easier: "deadbug", steps: [
    "Lie on your back with arms stretched overhead.",
    "Press your lower back into the floor and lift your shoulders and legs just off the ground.",
    "Hold, breathing normally."],
    tip: "Bend your knees and bring your arms to your sides to make it easier." },
  superman: { name: "Superman", g: "Core", eq: "None (mat)", works: "Lower back, glutes", steps: [
    "Lie face down with arms stretched out in front.",
    "Lift your arms, chest and legs a few centimetres off the floor.",
    "Hold for 2 seconds, then lower."],
    tip: "Keep looking at the floor so your neck stays relaxed." },
  mountainclimber: { name: "Mountain climbers", g: "Core", eq: "None", works: "Core, fitness", easier: "shouldertaps", steps: [
    "Start in a high plank with hands under your shoulders.",
    "Drive one knee towards your chest, then quickly swap legs.",
    "Keep going at a steady pace, hips level."],
    tip: "Go slowly at first. Speed comes later." },
  kneeraise: { name: "Knee raise", g: "Core", eq: "Knee-raise station or pull-up bar", works: "Lower abs", easier: "revcrunch", steps: [
    "Rest your forearms on the pads of a knee-raise station with your back against the pad (or hang from a bar).",
    "Raise your knees up to at least hip height.",
    "Lower slowly, without swinging."],
    tip: "The station with arm pads is easier than hanging. Start there." },
  cablecrunch: { name: "Cable crunch", g: "Core", eq: "Cable machine + rope", works: "Abs", easier: "crunch", steps: [
    "Clip a rope to the high pulley. Kneel facing the machine and hold the rope beside your head.",
    "Keep your hips still and crunch down, bringing your elbows towards your thighs.",
    "Come back up slowly."],
    tip: "Round your back as you crunch. Don't just bend at the hips." },

  /* ---------- Cardio ---------- */
  jumpingjack: { name: "Jumping jacks", g: "Cardio", eq: "None", works: "Whole body, heart and lungs", steps: [
    "Stand tall with feet together and arms by your sides.",
    "Jump your feet out wide while raising your arms overhead.",
    "Jump back to the start. Keep a steady rhythm."],
    tip: "Low-impact version: step one foot out at a time instead of jumping." },
  highknees: { name: "High knees", g: "Cardio", eq: "None", works: "Legs, heart and lungs", steps: [
    "Run on the spot, lifting your knees to hip height.",
    "Pump your arms in time with your legs.",
    "Stay light on the balls of your feet."],
    tip: "March instead of running to make it lower impact." },
  rower: { name: "Rowing machine", g: "Cardio", eq: "Rowing machine", works: "Legs, back, heart and lungs", steps: [
    "Strap your feet in and hold the handle with straight arms, knees bent (the catch).",
    "Push with your legs first, then lean back slightly, then pull the handle to your lower ribs.",
    "Reverse it: arms, then body forward, then bend your knees to slide back."],
    tip: "Legs, body, arms on the way out; arms, body, legs on the way back." },
  stairmaster: { name: "Stair climber", g: "Cardio", eq: "StairMaster", works: "Glutes, legs, heart and lungs", steps: [
    "Step on and hold the rails lightly for balance, not to hold yourself up.",
    "Start slow and step with your whole foot on each stair.",
    "Stand tall and keep a steady pace."],
    tip: "If you're leaning on the rails, turn the speed down." },
  bike: { name: "Exercise bike", g: "Cardio", eq: "Exercise bike", works: "Legs, heart and lungs", steps: [
    "Set the seat so your knee is only slightly bent at the bottom of each pedal stroke.",
    "Start at an easy level and pedal steadily.",
    "Build up the speed or resistance over the session."],
    tip: "You should be able to talk in short sentences during a warm-up." }
};

/* ---------------- Figures ----------------
   Side-view figure facing right in a 240×150 box, floor at y=140.
   A pose gives the hip position and torso angle, then each leg/arm as angles
   (degrees, 0 = right, 90 = up), an ankle/wrist target solved with 2-bone IK
   (ankle, w = relative to the neck, wa = absolute), or arm angles relative to the torso (rel).
   "a" is the start position, "b" the working position.
   leg/arm = near side (dark), leg2/arm2 = far side (light), defaulting to the near side. */
const SEAT = '<rect x="46" y="104" width="58" height="8" rx="3" class="eqf"/><rect x="42" y="52" width="9" height="58" rx="3" class="eqf"/><line x1="76" y1="112" x2="76" y2="140" class="eq"/>';
const HANG = { arm: 268, fore: 268 };
const FIG = {
  hipthrust: { stat: '<rect x="12" y="97" width="58" height="43" rx="4" class="eqf"/>',
    a: { hip: [104, 120], torso: 150, leg: { ankle: [146, 136] }, arm: { w: [33, 13], bend: 1 } },
    b: { hip: [112, 98], torso: 180, leg: { ankle: [146, 136] }, arm: { w: [38, -6], bend: 1 } },
    props: [{ k: "plate", at: "hip", d: [0, -12] }] },
  gluebridge: {
    a: { hip: [108, 132], torso: 180, leg: { ankle: [142, 136] }, arm: { arm: -3, fore: -2 } },
    b: { hip: [110, 112], torso: 208, leg: { ankle: [142, 136] }, arm: { arm: -3, fore: -2 } } },
  rdl: {
    a: { hip: [116, 76], torso: 91, leg: { ankle: [120, 136] }, arm: { w: [4, 42] } },
    b: { hip: [94, 80], torso: 22, leg: { ankle: [120, 136] }, arm: { w: [-2, 42] } },
    props: [{ k: "plate", at: "wrist" }] },
  slrdl: {
    a: { hip: [118, 76], torso: 90, leg: { thigh: 262, shin: 262, foot: -20 }, leg2: { ankle: [120, 136] }, arm: HANG },
    b: { hip: [112, 78], torso: 12, leg: { thigh: 190, shin: 190, foot: 250 }, leg2: { ankle: [120, 136] }, arm: HANG },
    props: [{ k: "db", at: "wrist" }] },
  deadlift: {
    a: { hip: [94, 104], torso: 32, leg: { ankle: [120, 136] }, arm: HANG },
    b: { hip: [116, 76], torso: 91, leg: { ankle: [120, 136] }, arm: HANG },
    props: [{ k: "plate", at: "wrist" }] },
  kbdeadlift: {
    a: { hip: [96, 104], torso: 36, leg: { ankle: [120, 136] }, arm: HANG },
    b: { hip: [116, 76], torso: 91, leg: { ankle: [120, 136] }, arm: HANG },
    props: [{ k: "plate", at: "wrist", d: [0, 5], r: 7 }] },
  goodmorning: {
    a: { hip: [116, 76], torso: 91, leg: { ankle: [120, 136] }, arm: { rel: [160, -23] } },
    b: { hip: [100, 78], torso: 15, leg: { ankle: [120, 136] }, arm: { rel: [160, -23] } },
    props: [{ k: "plate", at: "neck", back: [-5, 10], r: 9 }] },
  squat: {
    a: { hip: [114, 76], torso: 92, leg: { ankle: [118, 136] }, arm: { rel: [160, -23] } },
    b: { hip: [90, 106], torso: 50, leg: { ankle: [118, 136] }, arm: { rel: [160, -23] } },
    props: [{ k: "plate", at: "neck", back: [-5, 10], r: 9 }] },
  gobletsquat: {
    a: { hip: [114, 76], torso: 92, leg: { ankle: [118, 136] }, arm: { rel: [-160, -10] } },
    b: { hip: [94, 106], torso: 62, leg: { ankle: [118, 136] }, arm: { rel: [-160, -10] } },
    props: [{ k: "plate", at: "wrist", r: 6 }] },
  boxsquat: { stat: '<rect x="62" y="104" width="40" height="36" rx="4" class="eqf"/>',
    a: { hip: [110, 76], torso: 92, leg: { ankle: [120, 136] }, arm: { arm: 5, fore: 5 } },
    b: { hip: [96, 100], torso: 60, leg: { ankle: [120, 136] }, arm: { arm: 20, fore: 15 } } },
  sumosquat: {
    a: { hip: [114, 76], torso: 92, leg: { ankle: [118, 136] }, arm: HANG },
    b: { hip: [106, 104], torso: 82, leg: { ankle: [118, 136] }, arm: HANG },
    props: [{ k: "plate", at: "wrist", r: 7, d: [0, 4] }] },
  wallsit: { stat: '<rect x="54" y="10" width="10" height="130" class="eqf"/>',
    a: { hip: [72, 104], torso: 90, leg: { thigh: 0, shin: 270, foot: 0 }, arm: { arm: 300, fore: 0 } },
    b: { hip: [72, 104], torso: 90, leg: { thigh: 0, shin: 270, foot: 0 }, arm: { arm: 300, fore: 0 } } },
  jumpsquat: {
    a: { hip: [98, 104], torso: 60, leg: { ankle: [118, 136] }, arm: { arm: 225, fore: 225 } },
    b: { hip: [116, 58], torso: 92, leg: { thigh: 268, shin: 268, foot: -60 }, arm: { arm: 80, fore: 85 } } },
  legpress: { stat: '<line x1="80" y1="128" x2="30" y2="94" class="eq pad"/><rect x="40" y="126" width="54" height="14" rx="3" class="eqf"/>',
    a: { hip: [72, 118], torso: 146, leg: { ankle: [116, 82], foot: 60 }, arm: { wa: [84, 122] } },
    b: { hip: [72, 118], torso: 146, leg: { ankle: [98, 98], foot: 60 }, arm: { wa: [84, 122] } },
    props: [{ k: "plat", at: "ankle", along: 45 }] },
  legext: { stat: SEAT,
    a: { hip: [66, 100], torso: 98, leg: { thigh: 0, shin: -95, foot: -10 }, arm: { w: [17, 37] } },
    b: { hip: [66, 100], torso: 98, leg: { thigh: 2, shin: 0, foot: 80 }, arm: { w: [17, 37] } },
    props: [{ k: "pad", at: "ankle", side: 1 }] },
  legcurl: { stat: SEAT + '<rect x="82" y="88" width="30" height="6" rx="3" class="eqf"/>',
    a: { hip: [66, 100], torso: 98, leg: { thigh: 0, shin: -15, foot: 70 }, arm: { w: [29, 24] } },
    b: { hip: [66, 100], torso: 98, leg: { thigh: 0, shin: -112, foot: -25 }, arm: { w: [29, 24] } },
    props: [{ k: "pad", at: "ankle", side: -1 }] },
  lyingcurl: { stat: '<rect x="30" y="106" width="104" height="8" rx="3" class="eqf"/><line x1="50" y1="114" x2="50" y2="140" class="eq"/><line x1="116" y1="114" x2="116" y2="140" class="eq"/>',
    a: { hip: [98, 101], torso: 180, leg: { thigh: 0, shin: -4, foot: 270 }, arm: { arm: 260, fore: 350 } },
    b: { hip: [98, 101], torso: 180, leg: { thigh: 0, shin: 108, foot: 200 }, arm: { arm: 260, fore: 350 } },
    props: [{ k: "pad", at: "ankle", side: 1 }] },
  walklunge: {
    a: { hip: [110, 80], torso: 90, leg: { ankle: [132, 136] }, leg2: { ankle: [88, 134], foot: -30 }, arm: HANG },
    b: { hip: [106, 104], torso: 88, leg: { ankle: [134, 136] }, leg2: { ankle: [80, 128], foot: -55 }, arm: HANG },
    props: [{ k: "db", at: "wrist" }] },
  bss: { stat: '<rect x="20" y="104" width="50" height="36" rx="4" class="eqf"/>',
    a: { hip: [108, 80], torso: 88, leg: { ankle: [132, 136] }, leg2: { ankle: [64, 101], foot: 192 }, arm: HANG },
    b: { hip: [100, 104], torso: 78, leg: { ankle: [132, 136] }, leg2: { ankle: [64, 101], foot: 192 }, arm: { arm: 266, fore: 270 } },
    props: [{ k: "db", at: "wrist" }] },
  stepup: { stat: '<rect x="122" y="120" width="52" height="20" rx="4" class="eqf"/>',
    a: { hip: [112, 98], torso: 80, leg: { ankle: [138, 117] }, leg2: { ankle: [104, 136] }, arm: HANG },
    b: { hip: [134, 58], torso: 90, leg: { ankle: [138, 117] }, leg2: { thigh: 265, shin: 258, foot: -10 }, arm: HANG },
    props: [{ k: "db", at: "wrist" }] },
  kickback: { stat: '<rect x="178" y="16" width="12" height="124" rx="2" class="eqf"/>',
    a: { hip: [118, 82], torso: 50, leg: { ankle: [121, 134], foot: -10 }, leg2: { ankle: [126, 136] }, arm: { wa: [177, 66] } },
    b: { hip: [118, 82], torso: 50, leg: { thigh: 214, shin: 208, foot: 285 }, leg2: { ankle: [126, 136] }, arm: { wa: [177, 66] } },
    props: [{ k: "cable", from: [178, 134], at: "ankle" }] },
  donkeykick: {
    a: { hip: [90, 105], torso: 12, leg: { thigh: 270, shin: 180, foot: 180 }, leg2: { thigh: 270, shin: 180, foot: 180 }, arm: { arm: 270, fore: 270 } },
    b: { hip: [90, 105], torso: 12, leg: { thigh: 165, shin: 90, foot: 180 }, leg2: { thigh: 270, shin: 180, foot: 180 }, arm: { arm: 270, fore: 270 } } },
  pullthrough: { stat: '<rect x="18" y="16" width="12" height="124" rx="2" class="eqf"/>',
    a: { hip: [100, 80], torso: 20, leg: { ankle: [120, 136] }, arm: { w: [-14, 40] } },
    b: { hip: [116, 76], torso: 91, leg: { ankle: [120, 136] }, arm: { w: [2, 42] } },
    props: [{ k: "cable", from: [30, 132], at: "wrist" }] },
  kbswing: {
    a: { hip: [98, 80], torso: 25, leg: { ankle: [120, 136] }, arm: { w: [-18, 38] } },
    b: { hip: [118, 76], torso: 92, leg: { ankle: [120, 136] }, arm: { arm: 5, fore: 5 } },
    props: [{ k: "plate", at: "wrist", r: 7 }] },
  calfraise: {
    a: { hip: [118, 74], torso: 90, leg: { ankle: [120, 134], foot: 0 }, arm: HANG },
    b: { hip: [121, 66], torso: 90, leg: { ankle: [124, 128], foot: -50 }, arm: HANG } },
  pushup: {
    a: { hip: [88, 109], torso: 20, leg: { ankle: [31, 130], foot: 250 }, arm: { wa: [124, 139] } },
    b: { hip: [86, 124], torso: 8, leg: { ankle: [31, 130], foot: 250 }, arm: { wa: [124, 139] } } },
  kneepushup: {
    a: { hip: [90, 112], torso: 25, leg: { thigh: 222, shin: 160, foot: 160 }, arm: { wa: [124, 139] } },
    b: { hip: [90, 122], torso: 8, leg: { thigh: 208, shin: 150, foot: 150 }, arm: { wa: [126, 139] } } },
  benchpress: { stat: '<rect x="40" y="108" width="96" height="8" rx="3" class="eqf"/><line x1="56" y1="116" x2="56" y2="140" class="eq"/><line x1="120" y1="116" x2="120" y2="140" class="eq"/>',
    a: { hip: [110, 104], torso: 180, leg: { ankle: [144, 136] }, arm: { arm: 90, fore: 90 } },
    b: { hip: [110, 104], torso: 180, leg: { ankle: [144, 136] }, arm: { arm: 250, fore: 80 } },
    props: [{ k: "plate", at: "wrist", r: 10 }] },
  shoulderpress: { stat: '<rect x="80" y="110" width="50" height="8" rx="3" class="eqf"/><rect x="76" y="54" width="9" height="60" rx="3" class="eqf"/><line x1="105" y1="118" x2="105" y2="140" class="eq"/>',
    a: { hip: [96, 106], torso: 90, leg: { thigh: 0, shin: 270, foot: 0 }, arm: { arm: 290, fore: 90 } },
    b: { hip: [96, 106], torso: 90, leg: { thigh: 0, shin: 270, foot: 0 }, arm: { arm: 88, fore: 90 } },
    props: [{ k: "db", at: "wrist" }] },
  frontraise: {
    a: { hip: [118, 76], torso: 90, leg: { ankle: [120, 136] }, arm: { arm: 272, fore: 272 } },
    b: { hip: [118, 76], torso: 90, leg: { ankle: [120, 136] }, arm: { arm: 0, fore: 0 } },
    props: [{ k: "db", at: "wrist" }] },
  curl: {
    a: { hip: [118, 76], torso: 90, leg: { ankle: [120, 136] }, arm: { arm: 270, fore: 270 } },
    b: { hip: [118, 76], torso: 90, leg: { ankle: [120, 136] }, arm: { arm: 272, fore: 100 } },
    props: [{ k: "db", at: "wrist" }] },
  pushdown: { stat: '<rect x="176" y="16" width="12" height="124" rx="2" class="eqf"/>',
    a: { hip: [124, 76], torso: 86, leg: { ankle: [126, 136] }, arm: { arm: 272, fore: 60 } },
    b: { hip: [124, 76], torso: 86, leg: { ankle: [126, 136] }, arm: { arm: 272, fore: 285 } },
    props: [{ k: "cable", from: [176, 22], at: "wrist" }] },
  ohtricep: { stat: '<rect x="80" y="110" width="50" height="8" rx="3" class="eqf"/><line x1="105" y1="118" x2="105" y2="140" class="eq"/>',
    a: { hip: [96, 106], torso: 90, leg: { thigh: 0, shin: 270, foot: 0 }, arm: { arm: 95, fore: 250 } },
    b: { hip: [96, 106], torso: 90, leg: { thigh: 0, shin: 270, foot: 0 }, arm: { arm: 95, fore: 92 } },
    props: [{ k: "plate", at: "wrist", r: 6 }] },
  bentrow: {
    a: { hip: [98, 80], torso: 28, leg: { ankle: [120, 136] }, arm: { arm: 270, fore: 270 } },
    b: { hip: [98, 80], torso: 28, leg: { ankle: [120, 136] }, arm: { arm: 200, fore: 275 } },
    props: [{ k: "plate", at: "wrist", r: 9 }] },
  pulldown: { stat: '<rect x="84" y="106" width="44" height="8" rx="3" class="eqf"/><rect x="118" y="88" width="24" height="6" rx="3" class="eqf"/><line x1="104" y1="114" x2="104" y2="140" class="eq"/>',
    a: { hip: [104, 102], torso: 95, leg: { thigh: 0, shin: 268, foot: 0 }, arm: { arm: 88, fore: 88 } },
    b: { hip: [104, 102], torso: 100, leg: { thigh: 0, shin: 268, foot: 0 }, arm: { arm: 250, fore: 80 } },
    props: [{ k: "cable", from: [110, 2], at: "wrist" }, { k: "db", at: "wrist" }] },
  cablerow: { stat: '<rect x="50" y="118" width="54" height="8" rx="3" class="eqf"/><rect x="150" y="100" width="6" height="40" rx="2" class="eqf"/><rect x="186" y="30" width="12" height="110" rx="2" class="eqf"/>',
    a: { hip: [90, 114], torso: 75, leg: { ankle: [146, 118], foot: 80 }, arm: { arm: 345, fore: 350 } },
    b: { hip: [90, 114], torso: 95, leg: { ankle: [146, 118], foot: 80 }, arm: { arm: 250, fore: 5 } },
    props: [{ k: "cable", from: [186, 104], at: "wrist" }] },
  pullup: { floor: false, stat: '<line x1="76" y1="10" x2="164" y2="10" class="eq pad"/>',
    a: { hip: [120, 91], torso: 91, leg: { thigh: 275, shin: 215, foot: 250 }, arm: { wa: [122, 10] } },
    b: { hip: [118, 56], torso: 92, leg: { thigh: 275, shin: 215, foot: 250 }, arm: { wa: [124, 10], bend: 1 } } },
  facepull: { stat: '<rect x="184" y="16" width="12" height="124" rx="2" class="eqf"/>',
    a: { hip: [112, 76], torso: 94, leg: { ankle: [118, 136] }, arm: { arm: 12, fore: 12 } },
    b: { hip: [112, 76], torso: 96, leg: { ankle: [118, 136] }, arm: { arm: 175, fore: 20 } },
    props: [{ k: "cable", from: [184, 36], at: "wrist" }] },
  benchdip: { stat: '<rect x="40" y="100" width="50" height="40" rx="4" class="eqf"/>',
    a: { hip: [96, 94], torso: 95, leg: { ankle: [140, 136] }, arm: { wa: [88, 98], bend: 1 } },
    b: { hip: [96, 118], torso: 95, leg: { ankle: [140, 136] }, arm: { wa: [88, 98], bend: 1 } } },
  plank: {
    a: { hip: [86, 121], torso: 10, leg: { thigh: 190, shin: 190, foot: 262 }, arm: { arm: 270, fore: 0 } },
    b: { hip: [86, 121], torso: 10, leg: { thigh: 190, shin: 190, foot: 262 }, arm: { arm: 270, fore: 0 } } },
  sideplank: {
    a: { hip: [84, 131], torso: 20, leg: { ankle: [26, 135] }, arm: { wa: [148, 136] } },
    b: { hip: [86, 117], torso: 12, leg: { ankle: [26, 135] }, arm: { wa: [148, 136] } } },
  shouldertaps: {
    a: { hip: [88.3, 109], torso: 20, leg: { thigh: 200, shin: 200, foot: 250 }, arm: { arm: 270, fore: 270 }, arm2: { arm: 270, fore: 270 } },
    b: { hip: [88.3, 109], torso: 20, leg: { thigh: 200, shin: 200, foot: 250 }, arm: { arm: 245, fore: 65 }, arm2: { arm: 270, fore: 270 } } },
  crunch: {
    a: { hip: [112, 132], torso: 180, leg: { ankle: [146, 136] }, arm: { rel: [-30, 70] } },
    b: { hip: [112, 132], torso: 156, leg: { ankle: [146, 136] }, arm: { rel: [-30, 70] } } },
  revcrunch: {
    a: { hip: [112, 132], torso: 180, leg: { thigh: 90, shin: 0, foot: 10 }, arm: { arm: -3, fore: -2 } },
    b: { hip: [106, 124], torso: 194, leg: { thigh: 128, shin: 25, foot: 30 }, arm: { arm: -3, fore: -2 } } },
  bicycle: {
    a: { hip: [120, 132], torso: 160, leg: { thigh: 115, shin: -10, foot: 20 }, leg2: { thigh: 10, shin: 6, foot: 60 }, arm: { rel: [-30, 70] } },
    b: { hip: [120, 132], torso: 160, leg: { thigh: 10, shin: 6, foot: 60 }, leg2: { thigh: 115, shin: -10, foot: 20 }, arm: { rel: [-30, 70] } } },
  deadbug: {
    a: { hip: [114, 132], torso: 180, leg: { thigh: 90, shin: 0, foot: 10 }, leg2: { thigh: 90, shin: 0, foot: 10 }, arm: { arm: 90, fore: 90 }, arm2: { arm: 90, fore: 90 } },
    b: { hip: [114, 132], torso: 180, leg: { thigh: 8, shin: 6, foot: 60 }, leg2: { thigh: 90, shin: 0, foot: 10 }, arm: { arm: 170, fore: 172 }, arm2: { arm: 90, fore: 90 } } },
  birddog: {
    a: { hip: [90, 105], torso: 12, leg: { thigh: 270, shin: 180, foot: 180 }, leg2: { thigh: 270, shin: 180, foot: 180 }, arm: { arm: 270, fore: 270 }, arm2: { arm: 270, fore: 270 } },
    b: { hip: [90, 105], torso: 12, leg: { thigh: 184, shin: 182, foot: 260 }, leg2: { thigh: 270, shin: 180, foot: 180 }, arm: { arm: 8, fore: 8 }, arm2: { arm: 270, fore: 270 } } },
  legraise: {
    a: { hip: [104, 132], torso: 180, leg: { thigh: 88, shin: 88, foot: 0 }, arm: { arm: -3, fore: -2 } },
    b: { hip: [104, 132], torso: 180, leg: { thigh: 10, shin: 8, foot: 80 }, arm: { arm: -3, fore: -2 } } },
  flutter: {
    a: { hip: [104, 132], torso: 180, leg: { thigh: 22, shin: 20, foot: 90 }, leg2: { thigh: 6, shin: 5, foot: 80 }, arm: { arm: -3, fore: -2 } },
    b: { hip: [104, 132], torso: 180, leg: { thigh: 6, shin: 5, foot: 80 }, leg2: { thigh: 22, shin: 20, foot: 90 }, arm: { arm: -3, fore: -2 } } },
  hollow: {
    a: { hip: [110, 132], torso: 180, leg: { thigh: 0, shin: 0, foot: 85 }, arm: { arm: 180, fore: 180 } },
    b: { hip: [110, 131], torso: 166, leg: { thigh: 16, shin: 12, foot: 95 }, arm: { arm: 162, fore: 160 } } },
  superman: {
    a: { hip: [110, 132], torso: 180, leg: { thigh: 0, shin: 0, foot: -5 }, arm: { arm: 180, fore: 180 } },
    b: { hip: [110, 132], torso: 168, leg: { thigh: 12, shin: 10, foot: 0 }, arm: { arm: 164, fore: 162 } } },
  mountainclimber: {
    a: { hip: [88, 109], torso: 20, leg: { thigh: 200, shin: 200, foot: 250 }, leg2: { thigh: 200, shin: 200, foot: 250 }, arm: { wa: [124, 139] } },
    b: { hip: [90, 106], torso: 22, leg: { thigh: 320, shin: 205, foot: 250 }, leg2: { thigh: 200, shin: 200, foot: 250 }, arm: { wa: [124, 139] } } },
  kneeraise: { stat: '<rect x="94" y="24" width="8" height="70" rx="3" class="eqf"/><rect x="98" y="54" width="44" height="6" rx="3" class="eqf"/><line x1="98" y1="94" x2="98" y2="140" class="eq"/><line x1="140" y1="60" x2="140" y2="140" class="eq"/>',
    a: { hip: [108, 68], torso: 90, leg: { thigh: 272, shin: 270, foot: -15 }, arm: { arm: 270, fore: 0 } },
    b: { hip: [108, 68], torso: 90, leg: { thigh: 5, shin: 272, foot: -10 }, arm: { arm: 270, fore: 0 } } },
  cablecrunch: { stat: '<rect x="184" y="16" width="12" height="124" rx="2" class="eqf"/>',
    a: { hip: [100, 105], torso: 80, leg: { thigh: 270, shin: 180, foot: 180 }, arm: { rel: [-40, 118] } },
    b: { hip: [97, 105], torso: 22, leg: { thigh: 275, shin: 180, foot: 180 }, arm: { rel: [-40, 118] } },
    props: [{ k: "cable", from: [184, 22], at: "wrist" }] },
  highknees: {
    a: { hip: [118, 72], torso: 88, leg: { thigh: 5, shin: 265, foot: -30 }, leg2: { ankle: [120, 133], foot: -20 }, arm: { arm: 240, fore: 300 }, arm2: { arm: 300, fore: 70 } },
    b: { hip: [118, 72], torso: 88, leg: { ankle: [120, 133], foot: -20 }, leg2: { thigh: 5, shin: 265, foot: -30 }, arm: { arm: 300, fore: 70 }, arm2: { arm: 240, fore: 300 } } },
  rower: { stat: '<rect x="30" y="126" width="152" height="6" rx="3" class="eqf"/><rect x="150" y="104" width="6" height="24" rx="2" class="eqf"/><circle cx="182" cy="112" r="12" class="eqf"/>',
    a: { hip: [100, 120], torso: 68, leg: { ankle: [148, 120], foot: 80 }, arm: { arm: 350, fore: 352 } },
    b: { hip: [86, 120], torso: 105, leg: { ankle: [148, 120], foot: 80 }, arm: { arm: 240, fore: 5 } },
    props: [{ k: "cable", from: [176, 112], at: "wrist" }] },
  stairmaster: { stat: '<path d="M60 140 V122 H92 V108 H124 V94 H156 V140 Z" class="eqf"/>',
    a: { hip: [96, 74], torso: 84, leg: { ankle: [110, 104] }, leg2: { ankle: [80, 118], foot: -10 }, arm: { arm: 300, fore: 20 } },
    b: { hip: [118, 62], torso: 84, leg: { ankle: [134, 90] }, leg2: { ankle: [110, 104], foot: -10 }, arm: { arm: 300, fore: 20 } } },
  bike: { stat: '<rect x="80" y="84" width="26" height="6" rx="3" class="eqf"/><line x1="93" y1="90" x2="118" y2="130" class="eq pad"/><line x1="118" y1="130" x2="146" y2="70" class="eq pad"/><circle cx="118" cy="118" r="11" class="eqf"/><rect x="100" y="130" width="44" height="10" rx="3" class="eqf"/>',
    a: { hip: [93, 80], torso: 70, leg: { ankle: [126, 112] }, leg2: { ankle: [110, 124] }, arm: { wa: [144, 70] } },
    b: { hip: [93, 80], torso: 70, leg: { ankle: [110, 124] }, leg2: { ankle: [126, 112] }, arm: { wa: [144, 70] } } }
};
FIG.revlunge = FIG.walklunge;

/* Front views (for moves you can only see from the front), drawn as points. */
const FRONT_STAND = { head: [120, 24], nk: [120, 36], pv: [120, 78], s1: [106, 42], s2: [134, 42], e1: [102, 63], e2: [138, 63], w1: [100, 84], w2: [140, 84],
  h1: [112, 82], h2: [128, 82], k1: [111, 108], k2: [129, 108], a1: [110, 134], a2: [130, 134] };
const FRONT_SHAPES = [["l", ["h1", "k1", "a1"], 7], ["l", ["h2", "k2", "a2"], 7], ["l", ["h1", "h2"], 10], ["l", ["nk", "pv"], 20],
  ["l", ["s1", "e1", "w1"], 5.5], ["l", ["s2", "e2", "w2"], 5.5], ["c", "head", 8]];
const SEATED_FRONT = { head: [120, 28], nk: [120, 42], pv: [120, 86], s1: [106, 48], s2: [134, 48], e1: [101, 70], e2: [139, 70], w1: [96, 94], w2: [144, 94],
  h1: [112, 94], h2: [128, 94], k1: [109, 110], k2: [131, 110], a1: [108, 134], a2: [132, 134] };
const SEATED_OPEN = Object.assign({}, SEATED_FRONT, { k1: [86, 106], k2: [154, 106], a1: [98, 134], a2: [142, 134] });
const HIP_MACHINE = '<rect x="97" y="18" width="46" height="80" rx="6" class="eqf"/><rect x="88" y="96" width="64" height="8" rx="3" class="eqf"/>';
Object.assign(FIG, {
  abduction: { front: true, stat: HIP_MACHINE, a: SEATED_FRONT, b: SEATED_OPEN, shapes: [...FRONT_SHAPES, ["pad", "k1", -8], ["pad", "k2", 8]] },
  adduction: { front: true, stat: HIP_MACHINE, a: SEATED_OPEN, b: SEATED_FRONT, shapes: [...FRONT_SHAPES, ["pad", "k1", 8], ["pad", "k2", -8]] },
  lateralraise: { front: true, a: FRONT_STAND,
    b: Object.assign({}, FRONT_STAND, { e1: [85, 44], w1: [64, 47], e2: [155, 44], w2: [176, 47] }),
    shapes: [...FRONT_SHAPES, ["db", "w1"], ["db", "w2"]] },
  jumpingjack: { front: true, a: FRONT_STAND,
    b: Object.assign({}, FRONT_STAND, { head: [120, 20], nk: [120, 32], pv: [120, 74], s1: [106, 38], s2: [134, 38], e1: [96, 18], w1: [88, 2], e2: [144, 18], w2: [152, 2],
      h1: [112, 78], h2: [128, 78], k1: [100, 104], a1: [90, 132], k2: [140, 104], a2: [150, 132] }),
    shapes: FRONT_SHAPES },
  bandwalk: { front: true,
    a: Object.assign({}, FRONT_STAND, { pv: [120, 82], nk: [120, 40], head: [120, 28], s1: [106, 46], s2: [134, 46], e1: [102, 66], e2: [138, 66], w1: [108, 84], w2: [132, 84],
      h1: [112, 86], h2: [128, 86], k1: [106, 110], k2: [134, 110], a1: [106, 134], a2: [134, 134] }),
    b: Object.assign({}, FRONT_STAND, { pv: [124, 82], nk: [124, 40], head: [124, 28], s1: [110, 46], s2: [138, 46], e1: [106, 66], e2: [142, 66], w1: [112, 84], w2: [136, 84],
      h1: [116, 86], h2: [132, 86], k1: [110, 110], k2: [148, 110], a1: [110, 134], a2: [152, 134] }),
    shapes: [...FRONT_SHAPES, ["band", "k1", "k2"]] }
});

/* ---------------- Figure engine ---------------- */
const LEN = { t: 38, th: 31, sh: 30, ft: 10, ua: 22, fa: 21, hd: 10 };
const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
const go = (p, a, l) => [p[0] + l * Math.cos(rad(a)), p[1] - l * Math.sin(rad(a))];
const dirTo = (a, b) => deg(Math.atan2(a[1] - b[1], b[0] - a[0]));
function ik(a, b, l1, l2, bend) {
  let d = Math.hypot(b[0] - a[0], b[1] - a[1]);
  d = Math.max(Math.abs(l1 - l2) + .01, Math.min(l1 + l2 - .01, d));
  const a1 = dirTo(a, b) + bend * deg(Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)));
  return [a1, dirTo(go(a, a1, l1), b)];
}
function poseVec(o) {
  const hip = o.hip, neck = go(hip, o.torso, LEN.t);
  const leg = g => g.ankle ? ik(hip, g.ankle, LEN.th, LEN.sh, g.bend ?? 1) : [g.thigh, g.shin];
  const arm = g => g.rel ? [o.torso + g.rel[0], o.torso + g.rel[1]]
    : g.wa || g.w ? ik(neck, g.wa || [neck[0] + g.w[0], neck[1] + g.w[1]], LEN.ua, LEN.fa, g.bend ?? -1) : [g.arm, g.fore];
  const l2 = o.leg2 || o.leg, a2 = o.arm2 || o.arm;
  return [hip[0], hip[1], o.torso, ...leg(o.leg), o.leg.foot ?? 0, ...leg(l2), l2.foot ?? 0, ...arm(o.arm), ...arm(a2)];
}
const mixAng = (a, b, u) => a + ((((b - a) % 360) + 540) % 360 - 180) * u;
function joints(v) {
  const hip = [v[0], v[1]], neck = go(hip, v[2], LEN.t), j = { hip, neck, head: go(neck, v[2], LEN.hd) };
  j.knee = go(hip, v[3], LEN.th); j.ankle = go(j.knee, v[4], LEN.sh); j.toe = go(j.ankle, v[5], LEN.ft);
  j.knee2 = go(hip, v[6], LEN.th); j.ankle2 = go(j.knee2, v[7], LEN.sh); j.toe2 = go(j.ankle2, v[8], LEN.ft);
  j.elbow = go(neck, v[9], LEN.ua); j.wrist = go(j.elbow, v[10], LEN.fa);
  j.elbow2 = go(neck, v[11], LEN.ua); j.wrist2 = go(j.elbow2, v[12], LEN.fa);
  return j;
}
const SVGNS = "http://www.w3.org/2000/svg";
function mk(tag, attrs, parent) { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; }
const ptsAttr = arr => arr.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
const setLine = (e, a, b) => { e.setAttribute("x1", a[0]); e.setAttribute("y1", a[1]); e.setAttribute("x2", b[0]); e.setAttribute("y2", b[1]); };
let LIVE = [];

// Draws the animation for LIB key box.dataset.demo into box.
function mountDemo(box) {
  const f = FIG[box.dataset.demo]; if (!f || box.firstElementChild) return;
  const svg = mk("svg", { viewBox: "0 0 240 150", "aria-hidden": "true" }, box);
  svg.innerHTML = (f.floor === false ? "" : '<line x1="0" y1="140" x2="240" y2="140" class="floor"/>') + (f.stat || "");
  let update;
  if (f.front) {
    const els = f.shapes.map(s => s[0] === "l" ? mk("polyline", { class: "fg", "stroke-width": s[2] }, svg)
      : s[0] === "c" ? mk("circle", { class: "hd", r: s[2] }, svg)
      : s[0] === "pad" ? mk("circle", { class: "eqf", r: 6 }, svg)
      : mk("line", { class: s[0] === "db" ? "wtl" : "cab band" }, svg));
    update = u => {
      const P = {}; for (const k in f.a) P[k] = [f.a[k][0] + (f.b[k][0] - f.a[k][0]) * u, f.a[k][1] + (f.b[k][1] - f.a[k][1]) * u];
      f.shapes.forEach((s, i) => {
        const e = els[i];
        if (s[0] === "l") e.setAttribute("points", ptsAttr(s[1].map(n => P[n])));
        else if (s[0] === "db") { const p = P[s[1]]; setLine(e, [p[0], p[1] - 6], [p[0], p[1] + 6]); }
        else if (s[0] === "band") setLine(e, P[s[1]], P[s[2]]);
        else { e.setAttribute("cx", P[s[1]][0] + (s[0] === "pad" ? s[2] : 0)); e.setAttribute("cy", P[s[1]][1]); }
      });
    };
  } else {
    f.A = f.A || poseVec(f.a); f.B = f.B || poseVec(f.b);
    const leg2 = mk("polyline", { class: "fg2", "stroke-width": 6.5 }, svg), arm2 = mk("polyline", { class: "fg2", "stroke-width": 5.5 }, svg);
    const torso = mk("polyline", { class: "fg", "stroke-width": 10 }, svg), head = mk("circle", { class: "hd", r: 8 }, svg);
    const leg = mk("polyline", { class: "fg", "stroke-width": 6.5 }, svg), arm = mk("polyline", { class: "fg", "stroke-width": 5.5 }, svg);
    const props = (f.props || []).map(p => ({ p, e: p.k === "plate" ? mk("circle", { class: "wt", r: p.r || 11 }, svg)
      : p.k === "pad" ? mk("circle", { class: "eqf", r: 5 }, svg)
      : mk("line", { class: p.k === "cable" ? "cab" : p.k === "db" ? "wtl" : "eq pad" }, svg) }));
    update = u => {
      const v = f.A.map((a, i) => i < 2 ? a + (f.B[i] - a) * u : mixAng(a, f.B[i], u)), j = joints(v);
      leg2.setAttribute("points", ptsAttr([j.hip, j.knee2, j.ankle2, j.toe2]));
      arm2.setAttribute("points", ptsAttr([j.neck, j.elbow2, j.wrist2]));
      torso.setAttribute("points", ptsAttr([j.hip, j.neck]));
      head.setAttribute("cx", j.head[0]); head.setAttribute("cy", j.head[1]);
      leg.setAttribute("points", ptsAttr([j.hip, j.knee, j.ankle, j.toe]));
      arm.setAttribute("points", ptsAttr([j.neck, j.elbow, j.wrist]));
      for (const { p, e } of props) {
        const at = j[p.at], d = p.d || [0, 0];
        if (p.k === "plate") {
          // "back" places it relative to the torso: [along the spine, towards the back].
          const c = p.back ? go(go(at, v[2], p.back[0]), v[2] + 90, p.back[1]) : [at[0] + d[0], at[1] + d[1]];
          e.setAttribute("cx", c[0]); e.setAttribute("cy", c[1]);
        } else if (p.k === "pad") { const c = go(at, v[4] + 90 * p.side, 7); e.setAttribute("cx", c[0]); e.setAttribute("cy", c[1]); }
        else if (p.k === "cable") setLine(e, p.from, at);
        else if (p.k === "db") setLine(e, [at[0] - 7, at[1] + 2], [at[0] + 7, at[1] + 2]);
        else { const c = go(at, p.along, 7); setLine(e, go(c, p.along + 90, 16), go(c, p.along - 90, 16)); }
      }
    };
  }
  const item = { node: svg, update, on: true };
  LIVE.push(item);
  if (demoObserver) { item.on = false; demoObserver.observe(svg); }
  update(motionPhase(performance.now()));
}
function mountDemos(root) { (root || document).querySelectorAll("[data-demo]").forEach(mountDemo); }

// Only animate figures that are on screen.
const demoObserver = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
  for (const en of entries) { const it = LIVE.find(x => x.node === en.target); if (it) it.on = en.isIntersecting; }
}) : null;
const RM = matchMedia("(prefers-reduced-motion: reduce)");
function motionPhase(t) {
  if (RM.matches) return 1;
  const p = (t % 3200) / 3200, e = x => (1 - Math.cos(Math.PI * x)) / 2;
  return p < .15 ? 0 : p < .5 ? e((p - .15) / .35) : p < .65 ? 1 : e(1 - (p - .65) / .35);
}
(function loop(t) {
  LIVE = LIVE.filter(x => x.node.isConnected || (demoObserver && demoObserver.unobserve(x.node), false));
  const u = motionPhase(t); for (const x of LIVE) if (x.on) x.update(u);
  requestAnimationFrame(loop);
})(0);
