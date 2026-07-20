CRIS WR-007 — FLEET STATUS MODULE PROTOTYPE

STATUS
- Command Center remains locked; no command components or decision logic changed.
- Fleet Status prototype implemented from existing FleetContext and readiness engines.

COMPLETED
- Fleet-level counts: total, Y, Q, N, average readiness.
- Search and readiness filter retained.
- Compact ship cards with score, status, crew and critical limitation.
- Ship selection opens a decision-focused modal without changing page position.
- Modal shows current status, critical limitation, mission impact, equipment evidence and recommendation.
- Link to the existing full Ship Detail route.
- No Domain Model changes.

PENDING
- Training, logistics and maintenance evidence are not in the current Ship Domain Model.
- Full M1-M8 per-ship assessment remains dependent on expansion of the Mission Capability Framework.
- Ship Detail UX consolidation is Task 03 and is not included in this prototype.

KNOWN RISKS
- Alert text is currently English because it is reused directly from the existing alert engine.
- Mission coverage reflects only mission definitions supported by the current engine.

RECOMMENDATION
- Approve the Fleet Status information hierarchy before starting Ship Detail consolidation.
- Add missing readiness evidence through a separate Domain Model decision, not as UI-only mock data.

DECISIONS REQUIRED FROM WAR ROOM
1. Confirm whether training, logistics and maintenance become first-class Ship Domain fields.
2. Confirm the authoritative M1-M8 requirement set before extending per-ship mission assessment.
