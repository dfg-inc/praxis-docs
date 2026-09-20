# `.project` configuration

`.project` describes the **product** folder. Claude can infer it (`praxis_project_init_preview` / `_apply`). Ordinary users should not create it by hand if that flow is available.

Counter example:

```yaml
stack:
  - node
  - javascript
requirementsFormat: user-story-gherkin
requiredArtifacts: []
environments: []
knowledge:
  ref: main
jira: {}
quality:
  test: npm test
```

| Field | Required | Meaning |
|-------|----------|---------|
| `stack` | inferred | Languages/tools for Skills |
| `requirementsFormat` | inferred | How BA writes AC |
| `requiredArtifacts` | no | Extra files to demand |
| `environments` | no | Named envs |
| `knowledge.ref` | no | Knowledge corpus ref |
| `jira` | no | Non-secret Jira hints. **Never a token** |
| `quality.test` | for Developer complete / Quality | Command actually run (e.g. `npm test`) |
| `quality.build` / `coverage` / `start` | no | Optional Quality commands |

Secrets do not belong here. See [Secrets](/reference/secrets).
