# Privacy and Security Notes

- Phase 1 stores data locally in the browser under `executiveMindUniversity.v1`.
- No personal decisions are transmitted.
- No API keys, secrets, backend calls, login, or cloud database are used.
- Imported JSON is parsed as data only and never executed.
- Import payloads are size-limited and validated before any write.
- Invalid imports return errors and preserve existing data.
- Significant data changes should create audit log entries.
- Full data deletion must require confirmation in the Settings UI in a later phase.
