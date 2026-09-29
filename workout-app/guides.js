/* Lift Log guides for beginners, and the ready-made plans people can start from.
   Guide section: { h: heading, p: [paragraphs], list: [bullets], tip: "one callout" }. */

const GUIDES = [
  { id: "start", title: "Start here", mins: 3, blurb: "Your first weeks in the gym, step by step.", sections: [
    { p: ["Everyone starts somewhere. Nobody in the gym is watching you as closely as you think, and most people are happy to help if you ask."] },
    { h: "Your first week", list: [
      "Pick a plan in Plans. If you're brand new, start with Beginner full body.",
      "Do the warm-up every time. 5 to 15 minutes on a bike or stair climber gets your body ready.",
      "Before each exercise, tap it to watch the animation and read How to do it.",
      "Start lighter than you think. Week one is for learning the moves, not proving anything.",
      "Log the weight and reps for every set. Next week, the app shows you what to beat."] },
    { h: "How a session works", list: [
      "Warm up.",
      "Do the first exercise: all its sets, resting between each (the timer starts when you tick a set).",
      "Move to the next exercise, and so on down the list.",
      "Finish with the core moves if your plan has them, then tap Finish."] },
    { h: "How often?", p: ["Two or three sessions a week with at least one rest day between them is plenty to start with. Consistency beats intensity: turning up for 12 weeks matters more than any single workout."] },
    { tip: "Feeling nervous? Go at a quieter time (mid-morning or later in the evening) for your first few visits, and ask staff to show you how to adjust the machines." }
  ] },
  { id: "weight", title: "How heavy should I lift?", mins: 3, blurb: "Choosing a weight and knowing when to go up.", sections: [
    { h: "The 2 reps left rule", p: ["Pick a weight you can lift for the reps on your plan with good form, finishing each set feeling like you could have done about 2 more. If you could have done 5 more, it's too light. If your form breaks down, it's too heavy."] },
    { h: "Finding your first weight", list: [
      "Start with the empty bar, the lightest dumbbells or the lowest pin on a machine.",
      "Do a set. If it felt easy, go up a step for the next set.",
      "Write down the weight that felt right. That's your starting point for next week."] },
    { h: "When to go up", p: ["When you hit the top of the rep range on every set (for example 3 sets of 12 on an 8 to 12 exercise), go up by the smallest step next time: usually 1 to 2.5 kg on dumbbells and machines, or 2.5 to 5 kg on a barbell. Then build the reps back up. This is called progressive overload, and it's how you get stronger."] },
    { h: "Words you'll hear", list: [
      "Rep: one lift, start to finish.",
      "Set: a group of reps done without resting. \"3 × 10\" means 3 sets of 10 reps.",
      "Rest: the break between sets. 60 to 90 seconds for most exercises, up to 2 to 3 minutes for heavy squats and deadlifts.",
      "Form: doing the movement correctly. Always more important than the weight.",
      "Compound: a move using lots of muscles at once, like squats or rows.",
      "Superset: two exercises back to back with no rest between them.",
      "DOMS: the muscle soreness you get a day or two after training. Normal, and it gets less as you get used to it."] }
  ] },
  { id: "safety", title: "Staying safe and recovering", mins: 2, blurb: "Pain vs soreness, rest days and sleep.", sections: [
    { h: "Soreness is normal, pain isn't", p: ["A dull ache in your muscles a day or two after training is normal. Sharp, sudden or joint pain is not: stop that exercise and try an easier version. If it doesn't settle, see a GP or physio."] },
    { h: "Recover well", list: [
      "Sleep: 7 to 9 hours is when your muscles actually repair.",
      "Rest days: have at least one day between training the same muscles.",
      "Walk: a daily walk helps recovery and your general fitness.",
      "Eat enough, especially protein (see the Nutrition guide)."] },
    { h: "Good habits", list: [
      "Breathe out on the hard part of the lift, and don't hold your breath for long.",
      "Use collars on barbells and set the safety bars in the rack.",
      "Wipe down equipment after you use it and put weights back.",
      "Unwell? Rest. Training through illness slows recovery."] },
    { tip: "If you're pregnant, have recently given birth, have a heart condition or any injury, check with your GP or midwife before starting a new plan." }
  ] },
  { id: "nutrition", title: "Nutrition guide", mins: 5, blurb: "Protein, energy and simple meals. Includes a calculator.", calc: true, sections: [
    { p: ["You don't need a perfect diet to see results. A few simple habits make most of the difference. This is general guidance, not a medical diet plan."] },
    { h: "1. Protein at every meal", p: ["Protein helps your muscles repair and grow, and keeps you full. Most people who train do well on about 1.6 g of protein per kg of body weight a day, spread across 3 to 4 meals. The calculator below works out your number."],
      list: ["Eggs: 2 large = about 13 g", "Greek yoghurt, 170 g pot = about 17 g", "Chicken breast, 125 g = about 38 g", "Tin of tuna, drained = about 25 g", "Tofu, 150 g = about 20 g", "Lentils or beans, half a tin = about 8 g", "Cottage cheese, 100 g = about 11 g", "Protein shake, 1 scoop = about 20 to 25 g"] },
    { h: "2. Eat enough energy", p: ["Calories are the energy in food. Eat too little and you'll feel flat, train badly and struggle to build strength. To lose fat, a small, steady gap below your maintenance number works better than crash dieting. To build muscle, eat around maintenance or slightly above."] },
    { h: "3. Build your plate", list: [
      "A palm-sized portion of protein (or two for bigger appetites).",
      "A fist of carbs: rice, potatoes, pasta, oats, bread or fruit. Carbs fuel your training.",
      "Two fists of vegetables or salad.",
      "A thumb of fats: olive oil, nuts, avocado, cheese."] },
    { h: "4. Around your workout", list: [
      "1 to 3 hours before: a normal meal with carbs and protein, like chicken wrap, porridge with yoghurt, or eggs on toast.",
      "Short on time: a banana 30 to 60 minutes before.",
      "After: a meal or snack with protein within a few hours. No need to rush."] },
    { h: "5. Drink water", p: ["Aim for pale yellow wee. Most people need around 1.5 to 2.5 litres a day, plus a bit more on training days. A bottle in your gym bag makes it easy."] },
    { h: "Simple meal ideas", list: [
      "Breakfast: overnight oats with Greek yoghurt and berries.",
      "Breakfast: scrambled eggs on wholemeal toast with spinach.",
      "Lunch: chicken or tofu salad wrap with hummus.",
      "Lunch: jacket potato with tuna and sweetcorn, side salad.",
      "Dinner: salmon, rice and roasted veg.",
      "Dinner: turkey mince chilli with beans and rice.",
      "Snack: cottage cheese with pineapple, a protein yoghurt, or a handful of nuts and fruit."] },
    { h: "Supplements", p: ["None are required. A protein shake is just convenient food. Creatine monohydrate (3 to 5 g a day) is the most researched supplement for strength and is safe for most healthy adults. Vitamin D is recommended for everyone in the UK from October to March. Be wary of anything promising fast fat loss."] },
    { tip: "If you have a history of disordered eating, are pregnant or breastfeeding, are under 18, or have a medical condition, skip the calorie numbers and speak to your GP or a registered dietitian." }
  ] }
];

