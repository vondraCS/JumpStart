# JumpStart Frontend — Implementation Plan

## Current State
- `App.tsx`: routes `/`, `/register/*`, `/dashboard/*` (needs update)
- Landing page: functional but uses wrong palette and lacks Navbar/Footer
- Components: `Button`, `Card`, `Input` exist in `src/tsx/components/`
- Registration, Dashboard: placeholder stubs
- Missing: `api/`, `context/`, `hooks/`, `types/` directories; `navbar`, `badge`, `avatar`, `stepindicator`, `modal` components

---

## Phase 1 — Theme & Foundation
1. **Update `src/css/index.css`** — correct brand palette (`#2e2e28` bg, `#ffdd00`/`#f2ae00` brand, `#e4e1dd` text) + Inter font
2. **Update `src/css/components.css`** — restyle Button/Card/Input with new palette; add Badge, Avatar, StepIndicator, Modal CSS
3. **Create `src/tsx/types/index.ts`** — shared TypeScript interfaces (`User`, `Company`, `TeamMember`, `WizardState`, `TechStackItem`)

## Phase 2 — State & API Layer
4. **Create `src/tsx/context/WizardContext.tsx`** — wizard state (path: `"create"|"join"`, profile fields, team code)
5. **Create `src/tsx/context/AuthContext.tsx`** — auth state (currentUser, login, logout)
6. **Create `src/tsx/api/index.ts`** — mock API functions (`getTechStack`, `getMemberSkills`, `register`, `login`, `getTeam`)

## Phase 3 — Shared Components
7. **Create `src/tsx/components/navbar.tsx`** — sticky top nav; public variant (Home, Sign In, Get Started CTA); dashboard variant (avatar + dropdown)
8. **Create `src/css/navbar.css`**
9. **Create `src/tsx/components/badge.tsx`** — role/skill badge with `brand`, `tertiary`, `neutral` variants
10. **Create `src/tsx/components/avatar.tsx`** — circular avatar with initials fallback
11. **Create `src/tsx/components/stepindicator.tsx`** — numbered wizard progress bar
12. **Create `src/tsx/components/modal.tsx`** — modal/dialog overlay with close button

## Phase 4 — Auth Pages
13. **Create `src/tsx/pages/Auth/SignIn.tsx`** — centered glass card, email + password, submit button, link to register
14. **Create `src/tsx/pages/Auth/Register.tsx`** — "How do you want to get started?" with two large cards, step indicator (step 1 of 2)
15. **Create `src/tsx/pages/Auth/CreateProfile.tsx`** — name, role, skills tag input, resume file upload, step indicator (step 2 of 2)
16. **Create `src/tsx/pages/Auth/JoinTeam.tsx`** — search input, mock company results list, step indicator (step 2 of 2)
17. **Create `src/css/auth.css`**

## Phase 5 — Landing Refresh
18. **Update `src/tsx/Landing.tsx`** — correct headline ("Bringing your ideas from 0 to 1"), CTA → `/auth/register`, animated down-arrow, Footer section
19. **Update `src/css/landing.css`** — footer styles + down-arrow animation

## Phase 6 — Dashboard
20. **Update `src/tsx/pages/Dashboard/DashboardLayout.tsx`** — sidebar nav (Overview, Team, Tech Stack, Settings), team overview card, tech stack badges (mock), members list with badges
21. **Create `src/css/dashboard.css`**
22. **Note:** Radar chart requires `npm install recharts` — use a styled placeholder until installed

## Phase 7 — Wiring
23. **Update `src/tsx/App.tsx`** — new routes (`/auth/sign-in`, `/auth/register`, `/auth/create-profile`, `/auth/join-team`, `/dashboard`); render `<Navbar />` for all non-dashboard routes
24. **Update `src/tsx/index.tsx`** — wrap app with `WizardProvider` + `AuthProvider`
25. **Update `index.html`** — title "JumpStart" + Inter font preload

---

## Target File Structure
```
src/
├── css/
│   ├── index.css          ← global theme & CSS variables
│   ├── components.css     ← btn, card, input, badge, avatar, stepindicator, modal
│   ├── landing.css
│   ├── navbar.css
│   ├── auth.css
│   └── dashboard.css
└── tsx/
    ├── App.tsx
    ├── index.tsx
    ├── Landing.tsx
    ├── api/
    │   └── index.ts
    ├── context/
    │   ├── AuthContext.tsx
    │   └── WizardContext.tsx
    ├── hooks/              ← reserved for custom hooks
    ├── types/
    │   └── index.ts
    ├── components/
    │   ├── buttons.tsx     ← existing
    │   ├── cards.tsx       ← existing
    │   ├── Input.tsx       ← existing (+ TagInput, FileUpload added)
    │   ├── navbar.tsx
    │   ├── badge.tsx
    │   ├── avatar.tsx
    │   ├── stepindicator.tsx
    │   └── modal.tsx
    └── pages/
        ├── Auth/
        │   ├── SignIn.tsx
        │   ├── Register.tsx
        │   ├── CreateProfile.tsx
        │   └── JoinTeam.tsx
        └── Dashboard/
            └── DashboardLayout.tsx
```
