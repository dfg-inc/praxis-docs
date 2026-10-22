import { defineConfig } from "vitepress";

const enNav = [
  { text: "Getting started", link: "/getting-started/overview" },
  { text: "User guide", link: "/guide/create-project" },
  { text: "Plugins", link: "/plugins/overview" },
  { text: "Workflows", link: "/workflows/full-e2e" },
  { text: "Technical", link: "/technical/architecture" },
  { text: "Prompts", link: "/reference/prompts" },
  { text: "Reference", link: "/reference/configuration" },
];

const guideSidebar = [
  { text: "Create a project", link: "/guide/create-project" },
  { text: "Work without Jira", link: "/guide/without-jira" },
  { text: "BA: requirements and Stories", link: "/guide/ba" },
  { text: "Architect: decisions", link: "/guide/architect" },
  { text: "Developer: implementation", link: "/guide/developer" },
  { text: "Quality: checks and fixes", link: "/guide/quality" },
  { text: "Handoffs and going back", link: "/guide/handoffs" },
  { text: "Several repositories", link: "/guide/multi-repo" },
  { text: "Git: commits, branches, PR/MR", link: "/guide/git-delivery" },
  { text: "Jira and SimpleOne", link: "/guide/jira-simpleone" },
  { text: "Approval Required and Trusted Client", link: "/guide/approval-modes" },
];

const technicalSidebar = [
  { text: "Architecture", link: "/technical/architecture" },
  { text: "Core/Runtime compatibility", link: "/technical/compatibility" },
  { text: "MCP tools catalog", link: "/technical/tools-catalog" },
  { text: "Plugin manifests and dependencies", link: "/technical/plugin-manifests" },
  { text: "Marketplace distribution", link: "/technical/marketplace-distribution" },
  { text: "Configuration", link: "/technical/configuration" },
  { text: "Security model", link: "/technical/security-model" },
  { text: "Diagnostics", link: "/technical/diagnostics" },
  { text: "Troubleshooting", link: "/technical/troubleshooting" },
  { text: "Release process", link: "/technical/release-process" },
];

const enSidebar = {
  "/guide/": guideSidebar,
  "/technical/": technicalSidebar,
  "/getting-started/": [
    { text: "Overview", link: "/getting-started/overview" },
    { text: "Requirements", link: "/getting-started/requirements" },
    { text: "Installation", link: "/getting-started/installation" },
    { text: "Jira credentials", link: "/getting-started/credentials" },
    { text: "First run", link: "/getting-started/first-run" },
    { text: "Update", link: "/getting-started/update" },
    { text: "Uninstall", link: "/getting-started/uninstall" },
  ],
  "/concepts/": [
    { text: "Core", link: "/concepts/core" },
    { text: "Runtime", link: "/concepts/runtime" },
    { text: "Plugins and Skills", link: "/concepts/plugins" },
    { text: "Work Packages", link: "/concepts/work-packages" },
    { text: "Jira workflow", link: "/concepts/jira-workflow" },
    { text: "Human approval", link: "/concepts/approvals" },
    { text: "Marketplace", link: "/concepts/marketplace" },
  ],
  "/plugins/": [
    { text: "Compare roles", link: "/plugins/overview" },
    { text: "Praxis BA", link: "/plugins/ba" },
    { text: "Praxis Architect", link: "/plugins/architect" },
    { text: "Praxis Developer", link: "/plugins/developer" },
    { text: "Praxis Quality", link: "/plugins/quality" },
  ],
  "/workflows/": [
    { text: "Full end-to-end", link: "/workflows/full-e2e" },
    { text: "Existing Epic", link: "/workflows/existing-epic" },
    { text: "BA only", link: "/workflows/ba-only" },
    { text: "Architect only", link: "/workflows/architect-only" },
    { text: "Developer only", link: "/workflows/developer-only" },
    { text: "GitHub Delivery", link: "/workflows/github-delivery" },
    { text: "Quality only", link: "/workflows/quality-only" },
    { text: "Resume mid-flow", link: "/workflows/resume" },
  ],
  "/reference/": [
    { text: "Configuration", link: "/reference/configuration" },
    { text: "Tools", link: "/reference/tools" },
    { text: "Artifacts", link: "/reference/artifacts" },
    { text: "Prompt library", link: "/reference/prompts" },
    { text: "Jira permissions", link: "/reference/permissions" },
    { text: "Secrets", link: "/reference/secrets" },
    { text: "Troubleshooting", link: "/reference/troubleshooting" },
    { text: "FAQ", link: "/reference/faq" },
    { text: "Changelog", link: "/reference/changelog" },
  ],
};

export default defineConfig({
  // Served from the site root.
  base: "/",
  title: "Praxis Docs",
  description: "Install and use Praxis from the Claude plugin marketplace",
  srcDir: "../../docs/user",
  lastUpdated: true,
  themeConfig: {
    nav: [
      ...enNav,
      { text: "Marketplace", link: "https://github.com/dfg-inc/praxis-marketplace" },
    ],
    sidebar: {
      ...enSidebar,
      "/": [
        { text: "Getting started", items: enSidebar["/getting-started/"] },
        { text: "Concepts", items: enSidebar["/concepts/"] },
        { text: "User guide", items: guideSidebar },
        { text: "Plugins", items: enSidebar["/plugins/"] },
        { text: "Workflows", items: enSidebar["/workflows/"] },
        { text: "Technical", items: technicalSidebar },
        { text: "Reference", items: enSidebar["/reference/"] },
      ],
    },
    outline: { level: [2, 3] },
    search: { provider: "local" },
    socialLinks: [],
  },
});