/* Ready-made plans. Exercise entries: [library key, reps, sets]. Core entries: [library key, reps]. */
const TEMPLATES = [
  { id: "glute", name: "Glute plan", level: "Beginner to intermediate", days: 3, blurb: "Three lower-body sessions focused on glutes, with weekly weight tracking.",
    warmup: { what: "Bike or StairMaster", time: "15 minutes", note: "Build up the speed each week" },
    sessions: [
      { name: "Session 1", focus: "Glutes + hamstrings", note: "Heavy weights if possible",
        ex: [["hipthrust", "6 to 10", 4, "Barbell hip thrust"], ["rdl", "8 to 10", 3], ["bss", "8 to 12 each leg", 3],
             ["legcurl", "10 to 15", 3, "Seated/lying leg curl (machine)"], ["kickback", "12 to 15 each leg", 3], ["abduction", "10 to 15", 3]],
        core: [["revcrunch", "12–15"], ["deadbug", "10 each side"], ["plank", "30–45 sec"]] },
      { name: "Session 2", focus: "Quads & glutes",
        ex: [["squat", "6 to 10", 4], ["legpress", "8 to 12", 3], ["walklunge", "10 each leg", 3, "Walking lunges, dumbbell in each hand"],
             ["legext", "10 to 15", 3], ["hipthrust", "10 to 12", 3, "Hip thrust or glute bridge"], ["abduction", "15 to 20", 3]],
        core: [["kneeraise", "10–15", "Hanging/knee raises"], ["bicycle", "12 each side"], ["sideplank", "30 sec each side"]] },
      { name: "Session 3", focus: "Glutes, hamstrings & legs",
        ex: [["hipthrust", "8 to 12", 4], ["rdl", "8 to 12", 3], ["revlunge", "10 each leg", 3, "Reverse lunges, dumbbell in each hand"],
             ["legpress", "10 to 12", 3], ["legcurl", "10 to 15", 3, "Leg curl (machine)"], ["kickback", "12 to 15 each leg", 3, "Cable kickback"], ["abduction", "15 to 25", 2]],
        core: [["cablecrunch", "12–15"], ["revcrunch", "12–15"], ["shouldertaps", "10 each side"]] }
    ] },
  { id: "fullbody", name: "Beginner full body", level: "Complete beginner", days: 2, blurb: "Two simple gym sessions that teach the key moves. Alternate A and B.",
    warmup: { what: "Bike, rower or cross trainer", time: "10 minutes", note: "Easy pace, then a little faster" },
    sessions: [
      { name: "Day A", focus: "Full body",
        ex: [["gobletsquat", "8 to 12", 3], ["kbdeadlift", "8 to 12", 3], ["pulldown", "10 to 12", 3], ["shoulderpress", "10 to 12", 2], ["gluebridge", "12 to 15", 3]],
        core: [["deadbug", "8 each side"], ["plank", "20–30 sec"]] },
      { name: "Day B", focus: "Full body",
        ex: [["legpress", "10 to 12", 3], ["hipthrust", "10 to 12", 3], ["cablerow", "10 to 12", 3], ["kneepushup", "6 to 10", 3], ["revlunge", "8 each leg", 2]],
        core: [["birddog", "8 each side"], ["crunch", "10–15"]] }
    ] },
  { id: "home", name: "Home workout", level: "Complete beginner", days: 3, blurb: "No equipment needed. Do it in your living room.",
    warmup: { what: "March on the spot, then jumping jacks", time: "5 minutes", note: "Get warm and slightly out of breath" },
    sessions: [
      { name: "Workout 1", focus: "Legs & glutes",
        ex: [["boxsquat", "10 to 15", 3, "Squat to a chair"], ["gluebridge", "15 to 20", 3], ["revlunge", "8 each leg", 3], ["donkeykick", "12 each leg", 2], ["calfraise", "15 to 20", 2]],
        core: [["deadbug", "8 each side"], ["plank", "20–30 sec"]] },
      { name: "Workout 2", focus: "Upper body & core",
        ex: [["kneepushup", "6 to 12", 3], ["benchdip", "8 to 12", 3, "Chair dip"], ["superman", "10", 3], ["shouldertaps", "8 each side", 2]],
        core: [["crunch", "10–15"], ["sideplank", "20 sec each side"]] },
      { name: "Workout 3", focus: "Full body & cardio",
        ex: [["jumpingjack", "30 sec", 3], ["boxsquat", "12 to 15", 3], ["mountainclimber", "20 sec", 3], ["gluebridge", "15", 2], ["highknees", "20 sec", 3]],
        core: [["bicycle", "10 each side"], ["hollow", "15–20 sec"]] }
    ] },
  { id: "upper", name: "Upper body", level: "Beginner", days: 1, blurb: "One session for arms, back and shoulders. Pairs well with the glute plan.",
    warmup: { what: "Rower", time: "5 to 10 minutes", note: "Easy pace" },
    sessions: [
      { name: "Upper", focus: "Back, shoulders & arms",
        ex: [["pulldown", "8 to 12", 3], ["cablerow", "10 to 12", 3], ["shoulderpress", "8 to 12", 3], ["lateralraise", "12 to 15", 3], ["facepull", "12 to 15", 2], ["curl", "10 to 12", 2], ["pushdown", "10 to 12", 2]],
        core: [["cablecrunch", "12–15"], ["plank", "30 sec"]] }
    ] }
];
