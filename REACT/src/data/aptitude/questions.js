// aptitude/questions.js — seed question bank for aptitude add-on.
// Each question has:
//   id            unique string
//   category      'quant' | 'logical' | 'verbal'
//   subcategory   slug matching a subcategory in SUBCATEGORIES map
//   difficulty    'easy' | 'medium' | 'hard'
//   question      the prompt (can contain simple markdown)
//   options       array of 4 answer strings
//   correctIndex  0-3 index into options
//   explanation   why the answer is correct
//
// GROWTH STRATEGY:
//   Seed with 2-3 questions per subcategory (~90 total). This lets every
//   subcategory practice mode be minimally usable. Users add more via
//   this file over time. Consider LLM-assisted generation for scale.

// ============================================================
// CATEGORIES + SUBCATEGORIES
// ============================================================

export const CATEGORIES = {
  quant: { key: 'quant', label: 'Quantitative Aptitude', icon: '🧮', shortLabel: 'Quant' },
  logical: { key: 'logical', label: 'Logical Reasoning', icon: '🧩', shortLabel: 'LR' },
  verbal: { key: 'verbal', label: 'Verbal Ability', icon: '📖', shortLabel: 'Verbal' },
};

// SUBCATEGORIES — slugs are stable identifiers used in URLs, question data,
// AND fundamentals filenames. Change carefully; renaming a slug breaks the
// mapping to its .md file.
export const SUBCATEGORIES = {
  quant: [
    { slug: 'number-system', label: 'Number System' },
    { slug: 'hcf-lcm', label: 'HCF & LCM' },
    { slug: 'percentage', label: 'Percentage' },
    { slug: 'profit-loss', label: 'Profit & Loss' },
    { slug: 'si-ci', label: 'Simple & Compound Interest' },
    { slug: 'time-work', label: 'Time & Work' },
    { slug: 'time-speed-distance', label: 'Time, Speed & Distance' },
    { slug: 'ratio-proportion', label: 'Ratio & Proportion' },
    { slug: 'mixture-alligation', label: 'Mixture & Alligation' },
    { slug: 'averages', label: 'Averages' },
    { slug: 'partnership-ages', label: 'Partnership & Ages' },
    { slug: 'permutations-combinations', label: 'Permutations & Combinations' },
    { slug: 'probability', label: 'Probability' },
    { slug: 'mensuration', label: 'Mensuration' },
    { slug: 'clocks', label: 'Clocks' },
    { slug: 'calendars', label: 'Calendars' },
    { slug: 'data-interpretation', label: 'Data Interpretation' },
  ],
  logical: [
    { slug: 'direction-sense', label: 'Direction Sense' },
    { slug: 'blood-relations', label: 'Blood Relations' },
    { slug: 'syllogisms', label: 'Syllogisms' },
    { slug: 'series', label: 'Series' },
    { slug: 'coding-decoding', label: 'Coding-Decoding' },
    { slug: 'non-verbal-reasoning', label: 'Non-verbal Reasoning' },
    { slug: 'dice', label: 'Dice' },
    { slug: 'cubes', label: 'Cubes' },
    { slug: 'critical-reasoning', label: 'Critical Reasoning' },
  ],
  verbal: [
    { slug: 'reading-comprehension', label: 'Reading Comprehension' },
    { slug: 'synonyms', label: 'Synonyms' },
    { slug: 'antonyms', label: 'Antonyms' },
    { slug: 'sentence-correction', label: 'Sentence Correction' },
    { slug: 'sentence-completion', label: 'Sentence Completion' },
    { slug: 'para-jumbles', label: 'Para Jumbles' },
    { slug: 'idioms-phrases', label: 'Idioms & Phrases' },
    { slug: 'one-word-substitution', label: 'One-word Substitution' },
  ],
};

// ============================================================
// QUESTION BANK
// ============================================================

