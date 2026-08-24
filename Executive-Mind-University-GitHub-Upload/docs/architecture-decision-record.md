# Architecture Decision Record

## ADR-001: New Isolated Project

Decision: Create a separate Vite React TypeScript project under `executive-mind-university`.

Reason: The request explicitly forbids modifying Life OS and requires a new product with separate storage keys.

## ADR-002: Local-first Phase 1 Storage

Decision: Use `localStorage` through `StorageDriver` and `AppDataRepository` interfaces.

Reason: It is the simplest stable option for Phase 1 and keeps future IndexedDB migration possible.

Storage root key: `executiveMindUniversity.v1`

## ADR-003: Versioned Data Envelope

Decision: Store all user data inside a versioned envelope.

Reason: Every schema needs a version, migration strategy, backup, rollback, and import/export safety.

## ADR-004: Hand-written Runtime Validation in Phase 1

Decision: Use focused type guards and validators without a schema dependency.

Reason: Avoid dependency weight until schema complexity justifies a library. This can be revisited when Lesson 1, decision journal, and Knowledge Center mature.

## ADR-005: Rule-based Recommendation First

Decision: Daily Learning Engine uses deterministic rules in MVP.

Reason: The request forbids paid APIs and does not need AI to prove the core value loop.

## ADR-006: Human-reviewed Knowledge Updates

Decision: Knowledge updates start as drafts and require review before publication.

Reason: Prevents automatic propagation of unverified or low-quality content.
