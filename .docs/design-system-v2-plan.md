# Superseded — the plan now lives in `.docs/plan/`

On 2026-10-27 this monolith was split into [plan/](./plan/) so that each phase can be read and
implemented independently (the folder's `README.md` is the entry point and explains the protocol).

- Overall context and locked decisions: [plan/01-context.md](./plan/01-context.md)
- The complete token contract: [plan/02-token-contract.md](./plan/02-token-contract.md)
- Phases 1–8: [plan/03](./plan/03-phase-1-tokens-revendor.md) …
  [plan/10](./plan/10-phase-8-verify-release.md)
- Risks, rollback, definition of done: [plan/11-risks-dod.md](./plan/11-risks-dod.md)

**Do not implement from this file.** It is retained only so that older links resolve; its content
was migrated and superseded (the token set in `plan/02` is strictly larger and the phase numbering
changed twice: old "Phase 2.5" is now Phase 3, old Phase 3 → 4, old Phase 4 → 5, old Phase 5 → 6; and
on 2026-10-28 the audit additions inserted Phase 6 *Completeness* and Phase 7 *Palettes*, so the old
Phase 6 verification checklist is now **Phase 8** and the risks file moved `09` → `11`).
