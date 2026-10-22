# Several repositories and services in one work item

A feature often spans a frontend, an API and a worker. Praxis models this with services inside one work item, and with links between work items in different repositories.

## Services

The Architect declares each service with `set-service`:

- `id`, `name`, `kind` (`application`, `module`, `api`, `worker`, `frontend`, `persistence`, `external`).
- Where the code is: `repository`, `localPath`, `remoteUrl`, `branch`.
- `responsibilities`, `requirementIds`, `dependsOn`.

A monolith is one service. Separate repositories stay separate and explicit. The Developer records one `record-implementation` per service. One finished service does not complete the feature. Quality returns `serviceVerdicts` and a feature `verdict`; the feature fails if any service lacks a current implementation and approval.

## What you say

> Architect: the orders feature needs `orders-api` in /work/orders-api and `orders-web` in /work/orders-web. Define both services, web depends on api.
> Quality: locate the repositories, and ask me only for services you cannot find.

`locate-repositories` lists each service's location. Quality asks only for services with neither `localPath` nor `remoteUrl`.

## One workflow repository, several work items

One repository can hold several work items. Address one with `workItemId` on `praxis_workflow_status`, `praxis_workflow_inspect`, `praxis_workflow_preview` and `praxis_workflow_apply`, or switch with `select-work-item`. Without a selection and with more than one item, Praxis refuses with `WORK_ITEM_SELECTION_REQUIRED` and lists the ids. Quality checks are scoped per work item (`.praxis/quality/<work item id>/checks.json`).

## Linking work items across repositories

`link-work-item` with `target: { repository, workItemId, relation }`, relation `depends-on`, `blocks`, `relates-to` or `derived-from`. Repeating the same link changes nothing. Praxis stores the link; it does not open the other repository for you.

## Git

Git delivery runs per repository: open the repository you are delivering and use its Work Package. See [Git delivery](/guide/git-delivery). Quality fixes (`prepare-fix`) work on the service's own `localPath` and can push the fix branch to its `remoteUrl`, with separate approvals for commit and push.

Not verified: a single end-to-end session driving two real repositories through Git delivery in this release.

## If something goes wrong

- `REPOSITORY_LOCATION_MISSING`: a service has no `localPath`. Add it with `set-service`.
- `WORK_ITEM_SELECTION_REQUIRED`, `WORK_ITEM_NOT_FOUND`, `WORK_ITEM_INVALID`: select an existing work item.
- `WORKFLOW_MISSING`: open one first.
- `UNSAFE_PATH`: a patch or implementation path leaves the service directory.
- `GIT_REPOSITORY_UNAVAILABLE`: the path is not a Git repository.