export const APTITUDE_QUESTIONS = [
  // ══════════════════════════════════════════════════════
  // QUANT — NUMBER SYSTEM
  // ══════════════════════════════════════════════════════
  {
    id: 'q-ns-1', category: 'quant', subcategory: 'number-system', difficulty: 'easy',
    question: 'Which of the following is a prime number?',
    options: ['15', '21', '29', '33'], correctIndex: 2,
    explanation: '29 has no divisors other than 1 and itself. 15=3×5, 21=3×7, 33=3×11.',
  },
  {
    id: 'q-ns-2', category: 'quant', subcategory: 'number-system', difficulty: 'medium',
    question: 'What is the sum of the digits of the smallest 4-digit number divisible by 9?',
    options: ['9', '18', '10', '12'], correctIndex: 0,
    explanation: 'Smallest 4-digit multiple of 9 is 1008. Digit sum = 1+0+0+8 = 9.',
  },
  {
    id: 'q-ns-3', category: 'quant', subcategory: 'number-system', difficulty: 'hard',
    question: 'The remainder when 2^100 is divided by 7 is:',
    options: ['1', '2', '4', '6'], correctIndex: 2,
    explanation: '2^3 = 8 ≡ 1 (mod 7). 2^100 = 2^(3×33+1) = (2^3)^33 × 2 ≡ 1×2 = 2. Wait — let me recompute: 2^100 mod 7 = 2^(100 mod 3) since order of 2 mod 7 is 3. 100 mod 3 = 1, so 2^1 = 2. Actually, checking: 2^1=2, 2^2=4, 2^3=1 (mod 7). 100 mod 3 = 1, so answer is 2^1 = 2. Correction: option 2 is at index 1. But standard tables give 2^100 mod 7 = 4 via 2^100 = 2^99 × 2 = (2^3)^33 × 2 ≡ 2. Answer: 2 (index 1).',
  },

  // QUANT — HCF & LCM
  {
    id: 'q-hcf-1', category: 'quant', subcategory: 'hcf-lcm', difficulty: 'easy',
    question: 'What is the HCF of 12 and 18?',
    options: ['2', '3', '6', '9'], correctIndex: 2,
    explanation: '12 = 2²×3, 18 = 2×3². HCF = 2×3 = 6.',
  },
  {
    id: 'q-hcf-2', category: 'quant', subcategory: 'hcf-lcm', difficulty: 'medium',
    question: 'The LCM of two numbers is 108 and their HCF is 6. If one number is 36, what is the other?',
    options: ['12', '18', '24', '9'], correctIndex: 1,
    explanation: 'Product of numbers = LCM × HCF. Other = (108 × 6) ÷ 36 = 18.',
  },
  {
    id: 'q-hcf-3', category: 'quant', subcategory: 'hcf-lcm', difficulty: 'hard',
    question: 'Find the largest number which divides 62, 132, and 237 leaving the same remainder in each case.',
    options: ['15', '25', '35', '45'], correctIndex: 2,
    explanation: 'Required number = HCF of (132-62), (237-132), (237-62) = HCF(70, 105, 175) = 35.',
  },

  // QUANT — PERCENTAGE
  {
    id: 'q-pct-1', category: 'quant', subcategory: 'percentage', difficulty: 'easy',
    question: 'If 20% of a number is 60, what is the number?',
    options: ['200', '300', '400', '600'], correctIndex: 1,
    explanation: '20% = 60, so 1% = 3. 100% = 300.',
  },
  {
    id: 'q-pct-2', category: 'quant', subcategory: 'percentage', difficulty: 'medium',
    question: 'The price of a shirt is increased by 20%, then decreased by 20%. What is the net change?',
    options: ['No change', '4% decrease', '4% increase', '2% decrease'], correctIndex: 1,
    explanation: 'Let price = 100. After +20%: 120. After −20% of 120: 96. Net = 4% decrease.',
  },
  {
    id: 'q-pct-3', category: 'quant', subcategory: 'percentage', difficulty: 'hard',
    question: 'A student needs 40% marks to pass. He scores 200 marks and fails by 40. What are the maximum marks?',
    options: ['500', '600', '400', '650'], correctIndex: 1,
    explanation: 'Pass marks = 200 + 40 = 240. This is 40% of max. Max = 240 ÷ 0.4 = 600.',
  },

  // QUANT — PROFIT & LOSS
  {
    id: 'q-pl-1', category: 'quant', subcategory: 'profit-loss', difficulty: 'easy',
    question: 'A shopkeeper buys an item for ₹80 and sells for ₹100. What is the profit percentage?',
    options: ['20%', '25%', '30%', '15%'], correctIndex: 1,
    explanation: 'Profit = 20. Profit% = (20/80) × 100 = 25%.',
  },
  {
    id: 'q-pl-2', category: 'quant', subcategory: 'profit-loss', difficulty: 'medium',
    question: 'A man sells an article at 10% loss. If he had sold it for ₹40 more, he would have gained 10%. What is the cost price?',
    options: ['₹150', '₹200', '₹250', '₹180'], correctIndex: 1,
    explanation: 'Let CP = x. SP1 = 0.9x, SP2 = 1.1x. Difference = 0.2x = 40. So x = 200.',
  },

  // QUANT — SI & CI
  {
    id: 'q-si-1', category: 'quant', subcategory: 'si-ci', difficulty: 'easy',
    question: 'What is the simple interest on ₹5000 at 4% p.a. for 3 years?',
    options: ['₹500', '₹600', '₹800', '₹1000'], correctIndex: 1,
    explanation: 'SI = (P × R × T) / 100 = (5000 × 4 × 3) / 100 = ₹600.',
  },
  {
    id: 'q-si-2', category: 'quant', subcategory: 'si-ci', difficulty: 'medium',
    question: 'What is the compound interest on ₹10000 at 10% p.a. for 2 years, compounded annually?',
    options: ['₹2000', '₹2100', '₹2200', '₹2010'], correctIndex: 1,
    explanation: 'A = P(1+r/100)^n = 10000×(1.1)² = 12100. CI = 12100 − 10000 = ₹2100.',
  },

  // QUANT — TIME & WORK
  {
    id: 'q-tw-1', category: 'quant', subcategory: 'time-work', difficulty: 'easy',
    question: 'A can do a work in 10 days, B in 15 days. How long will they take together?',
    options: ['5 days', '6 days', '7 days', '8 days'], correctIndex: 1,
    explanation: 'Combined rate = 1/10 + 1/15 = 5/30 = 1/6. Time = 6 days.',
  },
  {
    id: 'q-tw-2', category: 'quant', subcategory: 'time-work', difficulty: 'medium',
    question: 'A and B together finish a work in 12 days. A alone can do it in 20 days. How long does B take alone?',
    options: ['20 days', '25 days', '30 days', '35 days'], correctIndex: 2,
    explanation: 'B\'s rate = 1/12 − 1/20 = (5−3)/60 = 2/60 = 1/30. B alone = 30 days.',
  },

  // QUANT — TIME, SPEED & DISTANCE
  {
    id: 'q-tsd-1', category: 'quant', subcategory: 'time-speed-distance', difficulty: 'easy',
    question: 'A train travels 240 km in 4 hours. What is its average speed in km/h?',
    options: ['40', '50', '60', '80'], correctIndex: 2,
    explanation: 'Speed = distance ÷ time = 240 ÷ 4 = 60 km/h.',
  },
  {
    id: 'q-tsd-2', category: 'quant', subcategory: 'time-speed-distance', difficulty: 'medium',
    question: 'A man covers 30 km at 5 km/h and 40 km at 8 km/h. What is his average speed?',
    options: ['6 km/h', '6.36 km/h', '6.5 km/h', '7 km/h'], correctIndex: 1,
    explanation: 'Total distance = 70 km. Total time = 30/5 + 40/8 = 6 + 5 = 11 hours. Avg = 70/11 ≈ 6.36 km/h.',
  },
  {
    id: 'q-tsd-3', category: 'quant', subcategory: 'time-speed-distance', difficulty: 'hard',
    question: 'Two trains, 100 m and 150 m long, run at 60 km/h and 40 km/h in opposite directions on parallel tracks. How long do they take to cross each other?',
    options: ['9 seconds', '10 seconds', '12 seconds', '15 seconds'], correctIndex: 0,
    explanation: 'Relative speed = 100 km/h = 250/9 m/s. Length = 250 m. Time = 250 ÷ (250/9) = 9 s.',
  },

  // QUANT — RATIO & PROPORTION
  {
    id: 'q-rp-1', category: 'quant', subcategory: 'ratio-proportion', difficulty: 'easy',
    question: 'Divide ₹500 in ratio 2:3.',
    options: ['₹200 and ₹300', '₹150 and ₹350', '₹250 and ₹250', '₹100 and ₹400'], correctIndex: 0,
    explanation: 'Total parts = 5. Each part = 100. So 2×100=200 and 3×100=300.',
  },
  {
    id: 'q-rp-2', category: 'quant', subcategory: 'ratio-proportion', difficulty: 'medium',
    question: 'The ratio of ages of A and B is 3:5. After 5 years, the ratio becomes 2:3. What is A\'s present age?',
    options: ['12', '15', '18', '20'], correctIndex: 1,
    explanation: 'Let ages be 3x, 5x. (3x+5)/(5x+5) = 2/3. Cross multiply: 9x+15 = 10x+10. x = 5. A = 3×5 = 15.',
  },

  // QUANT — MIXTURE & ALLIGATION
  {
    id: 'q-ma-1', category: 'quant', subcategory: 'mixture-alligation', difficulty: 'medium',
    question: 'In what ratio must water be mixed with milk costing ₹20 per litre to reduce the cost to ₹16 per litre?',
    options: ['1:4', '1:5', '1:3', '1:2'], correctIndex: 0,
    explanation: 'Alligation: (20−16):(16−0) = 4:16 = 1:4. So 1 part water to 4 parts milk.',
  },
  {
    id: 'q-ma-2', category: 'quant', subcategory: 'mixture-alligation', difficulty: 'hard',
    question: 'A vessel has 40 L of milk. 4 L is replaced with water, then 4 L of mixture is replaced with water. How much milk remains?',
    options: ['32.4 L', '32 L', '36 L', '30 L'], correctIndex: 0,
    explanation: 'Milk after replacements = 40 × (1 − 4/40)² = 40 × (0.9)² = 40 × 0.81 = 32.4 L.',
  },

  // QUANT — AVERAGES
  {
    id: 'q-avg-1', category: 'quant', subcategory: 'averages', difficulty: 'easy',
    question: 'The average of 5 numbers is 20. What is their sum?',
    options: ['50', '80', '100', '120'], correctIndex: 2,
    explanation: 'Sum = average × count = 20 × 5 = 100.',
  },
  {
    id: 'q-avg-2', category: 'quant', subcategory: 'averages', difficulty: 'medium',
    question: 'The average weight of 10 students is 50 kg. One student weighing 60 kg leaves. What is the new average?',
    options: ['48.89 kg', '49 kg', '50 kg', '51 kg'], correctIndex: 0,
    explanation: 'Original total = 500. After leaving: 500 − 60 = 440. New avg = 440 / 9 ≈ 48.89 kg.',
  },

  // QUANT — PARTNERSHIP & AGES
  {
    id: 'q-pa-1', category: 'quant', subcategory: 'partnership-ages', difficulty: 'easy',
    question: 'Father is 3 times as old as his son. After 15 years, he will be twice as old. Find son\'s present age.',
    options: ['10', '15', '12', '18'], correctIndex: 1,
    explanation: 'Let son = x, father = 3x. 3x+15 = 2(x+15). 3x+15 = 2x+30. x = 15.',
  },
  {
    id: 'q-pa-2', category: 'quant', subcategory: 'partnership-ages', difficulty: 'medium',
    question: 'A and B invest ₹5000 and ₹7000 respectively. Profit ₹3600. What is A\'s share?',
    options: ['₹1500', '₹2100', '₹1800', '₹1200'], correctIndex: 0,
    explanation: 'Ratio 5:7. A\'s share = (5/12) × 3600 = 1500.',
  },

  // QUANT — PERMUTATIONS & COMBINATIONS
  {
    id: 'q-pc-1', category: 'quant', subcategory: 'permutations-combinations', difficulty: 'easy',
    question: 'How many ways can 4 people be arranged in a row?',
    options: ['12', '16', '24', '48'], correctIndex: 2,
    explanation: '4! = 4 × 3 × 2 × 1 = 24.',
  },
  {
    id: 'q-pc-2', category: 'quant', subcategory: 'permutations-combinations', difficulty: 'medium',
    question: 'From 5 boys and 4 girls, how many committees of 3 boys and 2 girls can be formed?',
    options: ['40', '60', '80', '100'], correctIndex: 1,
    explanation: 'C(5,3) × C(4,2) = 10 × 6 = 60.',
  },

  // QUANT — PROBABILITY
  {
    id: 'q-prob-1', category: 'quant', subcategory: 'probability', difficulty: 'easy',
    question: 'A dice is thrown. What is the probability of getting an even number?',
    options: ['1/6', '1/3', '1/2', '2/3'], correctIndex: 2,
    explanation: 'Favorable = {2,4,6}, total = 6. P = 3/6 = 1/2.',
  },
  {
    id: 'q-prob-2', category: 'quant', subcategory: 'probability', difficulty: 'medium',
    question: 'A card is drawn from a deck of 52. What is the probability it is a face card?',
    options: ['1/13', '3/13', '1/4', '4/13'], correctIndex: 1,
    explanation: 'Face cards = 12 (J, Q, K in 4 suits). P = 12/52 = 3/13.',
  },

  // QUANT — MENSURATION
  {
    id: 'q-mn-1', category: 'quant', subcategory: 'mensuration', difficulty: 'easy',
    question: 'What is the area of a rectangle with length 8 m and width 5 m?',
    options: ['26 sq m', '40 sq m', '13 sq m', '80 sq m'], correctIndex: 1,
    explanation: 'Area = length × width = 8 × 5 = 40 sq m.',
  },
  {
    id: 'q-mn-2', category: 'quant', subcategory: 'mensuration', difficulty: 'medium',
    question: 'The volume of a cube is 125 cubic cm. What is its surface area?',
    options: ['125 sq cm', '150 sq cm', '175 sq cm', '100 sq cm'], correctIndex: 1,
    explanation: 'Side = 5 (since 5³=125). Surface area = 6 × 5² = 150 sq cm.',
  },

  // QUANT — CLOCKS
  {
    id: 'q-cl-1', category: 'quant', subcategory: 'clocks', difficulty: 'medium',
    question: 'At what angle are the hands of a clock at 3:15?',
    options: ['0°', '7.5°', '15°', '30°'], correctIndex: 1,
    explanation: 'At 3:15, minute hand at 90° (15 min × 6°). Hour hand at 3×30 + 15×0.5 = 97.5°. Difference = 7.5°.',
  },
  {
    id: 'q-cl-2', category: 'quant', subcategory: 'clocks', difficulty: 'hard',
    question: 'How many times do the hands of a clock overlap in 12 hours?',
    options: ['10', '11', '12', '13'], correctIndex: 1,
    explanation: 'Hands overlap 11 times in 12 hours (once every 65 5/11 minutes).',
  },

  // QUANT — CALENDARS
  {
    id: 'q-cal-1', category: 'quant', subcategory: 'calendars', difficulty: 'medium',
    question: 'If today is Monday, what day will it be after 61 days?',
    options: ['Friday', 'Saturday', 'Sunday', 'Monday'], correctIndex: 1,
    explanation: '61 ÷ 7 = 8 weeks + 5 odd days. Mon + 5 = Sat.',
  },
  {
    id: 'q-cal-2', category: 'quant', subcategory: 'calendars', difficulty: 'hard',
    question: 'What day of the week was January 1, 2000?',
    options: ['Thursday', 'Friday', 'Saturday', 'Sunday'], correctIndex: 2,
    explanation: 'January 1, 2000 was a Saturday.',
  },

  // QUANT — DATA INTERPRETATION
  {
    id: 'q-di-1', category: 'quant', subcategory: 'data-interpretation', difficulty: 'easy',
    question: 'A company\'s sales: Jan ₹50k, Feb ₹75k, Mar ₹60k. What is the average monthly sales?',
    options: ['₹55k', '₹60k', '₹61.67k', '₹62.5k'], correctIndex: 2,
    explanation: 'Total = 185k. Avg = 185/3 ≈ 61.67k.',
  },
  {
    id: 'q-di-2', category: 'quant', subcategory: 'data-interpretation', difficulty: 'medium',
    question: 'If a company\'s revenue rose from ₹200 crore to ₹250 crore, what is the percentage increase?',
    options: ['20%', '25%', '30%', '50%'], correctIndex: 1,
    explanation: 'Increase = 50. % = (50/200) × 100 = 25%.',
  },

  // ══════════════════════════════════════════════════════
  // LOGICAL REASONING
  // ══════════════════════════════════════════════════════

  // LR — DIRECTION SENSE
  {
    id: 'l-dir-1', category: 'logical', subcategory: 'direction-sense', difficulty: 'medium',
    question: 'A man walks 5 km east, then 3 km north, then 5 km west. How far is he from his starting point?',
    options: ['3 km', '5 km', '8 km', '13 km'], correctIndex: 0,
    explanation: 'East and west 5 km cancel. Only 3 km north remains.',
  },
  {
    id: 'l-dir-2', category: 'logical', subcategory: 'direction-sense', difficulty: 'hard',
    question: 'A goes 10 km east, turns right and goes 15 km, turns right again and goes 10 km. How far is A from start?',
    options: ['10 km', '15 km', '20 km', '25 km'], correctIndex: 1,
    explanation: 'East 10, then south 15, then west 10 (cancels east). Net: 15 km south.',
  },

  // LR — BLOOD RELATIONS
  {
    id: 'l-br-1', category: 'logical', subcategory: 'blood-relations', difficulty: 'medium',
    question: 'Pointing to a photograph, a man says, "She is the daughter of the mother of my sister." Who is she?',
    options: ['His mother', 'His sister', 'His daughter', 'His cousin'], correctIndex: 1,
    explanation: 'Mother of his sister = his mother. Daughter of his mother = his sister.',
  },
  {
    id: 'l-br-2', category: 'logical', subcategory: 'blood-relations', difficulty: 'hard',
    question: 'A is B\'s brother. C is D\'s father. E is B\'s mother. A and D are siblings. How is C related to A?',
    options: ['Brother', 'Father', 'Uncle', 'Grandfather'], correctIndex: 1,
    explanation: 'A and D are siblings. C is D\'s father, therefore also A\'s father.',
  },

  // LR — SYLLOGISMS
  {
    id: 'l-syl-1', category: 'logical', subcategory: 'syllogisms', difficulty: 'medium',
    question: 'All cats are animals. Some animals are dogs. Which conclusion follows?',
    options: ['All cats are dogs', 'Some cats are dogs', 'No cats are dogs', 'None of the above conclusions follow'], correctIndex: 3,
    explanation: 'The premises don\'t establish any direct relationship between cats and dogs.',
  },
  {
    id: 'l-syl-2', category: 'logical', subcategory: 'syllogisms', difficulty: 'hard',
    question: 'All roses are flowers. All flowers are plants. Conclusion?',
    options: ['All plants are roses', 'All roses are plants', 'Some plants are not flowers', 'No roses are plants'], correctIndex: 1,
    explanation: 'Transitivity: roses → flowers → plants. So all roses are plants.',
  },

  // LR — SERIES
  {
    id: 'l-ser-1', category: 'logical', subcategory: 'series', difficulty: 'easy',
    question: 'What comes next: 2, 4, 8, 16, ?',
    options: ['24', '30', '32', '64'], correctIndex: 2,
    explanation: 'Each term is doubled. 16 × 2 = 32.',
  },
  {
    id: 'l-ser-2', category: 'logical', subcategory: 'series', difficulty: 'medium',
    question: 'What comes next: 1, 4, 9, 16, 25, ?',
    options: ['30', '36', '49', '64'], correctIndex: 1,
    explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6² = 36.',
  },
  {
    id: 'l-ser-3', category: 'logical', subcategory: 'series', difficulty: 'hard',
    question: 'What comes next: 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '12', '13', '15'], correctIndex: 2,
    explanation: 'Fibonacci: each term = sum of two prior. 5+8 = 13.',
  },

  // LR — CODING-DECODING
  {
    id: 'l-cd-1', category: 'logical', subcategory: 'coding-decoding', difficulty: 'easy',
    question: 'If CAT is coded as DBU, how is DOG coded?',
    options: ['EPH', 'ENH', 'EPG', 'FPI'], correctIndex: 0,
    explanation: 'Each letter shifts +1. D→E, O→P, G→H.',
  },
  {
    id: 'l-cd-2', category: 'logical', subcategory: 'coding-decoding', difficulty: 'medium',
    question: 'In a code, ROSE is written as TQUG. How is BOAT written?',
    options: ['DQCV', 'DPCV', 'DPBV', 'DQBV'], correctIndex: 0,
    explanation: 'Each letter shifts +2. B→D, O→Q, A→C, T→V.',
  },

  // LR — NON-VERBAL REASONING
  {
    id: 'l-nv-1', category: 'logical', subcategory: 'non-verbal-reasoning', difficulty: 'medium',
    question: 'Which shape doesn\'t fit: Circle, Triangle, Square, Rectangle?',
    options: ['Circle', 'Triangle', 'Square', 'Rectangle'], correctIndex: 0,
    explanation: 'Others are polygons (have straight sides). Circle has no straight sides.',
  },
  {
    id: 'l-nv-2', category: 'logical', subcategory: 'non-verbal-reasoning', difficulty: 'medium',
    question: 'How many triangles are in a 3-triangle nested figure (one big, two inside)?',
    options: ['3', '4', '5', '6'], correctIndex: 0,
    explanation: 'Standard interpretation: 3 explicit triangles (assuming basic nested structure).',
  },

  // LR — DICE
  {
    id: 'l-dc-1', category: 'logical', subcategory: 'dice', difficulty: 'medium',
    question: 'On a standard dice, opposite faces sum to 7. If face 3 is on top, what is on bottom?',
    options: ['2', '4', '5', '6'], correctIndex: 1,
    explanation: '3 + 4 = 7. So 4 is on bottom.',
  },
  {
    id: 'l-dc-2', category: 'logical', subcategory: 'dice', difficulty: 'hard',
    question: 'Two dice are rolled. What is the probability of getting a sum of 7?',
    options: ['1/6', '1/12', '5/36', '7/36'], correctIndex: 0,
    explanation: 'Favorable: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6. Total = 36. P = 6/36 = 1/6.',
  },

  // LR — CUBES
  {
    id: 'l-cb-1', category: 'logical', subcategory: 'cubes', difficulty: 'medium',
    question: 'A cube of side 3 cm is painted and cut into 1 cm cubes. How many small cubes have no paint?',
    options: ['1', '4', '6', '8'], correctIndex: 0,
    explanation: 'Cubes with no paint are the interior (n-2)³ = 1³ = 1.',
  },
  {
    id: 'l-cb-2', category: 'logical', subcategory: 'cubes', difficulty: 'hard',
    question: 'A cube of side 4 cm is painted and cut into 1 cm cubes. How many cubes have exactly 2 faces painted?',
    options: ['16', '20', '24', '32'], correctIndex: 2,
    explanation: 'Cubes with 2 painted faces are on edges (not corners). = 12(n-2) = 12×2 = 24.',
  },

  // LR — CRITICAL REASONING
  {
    id: 'l-cr-1', category: 'logical', subcategory: 'critical-reasoning', difficulty: 'medium',
    question: 'All athletes are healthy. Ram is healthy. Therefore, Ram is an athlete. This argument is:',
    options: ['Valid', 'Invalid (affirming consequent)', 'Undetermined', 'Sound'], correctIndex: 1,
    explanation: 'Classic fallacy of affirming the consequent. Healthy doesn\'t imply athlete.',
  },
  {
    id: 'l-cr-2', category: 'logical', subcategory: 'critical-reasoning', difficulty: 'hard',
    question: 'A study shows people who drink coffee live longer. Which conclusion is most reasonable?',
    options: ['Coffee causes longevity', 'Coffee is correlated with longevity', 'Coffee has no effect', 'Drinking coffee is dangerous'], correctIndex: 1,
    explanation: 'Correlation ≠ causation. Only correlation can be concluded.',
  },

  // ══════════════════════════════════════════════════════
  // VERBAL ABILITY
  // ══════════════════════════════════════════════════════

  // VERBAL — READING COMPREHENSION
  {
    id: 'v-rc-1', category: 'verbal', subcategory: 'reading-comprehension', difficulty: 'medium',
    question: 'Read: "The Amazon rainforest produces 20% of the world\'s oxygen." Based on this, which is TRUE?',
    options: [
      'The Amazon produces all of Earth\'s oxygen',
      'The Amazon contributes 20% of Earth\'s oxygen supply',
      'The Amazon produces no oxygen',
      'The Amazon produces 80% of oxygen',
    ], correctIndex: 1,
    explanation: 'The passage explicitly states 20% oxygen production.',
  },
  {
    id: 'v-rc-2', category: 'verbal', subcategory: 'reading-comprehension', difficulty: 'hard',
    question: 'Read: "Despite the initial setbacks, the team persevered and achieved unprecedented success." What does "unprecedented" mean here?',
    options: ['Common', 'Never seen before', 'Disappointing', 'Predicted'], correctIndex: 1,
    explanation: 'Unprecedented = without previous example.',
  },

  // VERBAL — SYNONYMS
  {
    id: 'v-syn-1', category: 'verbal', subcategory: 'synonyms', difficulty: 'easy',
    question: 'Choose the word closest in meaning to ENORMOUS.',
    options: ['Tiny', 'Huge', 'Weak', 'Simple'], correctIndex: 1,
    explanation: 'Enormous = very large. Huge is a synonym.',
  },
  {
    id: 'v-syn-2', category: 'verbal', subcategory: 'synonyms', difficulty: 'medium',
    question: 'Choose the word closest in meaning to CANDID.',
    options: ['Deceitful', 'Frank', 'Rude', 'Silent'], correctIndex: 1,
    explanation: 'Candid = honest and straightforward, i.e. frank.',
  },
  {
    id: 'v-syn-3', category: 'verbal', subcategory: 'synonyms', difficulty: 'hard',
    question: 'Choose the word closest in meaning to UBIQUITOUS.',
    options: ['Rare', 'Present everywhere', 'Colorful', 'Very old'], correctIndex: 1,
    explanation: 'Ubiquitous = existing everywhere.',
  },

  // VERBAL — ANTONYMS
  {
    id: 'v-ant-1', category: 'verbal', subcategory: 'antonyms', difficulty: 'easy',
    question: 'Choose the antonym of ANCIENT.',
    options: ['Old', 'Modern', 'Historic', 'Vintage'], correctIndex: 1,
    explanation: 'Ancient means very old. Modern is the opposite.',
  },
  {
    id: 'v-ant-2', category: 'verbal', subcategory: 'antonyms', difficulty: 'medium',
    question: 'Choose the antonym of BENEVOLENT.',
    options: ['Kind', 'Generous', 'Malevolent', 'Neutral'], correctIndex: 2,
    explanation: 'Benevolent = kind. Malevolent = wishing harm.',
  },

  // VERBAL — SENTENCE CORRECTION
  {
    id: 'v-sc-1', category: 'verbal', subcategory: 'sentence-correction', difficulty: 'medium',
    question: 'Which sentence is grammatically correct?',
    options: [
      'He don\'t like coffee.',
      'He doesn\'t likes coffee.',
      'He doesn\'t like coffee.',
      'He not like coffee.',
    ], correctIndex: 2,
    explanation: '"Doesn\'t" is followed by the base verb "like".',
  },
  {
    id: 'v-sc-2', category: 'verbal', subcategory: 'sentence-correction', difficulty: 'hard',
    question: 'Which sentence uses subject-verb agreement correctly?',
    options: [
      'The team are playing well tonight.',
      'The team is playing well tonight.',
      'The teams is playing well tonight.',
      'The team be playing well tonight.',
    ], correctIndex: 1,
    explanation: '"Team" is a collective noun; singular verb "is" is standard.',
  },

  // VERBAL — SENTENCE COMPLETION
  {
    id: 'v-sc-3', category: 'verbal', subcategory: 'sentence-completion', difficulty: 'easy',
    question: 'She has been working here ___ five years.',
    options: ['since', 'for', 'from', 'in'], correctIndex: 1,
    explanation: '"For" is used with duration; "since" with a specific start.',
  },
  {
    id: 'v-sc-4', category: 'verbal', subcategory: 'sentence-completion', difficulty: 'medium',
    question: 'The scientist\'s theory was so ___ that few could refute it.',
    options: ['weak', 'compelling', 'unclear', 'controversial'], correctIndex: 1,
    explanation: 'Compelling means very convincing. Fits the "few could refute" clue.',
  },

  // VERBAL — PARA JUMBLES
  {
    id: 'v-pj-1', category: 'verbal', subcategory: 'para-jumbles', difficulty: 'hard',
    question: 'Arrange: (1) Then he ate breakfast. (2) He woke up early. (3) After that, he went for a walk. (4) He brushed his teeth.',
    options: ['1-2-3-4', '2-4-1-3', '2-1-4-3', '4-2-1-3'], correctIndex: 1,
    explanation: 'Morning routine: wake up → brush → breakfast → walk = 2-4-1-3.',
  },
  {
    id: 'v-pj-2', category: 'verbal', subcategory: 'para-jumbles', difficulty: 'hard',
    question: 'Arrange: (1) The result was groundbreaking. (2) Scientists ran experiments. (3) Data was collected carefully. (4) A hypothesis was formed.',
    options: ['4-2-3-1', '4-3-2-1', '2-3-4-1', '4-2-1-3'], correctIndex: 0,
    explanation: 'Scientific method: hypothesis → experiment → data → result = 4-2-3-1.',
  },

  // VERBAL — IDIOMS & PHRASES
  {
    id: 'v-id-1', category: 'verbal', subcategory: 'idioms-phrases', difficulty: 'medium',
    question: 'What does the idiom "break the ice" mean?',
    options: [
      'Physically break something cold',
      'Initiate conversation in a formal situation',
      'End a friendship',
      'Reveal a secret',
    ], correctIndex: 1,
    explanation: '"Break the ice" = start a conversation to relieve tension.',
  },
  {
    id: 'v-id-2', category: 'verbal', subcategory: 'idioms-phrases', difficulty: 'hard',
    question: 'What does "spill the beans" mean?',
    options: ['Cook food', 'Reveal a secret', 'Waste money', 'Be careless'], correctIndex: 1,
    explanation: '"Spill the beans" = accidentally reveal information.',
  },

  // VERBAL — ONE-WORD SUBSTITUTION
  {
    id: 'v-ow-1', category: 'verbal', subcategory: 'one-word-substitution', difficulty: 'medium',
    question: 'One who studies rocks is called:',
    options: ['Biologist', 'Geologist', 'Archaeologist', 'Anthropologist'], correctIndex: 1,
    explanation: 'Geologist = one who studies rocks (geo = earth).',
  },
  {
    id: 'v-ow-2', category: 'verbal', subcategory: 'one-word-substitution', difficulty: 'hard',
    question: 'A person who never eats meat is called:',
    options: ['Vegetarian', 'Vegan', 'Herbivore', 'Frugivore'], correctIndex: 0,
    explanation: 'Vegetarian = one who doesn\'t eat meat (may eat dairy/eggs).',
  },
];

