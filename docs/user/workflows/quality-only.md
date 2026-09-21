# Quality only

Install Runtime + `praxis-quality.zip`. You need Developer completion evidence and `developer.quality.handoff`. The Developer plugin ZIP is optional.

Do not treat Jira Done as the readiness signal (that was the alpha.34 trap).

## Desktop flow

1. Open the Quality Skill (*Review Work Package* or *Quality Status*).
2. `praxis_quality_status` — expect `not_started` on a fresh machine.
3. `praxis_quality_ensure` — Runtime starts the bundled Quality service and waits for health. You do not install Node or SQLite.
4. Confirm `.praxis-quality/quality.sqlite` exists only after ensure.
5. Inspect evidence and the handoff.
6. Preview review findings. **Stop.**
7. `praxis_quality_review` with `confirmation=YES` only after you accept the preview.

Ensure does not approve QA. Review remains a separate approval.

If ensure fails, read the error code and [Troubleshooting](/reference/troubleshooting). Do not run `make quality-up` or `npm start` as the normal Desktop path.
