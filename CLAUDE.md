# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JumpStart is an AI-powered startup team role assignment platform. Users register a startup and team members with skills, then trigger a Claude API analysis that assigns roles and identifies skill gaps.

## Commands

### Frontend (`/frontend`)
```bash
npm run dev        # Start Vite dev server (HMR)
npm run build      # TypeScript check + production build
npm run lint       # ESLint
npm run preview    # Preview production build locally
npm run deploy     # Build + deploy to GitHub Pages
```

### Backend (`/backend`)
```bash
mvn spring-boot:run          # Start the Spring Boot server (port 8080)
mvn clean install            # Full build
mvn test                     # Run tests
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=8081"  # Custom port
```

### Backend environment variables required
```
DB_USERNAME=<postgres username>
DB_PASSWORD=<postgres password>
CLAUDE_API_KEY=<anthropic api key>
```
Database: PostgreSQL at `localhost:5432/JumpStart_database`

## Architecture

### Frontend
- **React 19 + TypeScript + Vite** SPA deployed to GitHub Pages at `/JumpStart/`
- Source in `frontend/src/tsx/` (components) and `frontend/src/css/` (styles)
- `index.html` mounts to `<div id="landing">`, rendered by `src/tsx/index.tsx`
- Anthropic SDK (`@anthropic-ai/sdk`) is installed for future Claude API calls from the frontend

### Backend
- **Spring Boot 3.2.3 + Java 17** REST API, layered architecture: Controller → Service → Repository → Entity
- API base path: `/api`, CORS open to all origins
- **ClaudeApiService** calls the Claude API to analyze team data — `analyzeTeam()` is not yet implemented
- **AnalysisService** orchestrates analysis: receives startup ID, calls ClaudeApiService, parses JSON response, persists `RoleAssignment` and `RoleGap` entities

### Data Model
- `Startup` → many `TeamMember` → many `Skill` (categorized by `SkillCategory` enum: TECHNICAL, DESIGN, MARKETING, SALES, OPERATIONS, DOMAIN)
- `AnalysisResult` → many `RoleAssignment` (member + assigned role + confidence + reasoning) and `RoleGap`

### Key API Endpoints
- `POST /api/startups/{startupId}/analyze` — triggers Claude analysis
- `GET /api/startups/{startupId}/analyze/results` — retrieves latest analysis
- `GET /api/startups/{startupId}/heatmap` — skill heatmap data

## Current State

- Frontend UI is early-stage: landing page and button components exist; `dashboard.html`, `registration.html`, and `cards.tsx` are empty placeholders
- Backend entity/repository/controller layer is scaffolded; `ClaudeApiService.analyzeTeam()` and `AnalysisService.analyzeTeam()` need implementation
- No tests exist yet in either frontend or backend
