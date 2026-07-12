🎨 Learn Rive to Build Your Own Cat — Complete Roadmap
Here's the fastest, most practical path to go from zero → your own animated Rive cat in PathForge. I'll be honest about time investment at each step.

⏱️ Realistic Time Investment
Goal	Time
Understand Rive basics	2 hours
Animate a simple existing shape	1 evening (3-4 hrs)
Build a decent cat with 3-4 states	1 weekend (~10 hrs)
Ship it into PathForge	30 min
Master-level (multiple pets, complex rigs)	20-40 hrs total
You can have a working custom cat in your app by next Monday if you spend Saturday on it.

🗺️ The Learning Path (In Order)
Phase 1: Understand the Concept (30 min)
Rive has 3 core concepts you MUST grok first:

Artboard = your canvas (like a Figma frame)
Timeline animations = individual movements (walk, blink, tail wag)
State Machine = the "brain" that decides which animation plays based on inputs (isSleeping, isWalking, etc.)
Watch this first (15 min, essential):

🎥 "Rive in 100 Seconds" by Fireship — high-level overview
🎥 "Introduction to Rive" on Rive's official YouTube — first video in their playlist
Phase 2: Set Up + First Animation (1-2 hours)
Sign up free at rive.app — use the browser editor (no download needed)
Open the editor → create a new file
Do the official "Get Started" tutorial:
👉 https://rive.app/community/doc/get-started/docsN0OyhpEP
You'll learn:

Drawing basic shapes
Making your first timeline animation
Publishing/exporting a .riv file
Milestone: Animate a bouncing ball. Sounds trivial but it teaches you the whole workflow.

Phase 3: Learn State Machines (2-3 hours) ⭐ Critical for your cat
This is the most important part for PathForge because your cat has multiple states (idle/sleeping/walking/happy).

Best tutorial series:

🎥 "Rive State Machines Explained" by DesignCode — search "Rive state machine tutorial"
📖 Official State Machine docs
Practice project: Make a button that has 3 states — idle, hover, pressed — controlled by boolean inputs.

Milestone: You can create inputs (booleans/numbers/triggers) and route them to trigger different animations.

Phase 4: Character Basics (3-4 hours)
Now you're ready for a character. Two approaches:

A. Learn to rig (harder but more control)
🎥 "Character Animation in Rive" playlist on Rive YouTube
Learn: bones, constraints, mesh deformation
B. Remix a community cat (faster start) ⭐ Recommended
Go to rive.app/community
Find a cat you like → click "Remix"
Open it in your editor
Study how they built it — inspect layers, timeline, state machine
Modify colors, add new states, break things, fix them
This is how most people actually learn Rive. You'll absorb patterns 10x faster than tutorials.

Milestone: You've remixed a cat, changed its color to orange, and added a "sleeping" state.

Phase 5: Build Your PathForge Cat (4-6 hours)
Now build the real thing. Your spec:

Artboard: 200x200px, dark background matches your theme

Animations to create:

Idle — subtle breathing + tail flick (loop, 2s)
Sleeping — curled up + Zzz text floating (loop, 3s)
Yawning — mouth opens, stretch (one-shot, 1.5s)
Happy — bounce + hearts (loop, 1s)
State Machine inputs:

isSleeping (boolean)
isHappy (boolean)
wakeUp (trigger)
Colors to use (match PathForge):

Body: #f97316
Belly: #fef3c7
Accent: #c2410c
Phase 6: Integrate into PathForge (30 min)
Once you have cat.riv:

Bash

npm install @rive-app/react-canvas
Create src/components/pets/RiveCat.jsx:

React

import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useEffect } from 'react';

export default function RiveCat({ state = "idle", size = 48 }) {
  const { rive, RiveComponent } = useRive({
    src: '/cats/cat.riv',
    stateMachines: 'CatStateMachine',  // ← name from your Rive file
    autoplay: true,
  });

  const isSleeping = useStateMachineInput(rive, 'CatStateMachine', 'isSleeping');
  const isHappy = useStateMachineInput(rive, 'CatStateMachine', 'isHappy');
  const wakeUp = useStateMachineInput(rive, 'CatStateMachine', 'wakeUp');

  useEffect(() => {
    if (!isSleeping || !isHappy) return;
    isSleeping.value = state === 'sleeping';
    isHappy.value = state === 'happy';
    if (state === 'yawning') wakeUp?.fire();
  }, [state, isSleeping, isHappy, wakeUp]);

  return <RiveComponent style={{ width: size, height: size }} />;
}
Put cat.riv in public/cats/ and swap SVGCat for RiveCat in your CompanionCat.jsx. Done.

📚 Best Resources (Curated)
Free
Resource	What It's For
rive.app/learn-rive	Official curriculum, start here
Rive YouTube channel	Video tutorials, watch playlists in order
rive.app/community	Free files to remix and study
Rive Discord	Ask questions, very active community
Rive docs	Reference when stuck
Paid (worth it)
Resource	Price	Notes
DesignCode Rive Course	~$20/mo	Best structured course
"Rive from Zero" on Udemy	~$15	One-time, character-focused
Fiverr artist	$30-100	Skip learning, just buy the .riv file
🎯 My Honest Recommendation for You
Since you're shipping a product, not becoming a designer, here's the pragmatic split:

Week 1: Learn just enough to remix
Phases 1-3 (~5 hours)
Goal: understand how state machines work so you can integrate any .riv file
Week 2: Get a professional cat
Two options:

Option A: Hire on Fiverr ($30-80)

Search: "rive animation character" or "rive mascot"
Brief: "Chibi orange cat mascot, states: idle/sleeping/happy/yawning, state machine with boolean inputs, colors #f97316 body #fef3c7 belly"
Turnaround: 2-5 days
You get a professional .riv file + own it forever
Option B: Remix a community one (free)

Find a decent community cat
Modify colors + add missing states (uses skills from Week 1)
Time: 1 weekend
Week 3: Ship + monetize
Integrate the Rive cat
Add PetPicker UI for future pets
Launch as free feature first, gather feedback
Total time cost: ~10 hours of learning + $50-80 = professional mascot shipping in 2 weeks.

🚨 What NOT to Do
❌ Don't try to master Rive fully before shipping — you'll never launch
❌ Don't build 5 pets before validating users care about 1
❌ Don't skip state machines — trying to control animations from React alone defeats Rive's whole point
❌ Don't watch 10 hours of tutorials before opening the editor — you learn by doing
🏁 Your Action Plan This Week
Tonight (30 min):

Watch "Rive in 100 Seconds"
Sign up at rive.app
Browse community cats — bookmark 3 you like
This weekend (4-6 hours):

Do the official Get Started tutorial (bouncing ball)
Do a state machine tutorial (button with hover states)
Remix a community cat, change its colors
Next week:

Decide: keep learning OR hire on Fiverr with your new understanding
Then integrate → ship 🚀

