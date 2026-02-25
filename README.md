# xappio.AI

**Local conversational search across your entire video library.**

![xappio UI Preview](docs/ui-preview.png)

Ask questions in plain language, on your own hardware. xappio indexes footage, transcripts, and metadata — then lets you search, ideate, and build paper edits through natural conversation.

---

## Features

- **Archive Search** — Find clips across drives by content, dialogue, mood, or visual description
- **Live Transcript Navigation** — Scrub through footage via synchronized, searchable transcripts
- **Creative Ideation** — Attach briefs, research docs, and storyboards — build storylines in conversation
- **Media Browser** — Browse, preview, and inspect clips with full tech specs and production notes
- **Add to Selects** — Build and export selects with FCPXML, EDL, and SRT support
- **Document Attachments** — Cross-reference PDFs, Google Docs, and images against your archive

---

## Prerequisites

Before you begin, make sure you have the following installed on your machine. See [`requirements.txt`](requirements.txt) for version details.

| Tool | Version | What it does | Install |
|------|---------|-------------|---------|
| **Node.js** | v20 or newer | JavaScript runtime that powers the dev server | [nodejs.org](https://nodejs.org/) |
| **npm** | v10 or newer | Package manager (comes with Node.js) | Included with Node.js |
| **Git** | v2.30 or newer | Version control to clone the repo and push changes | [git-scm.com](https://git-scm.com/) |

### Verify your install

Open a terminal and run:

```bash
node -v    # Should print v20.x.x or newer
npm -v     # Should print 10.x.x or newer
git --version  # Should print git version 2.30+
```

If any command is not found, install the corresponding tool from the links above.

---

## Getting Started — Step by Step

### 1. Create a project directory

> **Tip:** We recommend creating your project on a separate drive or a folder where you have full read/write permissions. This avoids permissions issues that can happen in system-protected directories (like `/usr/` on macOS). If you must use a system directory, prefix commands with `sudo`.

**macOS / Linux:**
```bash
# Option A: On a separate project drive (recommended)
mkdir -p /Volumes/YourDrive/projects
cd /Volumes/YourDrive/projects

# Option B: In your home directory
mkdir -p ~/projects
cd ~/projects
```

**Windows (PowerShell):**
```powershell
# Option A: On a separate drive
mkdir D:\projects
cd D:\projects

# Option B: In your user folder
mkdir ~\projects
cd ~\projects
```

### 2. Clone the repository

```bash
git clone https://github.com/Hank-tha-Cowdog/xappio-marketing.git
```

This creates a folder called `xappio-marketing` with all the code inside.

### 3. Navigate into the project

```bash
cd xappio-marketing
```

> **Important:** You must be inside this `xappio-marketing` directory before running any `npm` commands. All commands below assume you are in this folder.

### 4. Install dependencies

```bash
npm install
```

This reads `package.json` and downloads all required packages into a `node_modules` folder. It may take a minute on first run.

### 5. Start the development server

```bash
npm run dev
```

You should see output like:

```
▲ Next.js 16.1.6
- Local: http://localhost:3000
```

### 6. View the site

Open your browser and go to **[http://localhost:3000](http://localhost:3000)**

You should see the xappio marketing site with the animated typing hero and 3D UI sections.

> **To stop the server**, press `Ctrl + C` in the terminal.

---

## Making Changes

### Edit files

The source code lives in the `src/` folder. Edit any `.tsx` or `.css` file and the dev server will hot-reload your changes instantly in the browser — no need to restart.

### Build for production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm start
```

### Run the linter

```bash
npm run lint
```

---

## Working with Git — Branching & Pushing Changes

### Check which branch you're on

```bash
git branch
```

The active branch will have a `*` next to it. By default you'll be on `main`.

### Create a new branch for your work

> **Never push directly to `main`.** Always create a new branch for your changes.

```bash
git checkout -b your-branch-name
```

Name it something descriptive, like `feature/new-hero-section` or `fix/mobile-layout`.

### See what you've changed

```bash
git status          # Shows which files were modified
git diff            # Shows the actual line-by-line changes
```

### Stage and commit your changes

```bash
# Stage specific files
git add src/components/IsometricUI.tsx src/app/globals.css

# Or stage everything you changed
git add -A

# Commit with a descriptive message
git commit -m "Add new animation to IsometricUI section"
```

### Push your branch to GitHub

The first time you push a new branch:

```bash
git push -u origin your-branch-name
```

After that, just:

```bash
git push
```

### Create a Pull Request

1. Go to [github.com/Hank-tha-Cowdog/xappio-marketing](https://github.com/Hank-tha-Cowdog/xappio-marketing)
2. You'll see a banner saying your branch was recently pushed — click **"Compare & pull request"**
3. Write a description of your changes
4. Click **"Create pull request"**
5. Wait for review before merging into `main`

### Pull the latest changes from main

Before starting new work, always sync with the latest code:

```bash
git checkout main
git pull origin main
```

Then create a new branch from the updated main:

```bash
git checkout -b your-new-branch
```

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.1.6 | React framework with App Router and server components |
| [React](https://react.dev/) | 19.2.3 | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first CSS framework |
| [ESLint](https://eslint.org/) | 9.x | Code quality and consistency |

**Fonts:** Space Grotesk (body) + Space Mono (code/typing animation)
**Images:** All loaded from Unsplash CDN at runtime — no local image files in the repo.

---

## Project Structure

```
xappio-marketing/
├── docs/
│   └── ui-preview.png              # Screenshot used in this README
├── src/
│   ├── app/
│   │   ├── globals.css             # Tailwind config + keyframe animations
│   │   ├── layout.tsx              # Root layout: fonts, navigation, metadata
│   │   ├── page.tsx                # Homepage — imports and orders all sections
│   │   ├── join-beta/page.tsx      # Beta signup (placeholder)
│   │   └── marketing/page.tsx      # Press/brand resources (placeholder)
│   ├── components/
│   │   ├── HeroSection.tsx         # Full-viewport hero with purple glow
│   │   ├── TypingAnimation.tsx     # 15-query typing state machine
│   │   ├── IsometricUI.tsx         # 3D archive search — "Golden Hour Discovery" story
│   │   ├── DescriptionSection.tsx  # Value proposition + CTA
│   │   ├── TranscriptUI.tsx        # Transcript navigation with scene-matched playback
│   │   ├── IdeationUI.tsx          # Creative ideation with document attachments
│   │   ├── MediaBrowserUI.tsx      # Media browser with detail modal + tabs
│   │   ├── VideoPlaceholder.tsx    # Testimonials / social proof section
│   │   └── Navigation.tsx          # Fixed top navigation bar
│   └── lib/
│       └── images.ts               # Shared Unsplash image URLs + getHighRes() helper
├── package.json                    # Dependencies and scripts
├── requirements.txt                # Prerequisites for local development
├── tsconfig.json                   # TypeScript configuration
├── next.config.ts                  # Next.js configuration
└── README.md                       # This file
```

---

## Page Sections (top to bottom)

| # | Section | Component | Description |
|---|---------|-----------|-------------|
| 1 | Hero | `HeroSection.tsx` | Animated typing queries with purple glow backdrop |
| 2 | Archive Search | `IsometricUI.tsx` | 3D isometric UI — chat, media grid, dynamic playback, selects |
| 3 | Description | `DescriptionSection.tsx` | Value proposition copy and call-to-action |
| 4 | Transcript | `TranscriptUI.tsx` | Timeline scrubbing with live transcript and AI navigation |
| 5 | Ideation | `IdeationUI.tsx` | Attach documents, cross-reference research, build storylines |
| 6 | Media Browser | `MediaBrowserUI.tsx` | Grid browse, preview, detail modal with transcript/scene/notes |
| 7 | Testimonials | `VideoPlaceholder.tsx` | Social proof section |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `command not found: node` | Install Node.js from [nodejs.org](https://nodejs.org/) |
| `command not found: git` | Install Git from [git-scm.com](https://git-scm.com/) |
| `EACCES: permission denied` | You're in a protected directory. Move to a user-owned folder, or use `sudo npm install` |
| `npm install` hangs or fails | Delete `node_modules` and `package-lock.json`, then run `npm install` again |
| Port 3000 already in use | Another process is using it. Run `npx kill-port 3000` or use `npm run dev -- -p 3001` |
| Images not loading | Check your internet connection — all images load from Unsplash CDN |
| Hot reload not working | Make sure you saved the file. Try stopping the server (`Ctrl+C`) and running `npm run dev` again |

---

## License

Proprietary. All rights reserved.
