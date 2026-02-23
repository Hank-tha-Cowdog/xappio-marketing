# xappio.AI — Marketing Website

Marketing website for xappio.AI, a creative intelligence system for local conversational search across video libraries.

## Overview

A three-page Next.js site featuring a typing animation that simulates natural-language queries against media archives — the core interaction model of xappio.AI.

**Pages:**
- **Home** — Hero with animated typing demo + product description
- **Join Beta** — Beta signup (placeholder)
- **Marketing** — Press and brand resources (placeholder)

## Tech Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Fonts: Inter (body/UI) + Space Mono (typing animation)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── globals.css             # Tailwind + cursor-blink animation
│   ├── layout.tsx              # Root layout: fonts, nav, black bg
│   ├── page.tsx                # Homepage
│   ├── join-beta/page.tsx      # Beta signup placeholder
│   └── marketing/page.tsx      # Marketing placeholder
└── components/
    ├── Navigation.tsx           # Fixed top nav with blur
    ├── TypingAnimation.tsx      # Typing state machine (client component)
    ├── HeroSection.tsx          # Full-viewport hero wrapper
    └── DescriptionSection.tsx   # Below-the-fold product copy
```
