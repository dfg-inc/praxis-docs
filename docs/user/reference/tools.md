# Public Runtime tools

Names must match the MCP catalog. Do not invent aliases.

**Common:** `praxis_doctor`, `praxis_project_status`, `praxis_project_init_preview`, `praxis_project_init_apply`, `praxis_jira_smoke`, `praxis_jira_discover`, `praxis_jira_epic`, `praxis_jira_status`

**BA:** `praxis_ba_status`, `praxis_ba_preview`, `praxis_ba_apply`

**Architect:** `praxis_architect_status`, `praxis_architect_preview`, `praxis_architect_apply`

**Work package:** `praxis_work_package_list`, `praxis_work_package_show`, `praxis_work_package_status`

**Developer:** `praxis_developer_status`, `praxis_developer_claim`, `praxis_developer_release`, `praxis_developer_complete`, `praxis_developer_complete_recovery_preview`, `praxis_developer_complete_recovery_apply`, `praxis_developer_git_status`, `praxis_developer_git_connect_preview`, `praxis_developer_git_connect_apply`, `praxis_developer_git_identity_preview`, `praxis_developer_git_identity_apply`, `praxis_developer_git_preview`, `praxis_developer_git_commit`, `praxis_developer_git_publish_preview`, `praxis_developer_git_publish`, `praxis_developer_git_merge_request_preview`, `praxis_developer_git_merge_request`, `praxis_developer_git_delivery_status`, `praxis_developer_git_link_jira_preview`, `praxis_developer_git_link_jira_apply`

**Quality:** `praxis_quality_status`, `praxis_quality_ensure`, `praxis_quality_review`, `praxis_quality_report`, `praxis_quality_review_show`, `praxis_quality_apply_preview`, `praxis_quality_apply_status`, `praxis_quality_apply`

Apply tools require `confirmation=YES`. BA/Architect apply and Quality apply also require `previewFingerprint`. Quality Review does **not** require confirmation and does **not** write Jira.
