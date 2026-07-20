CRIS WR-008 — Mission Readiness Prototype

Scope
- Mission overview M1–M8 using the existing Commander Intelligence Engine
- Y / Q / N status and readiness score per mission
- Filter by readiness status
- Mission Decision Detail displayed in a modal
- Root causes, mission impact, recovery potential, supporting ships and evidence
- Links from affected/supporting ships to the existing Ship Decision Detail workflow

Architecture
- No Domain Model changes
- No Decision Engine changes
- Reuses FleetContext and buildCommanderIntelligence()
- Keeps evidence on demand in a modal

Verification
- npm run build
- npm run lint (when available)
