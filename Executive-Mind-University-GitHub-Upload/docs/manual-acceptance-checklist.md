# Manual Acceptance Checklist

- Fresh install opens the app.
- Existing user data at supported schema migrates with backup.
- Corrupt stored data falls back safely without deleting previous value.
- Invalid import shows errors and does not overwrite current data.
- Import dry-run can preview valid data.
- Empty curriculum route renders an intentional state.
- Unsupported speech synthesis can be detected in later audio UI.
- Mobile viewport keeps navigation and text readable.
- Long Thai content does not overflow route containers.
- Refresh during data entry is protected in later form phases.
- Offline usage works for Phase 1 shell and local data.
- No Life OS files are modified.
- `executiveMindUniversity.v1` does not collide with Life OS storage.