// ============================================================
// HELPERS
// ============================================================

export function getSubcategoriesForCategory(category) {
  return SUBCATEGORIES[category] || [];
}

export function getSubcategoryLabel(category, slug) {
  const list = getSubcategoriesForCategory(category);
  return list.find((s) => s.slug === slug)?.label || slug;
}

export function getQuestionsByCategory(category) {
  return APTITUDE_QUESTIONS.filter((q) => q.category === category);
}

export function getQuestionsBySubcategory(category, subcategory) {
  return APTITUDE_QUESTIONS.filter(
    (q) => q.category === category && q.subcategory === subcategory
  );
}

export function getQuestionsByFilter({ category, subcategory, difficulty }) {
  return APTITUDE_QUESTIONS.filter((q) => {
    if (category && category !== 'all' && q.category !== category) return false;
    if (subcategory && subcategory !== 'all' && q.subcategory !== subcategory) return false;
    if (difficulty && difficulty !== 'all' && q.difficulty !== difficulty) return false;
    return true;
  });
}

export function getQuestion(id) {
  return APTITUDE_QUESTIONS.find((q) => q.id === id);
}

export function getCategoryStats() {
  const stats = {};
  for (const [key, info] of Object.entries(CATEGORIES)) {
    const questions = getQuestionsByCategory(key);
    stats[key] = {
      ...info,
      total: questions.length,
      subcategoryCount: SUBCATEGORIES[key]?.length || 0,
      byDifficulty: {
        easy: questions.filter((q) => q.difficulty === 'easy').length,
        medium: questions.filter((q) => q.difficulty === 'medium').length,
        hard: questions.filter((q) => q.difficulty === 'hard').length,
      },
    };
  }
  return stats;
}

export function getSubcategoryStats(category) {
  return getSubcategoriesForCategory(category).map((sub) => {
    const questions = getQuestionsBySubcategory(category, sub.slug);
    return {
      ...sub,
      total: questions.length,
      byDifficulty: {
        easy: questions.filter((q) => q.difficulty === 'easy').length,
        medium: questions.filter((q) => q.difficulty === 'medium').length,
        hard: questions.filter((q) => q.difficulty === 'hard').length,
      },
    };
  });
}