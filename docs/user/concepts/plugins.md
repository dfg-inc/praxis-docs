# Plugins, Skills, and isolation

## Plugin vs Skill vs Runtime

| Piece | You install | What Claude sees |
|-------|-------------|------------------|
| Runtime MCPB | once | MCP tools (`praxis_*`) |
| Role ZIP | per role you use | Skills for that role |
| Skill | nothing extra | A named playbook that *calls* Runtime tools |

## Independent role plugins

Install **Runtime + BA**, or **Runtime + Developer**, etc. A role plugin must load its Skills and call **its own** Runtime tools without another role ZIP being installed.

That is different from **workflow data**:

- Developer may need an existing Work Package and Architect handoff **files**
- Quality may need Developer evidence **files**
- Neither requires the other role’s ZIP in Claude Desktop

You can install Developer weeks after BA. You do not re-run BA merely because a new plugin was added.

## Isolation rules

- Each plugin ships its own Skills
- Role ZIPs do not embed Praxis Runtime
- No plugin depends on another plugin’s install path
- Roles do not share private in-memory state across plugins
- You do not need one Cowork session for all roles
- Unrelated Claude plugins may stay enabled
- Identify Praxis by Skill names (*Jira Epic Analysis*, *Implement Work Package*, …) and tools named `praxis_*`

## Coexistence

Do not disable every other Claude plugin to use Praxis. If a third-party Skill collides, prefer invoking the Praxis Skill by name.
