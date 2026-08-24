# Phase 2 Pre-flight

Target project: `executive-mind-university`

Scope:

- Build Phase 2 Core Learning Loop.
- Preserve `executiveMindUniversity.v1` storage key.
- Keep local-first architecture.
- Do not touch Life OS.

Risk notes:

- Schema must move from v1 to v2 because Phase 2 requires structured lesson progress, quiz attempts, action status, and daily reviews.
- Migration must preserve Phase 1 data.
- Speech synthesis must gracefully fall back when unsupported.
- Exercise autosave must avoid data loss on refresh.
