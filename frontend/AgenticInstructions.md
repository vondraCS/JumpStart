# Claude Code Frontend Prompt — JumpStart Startup Platform

---

## 1. Aesthetics

| Token | Value |
|---|---|
| Background | `#2e2e28` |
| Accent | `#e4e1dd` |
| Primary Brand | `#ffdd00` |
| Secondary Brand | `#f2ae00` |
| Tertiary | `#313e68` |

The aesthetic should feel like a premium SaaS product. Use the palette above, clean sans-serif typography (Inter, Lato, or Raleway), subtle glassmorphism for cards, and smooth fade/slide transitions between pages. Brand colors (`#ffdd00` / `#f2ae00`) are used for gradients, CTAs, and highlights — not as backgrounds.

---

## 2. Styling & Component Approach

- Use **vanilla CSS** for all styling.
- CSS files live in `src/css/`, one file per component group (e.g. `buttons.css`, `cards.css`, `navbar.css`).
- Component files live in `src/components/`, grouped by category:
  - `buttons.tsx` — all button variants
  - `cards.tsx` — all card variants
  - `inputs.tsx` — text inputs, tag inputs, file upload
  - `navbar.tsx` — top navigation bar
  - `modal.tsx` — modal/dialog
  - `badge.tsx` — role/skill badges
  - `avatar.tsx` — user avatar
  - `stepindicator.tsx` — wizard progress bar

---

## 3. Routing

Use **React Router v6**.

| Route | Page |
|---|---|
| `/` | Landing page |
| `/auth/sign-in` | Sign in |
| `/auth/register` | Join or Create choice |
| `/auth/create-profile` | Create profile (wizard step) |
| `/auth/join-team` | Join a team (wizard step) |
| `/dashboard` | Main dashboard |

The registration flow (`/auth/register` → `/auth/create-profile` or `/auth/join-team`) is a **multi-step wizard**. Preserve the following state across steps using React Context or Zustand:
- Selected path: `"create"` or `"join"`
- Profile fields: name, role, skills array, resume file
- Company/team code (for join path)

---

## 4. Page Layouts

### Navbar (shared across all pages)
- Sticky top, dark background (`#2e2e28`), logo left ("JumpStart" in brand gradient)
- Links: "Home", "Sign In", "Get Started" (CTA button, brand yellow)
- On dashboard: replace auth links with user avatar + dropdown (Profile, Sign Out)

---

### Landing (`/`)
Full-scrolling page with the following sections in order:

**Hero**
- Large headline using a linear gradient of the two brand colors: *"Bringing your ideas from 0 to 1"*
- Subtext: *"Build your team, discover your tech stack, and launch your company today."*
- CTA button: *"Start Building"* — links to `/auth/register`
- Animated down-arrow below the CTA; on click, smooth-scrolls to the Getting Started section

**Getting Started**
- Step-by-step walkthrough of how to use the platform (3–4 steps)
- Each step: icon, title, short description
- Layout: horizontal step cards or numbered vertical list

**About Us**
- Mission statement and company description
- Split layout: text left, graphic or illustration right

**Footer**
- Links, copyright, brand name

---

### Sign In (`/auth/sign-in`)
- Centered card (glassmorphism style)
- Fields: email, password
- Submit button (brand yellow)
- Link: "Don't have an account? Register"

---

### Register — Join or Create (`/auth/register`)
- Heading: *"How do you want to get started?"*
- Two large clickable cards side by side:
  - **"Create a Company"** → navigates to `/auth/create-profile`
  - **"Join a Team"** → navigates to `/auth/join-team`
- Wizard step indicator at top (Step 1 of 2)

---

### Create Profile (`/auth/create-profile`)
- Wizard step indicator at top (Step 2 of 2)
- Form fields: Full Name, Role/Title, Skills (tag input — type and press Enter to add), Resume (file upload UI only)
- Submit button: *"Create My Profile"*

---

### Join a Team (`/auth/join-team`)
- Wizard step indicator at top (Step 2 of 2)
- Search input: team code or company name
- Results list below with company name, member count, and a "Request to Join" button per result
- Mock data for results

---

### Dashboard (`/dashboard`)
- **Sidebar nav** (left): logo, nav links (Overview, Team, Tech Stack, Settings), user avatar at bottom
- **Main panel** (right):
  - Team overview card: company name, member count, short description
  - Tech stack recommendation section: list of recommended tools/languages with badges (mock data)
  - Spider/radar chart per member using **Recharts** — data parsed from mock JSON returned by backend API placeholder
  - Members list: avatar, name, role badge, skill badges

