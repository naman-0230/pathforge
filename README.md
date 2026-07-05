# 🧠 Pathforge — DSA Tracker

> Stop grinding blindly. Build a roadmap that adapts to *you*.

Pathforge is a full-stack DSA preparation tracker that generates a personalised, adaptive problem roadmap based on your topics, deadline, and daily availability — and continuously recalibrates itself based on your weak points.

---

## ✨ Features

- **Adaptive roadmap** — pick your topics and deadline, get a day-by-day problem plan that reroutes as you progress
- **Weak point detection** — system tracks every hint opened, every solution peeked, and every confidence rating to automatically weight struggling patterns higher
- **Progressive hints** — 3–5 per problem, from directional nudges to full approach reveals, gated intentionally
- **Full solutions with dry runs** — 2–3 approaches per problem, with step-through tables and visual explainers for trees, graphs, and recursion
- **Spaced revision (SM-2)** — after finishing each topic, revision sessions are scheduled using the SM-2 algorithm, not fixed intervals
- **Confidence self-rating** — rate each problem on a 1–4 scale after solving; feeds directly into the weak point engine
- **Solution gate** — solution is gated behind a checkbox confirming genuine attempt, so the system knows *why* you opened it
- **Topic select/deselect** — roadmap recalculates on the fly when you add or remove topics
- **Streak + heatmap** — contribution-style activity tracking to keep consistency visible plus achievements and trophies
- **Notes to themselves for revision
- **Custom Reminders

---

## 🗂 Project Structure

```
pathforge/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/           # Dashboard, Roadmap, Problem, Onboarding
│   │   ├── components/      # Shared UI components
│   │   └── utils/           # Roadmap generator, weak point logic
│   └── public/
├── server/                  # Node.js + Express backend
│   ├── routes/              # auth, problems, progress, roadmap
│   ├── models/              # MongoDB schemas
│   └── middleware/
└── data/                    # Pre-generated problem bank (JSON)
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, plain CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT |
| Fonts | Instrument Sans, Geist Mono |

No TypeScript, no Tailwind, no ML libraries — intentionally lean until the project has users. The "adaptive" logic is weighted scoring in plain JavaScript, not a model.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)


## 📐 Roadmap Generation Logic

The roadmap generator takes three inputs — selected topics, deadline, and daily hours — and outputs an ordered problem schedule. Key rules:

- Topics are ordered by dependency graph (e.g. recursion before trees, arrays before sliding window)
- Daily problem quota = `total problems / available days`
- Weak point recalculation shifts weight toward patterns where the user has: opened hints 3+, opened solutions, or rated confidence ≤ 2
- If time is critically short, the system flags weak topics and moves forward rather than stalling the roadmap

---

## 🗺 Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/signup` | Create account |
| `/login` | Log in |
| `/onboarding` | Topic selection, deadline, experience level |
| `/dashboard` | Daily problems, streak, topic progress, revision due |
| `/roadmap` | Full problem list, expandable by topic |
| `/problem/:id` | Problem statement, hints, solution, dry run |

---

## 🔮 Planned (v2)

- Monaco editor scratchpad (no judge, just a scratch area)
- Visual step-through animations for trees and graphs
- Analytics page — radar chart, time-to-solve trends
- "Express mode" per topic for users with tight deadlines

---

## 📄 License

MIT
