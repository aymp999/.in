# AYMP Security Lock v1

## Purpose

Protect the existing AYMP website and keep automation narrowly scoped while the growth system is expanded.

## Non-negotiable rules

1. Existing website sections and content are not to be deleted or replaced by automation.
2. The daily automation writer is allowed to change only:
   - `data/aymp-daily-state.json`
   - `automation/AYMP-AUTO-STATUS.md`
3. AI-generated wellness, news, promotional, or website copy must remain a draft until a human approval gate is added.
4. Wallet seed phrases, private keys, passwords, API keys, and authentication tokens must never be stored in the repository or exposed to the content engine.
5. Future secrets must be supplied through GitHub Actions Secrets or another dedicated secret manager, never hard-coded into website files.
6. Any unexpected file modification must stop the automation before a commit is made.
7. An emergency stop is supported by the environment variable `AYMP_AUTOMATION_DISABLED=true` in the workflow runtime. When enabled, the engine must exit without writing.

## Security layers

- **Write allow-list:** the daily engine may write only its two state/report files.
- **Secret scan:** generated or modified text is checked for common private-key, seed, password, and token patterns.
- **Audit trail:** each run records timestamp, engine version, zodiac cycle, module status, and safety status in the daily report.
- **Approval gate:** publication of generated external content is intentionally not automatic in v1.
- **Wallet isolation:** the growth automation has no wallet signing capability and must never receive a seed phrase/private key.

## Expansion rule

New automation capabilities are added as separate modules and reviewed before they are allowed to write to any existing website page. Existing site code remains outside the automation write allow-list unless the owner explicitly approves a later change.