---

## 5. Backend

- Backend hosted on **Railway**, built with **Spring Boot + Java**
- All API calls are **placeholder functions** in `src/api/` returning mock/hardcoded JSON for now
- Planned backend APIs:
  - `GET /api/tech-stack` — returns recommended tech stack for a startup
  - `GET /api/members/:id/skills` — returns skill data JSON for spider graph rendering
  - `POST /api/auth/register` — account registration
  - `POST /api/auth/login` — account login
  - `GET/POST /api/team` — fetch and save team/company info
- Spider graph data will be returned as JSON and rendered client-side using **Recharts RadarChart**

---

## 6. File Structure

```
src/
├── api/              # Placeholder fetch functions (mock data)
├── components/       # Grouped component files (buttons.tsx, cards.tsx, etc.)
├── context/          # React Context for wizard state, auth state
├── css/              # One CSS file per component group + global.css
├── hooks/            # Custom React hooks
├── pages/            # One file per route (Landing.tsx, SignIn.tsx, etc.)
├── types/            # TypeScript interfaces and types
└── main.tsx          # App entry, Router setup
```

Add additional directories as needed.

---

## Prompt (Copy This Into Claude Code)

```
You are in plan mode to create a webapp project called JumpStart.

**Background:** I am building a SaaS platform that helps people turn tech startup ideas into real
companies. Users create a startup "team" — an object storing company info, members, skills,
resumes, and roles. Key features include: a recommended tech stack based on the idea and team
skills, a spider/radar chart of each member's skills, role management, and a team skills gap view.

**Tech stack:** React + TypeScript (Vite), vanilla CSS, React Router v6, SpringBoot/Java backend
accessed via REST APIs hosted on Railway. State management via React Context or Zustand.

**Visual direction:** Premium SaaS aesthetic using this exact palette:
- Background: #2e2e28
- Accent: #e4e1dd
- Primary Brand: #ffdd00
- Secondary Brand: #f2ae00
- Tertiary: #313e68
Use Inter, Lato, or Raleway for typography. Glassmorphism for cards. Smooth fade/slide transitions.
Brand yellow gradient is used for the hero headline, CTAs, and highlights — not as backgrounds.

**File structure:**
- src/pages/           → one file per route
- src/components/      → grouped by category (buttons.tsx, cards.tsx, inputs.tsx, navbar.tsx, etc.)
- src/css/             → one CSS file per component group + global.css
- src/context/         → wizard state, auth state
- src/hooks/
- src/api/             → placeholder fetch functions with mock data
- src/types/

**Shared components to build:**
buttons.tsx, cards.tsx, inputs.tsx (includes tag input + file upload), navbar.tsx, modal.tsx,
badge.tsx, avatar.tsx, stepindicator.tsx

**Routing (React Router v6):**
/ | /auth/sign-in | /auth/register | /auth/create-profile | /auth/join-team | /dashboard

The /auth/register → /auth/create-profile or /auth/join-team flow is a wizard. Persist the
user's chosen path ("create" or "join"), profile fields, and team code in React Context or Zustand.

**Pages:**
1. Landing (/) — Navbar, Hero (gradient headline, subtext, "Start Building" CTA, down-arrow),
   Getting Started (3–4 step cards), About Us (split layout), Footer
2. Sign In (/auth/sign-in) — Centered glassmorphism card, email + password, submit button
3. Register (/auth/register) — Two large cards: "Create a Company" and "Join a Team", step indicator
4. Create Profile (/auth/create-profile) — Name, role, skills tag input, resume upload UI, step indicator
5. Join a Team (/auth/join-team) — Search input, mock results list with join buttons, step indicator
6. Dashboard (/dashboard) — Sidebar nav, team overview card, tech stack section (mock),
   Recharts RadarChart per member (mock JSON), members list with role + skill badges

**API calls:** All backend calls are placeholder functions in src/api/ returning mock data.
Planned endpoints: /api/tech-stack, /api/members/:id/skills, /api/auth/register,
/api/auth/login, /api/team

**Goal:** Generate a complete foundational plan with folder structure, component list, routing
setup, and a build order. Do not generate all the code at once — outline the plan first, then
we will build section by section.
```