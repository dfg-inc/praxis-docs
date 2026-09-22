import { defineConfig } from "vitepress";

const enNav = [
  { text: "Getting started", link: "/getting-started/overview" },
  { text: "Plugins", link: "/plugins/overview" },
  { text: "Workflows", link: "/workflows/full-e2e" },
  { text: "Prompts", link: "/reference/prompts" },
  { text: "Reference", link: "/reference/configuration" },
];

const enSidebar = {
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
  // Unique-domain GitLab Pages: https://praxis-docs-e263c2.pages.jetru.by
  base: "/",
  title: "Praxis Docs",
  description: "Install and use Praxis with Claude Desktop and Cowork",
  srcDir: "../../docs/user",
  lastUpdated: true,
  themeConfig: {
    nav: [
      ...enNav,
      { text: "Marketplace", link: "https://praxis-marketplace-833761.pages.jetru.by/" },
    ],
    sidebar: {
      ...enSidebar,
      "/": [
        { text: "Getting started", items: enSidebar["/getting-started/"] },
        { text: "Concepts", items: enSidebar["/concepts/"] },
        { text: "Plugins", items: enSidebar["/plugins/"] },
        { text: "Workflows", items: enSidebar["/workflows/"] },
        { text: "Reference", items: enSidebar["/reference/"] },
      ],
    },
    outline: { level: [2, 3] },
    search: { provider: "local" },
    socialLinks: [],
  },
});
