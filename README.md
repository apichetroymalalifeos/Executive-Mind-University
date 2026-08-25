# Executive Mind University

Local-first MVP foundation for a mobile-first system that trains thinking, decision quality, action, and reflection.

## Phase 1 Scope

- Vite, React, TypeScript strict, React Router.
- Feature-based folders for curriculum, daily learning, application, decisions, reviews, knowledge, future readiness, and settings.
- Versioned local data envelope under `executiveMindUniversity.v1`.
- Storage repository abstraction so the domain is not coupled to `localStorage`.
- Validation, migration with backup, import preview, dry-run import, and export helpers.
- App shell with the required primary routes.
- Unit and UI smoke tests for core rules and main routes.

## Dependencies and Rationale

- `react`, `react-dom`: UI foundation.
- `react-router-dom`: required route architecture.
- `vite`, `@vitejs/plugin-react`: fast local development and production build.
- `typescript`: strict domain and data contracts.
- `vitest`, `jsdom`, `@testing-library/*`: unit and UI tests.
- `eslint`, `prettier`: quality gates required before claiming a phase is complete.

No backend, cloud database, login, paid API, API keys, or shared Life OS storage keys are used in Phase 1.

## Storage

Root key: `executiveMindUniversity.v1`

The stored data envelope contains:

- `schemaVersion`
- `appVersion`
- `createdAt`
- `updatedAt`
- `profile`
- `settings`
- `curriculumProgress`
- `decisions`
- `exercises`
- `reviews`
- `knowledgeSources`
- `lessonRevisions`
- `futureScenarios`
- `auditLog`

## Known Limitations

- Lesson 1 content, audio learning flow, decision journal UI, Knowledge Center UI, and Future dashboard are intentionally deferred to later phases.
- Phase 1 uses a defensive hand-written validator. If schemas become significantly larger, a small runtime schema library may be justified in a later ADR.
- IndexedDB is not used yet because Phase 1 data volume is small and the request prefers the simplest stable storage choice.

## Manual Test Checklist

See `docs/manual-acceptance-checklist.md`.
