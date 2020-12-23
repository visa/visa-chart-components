# Contributing to Visa Chart Components

Thank you for being a part of the Visa Chart Components (VCC) community. Before contributing (whether opening an issue or a PR), please read this document in its entirety.

Whenever a ticket or PR is opened, we will do our best to get back to you and guide you through our contribution process. Below are a few guidelines that will help you along the way.

## Contents

- <a href="Reporting_Issues">Reporting Issues</a>
  - <a href="Opening_an_Issue">Opening an Issue</a>
  - <a href="Issue_Guidelines">Issue Guidelines</a>
- <a href="Contributing_Code">Contributing Code</a>
  - <a href="Architecture_Philosophy">Architecture Philosophy</a>
  - <a href="Branching_Structure">Branching Structure</a>
  - <a href="Setup">Setup</a>
  - <a href="Commit_Messages_and_Pull_Requests">Commit Messages and Pull Requests</a>

<hr>
<br>

## <a name="Reporting_Issues" href="Reporting_Issues">#</a> Reporting Issues

If you think you have found a bug or issue or have a feature request please start by making sure it hasn't already been reported, fixed, or implemented. You can search through existing issues and PRs to see if someone has reported one similar to yours.

### <a name="Opening_an_Issue" href="Opening_an_Issue">#</a> Opening an Issue

If you have identified a bug, issue, or feature request that has no existing PRs or tickets, create a new issue that briefly explains the problem, and provides a bit of background as to the circumstances that triggered it, and steps to reproduce it.

- For code issues please include:

  - `@visa/charts` library version or specific component (`@visa/bar-chart`) version
  - Browser and version
  - A code example, link to a repo, gist or running site. This will help us repro and identify the issue.

- For visual or layout problems, using images or animated gifs can help explain your issue.

- For feature requests please include a link to any relevant examples, a screenshot, or even a sketch of your requested feature.

### <a name="Issue_Guidelines" href="Issue_Guidelines">#</a> Issue Guidelines

- Begin the title with '[ComponentName]' where appropriate, and use a succinct description. "doesn't work" doesn't help others find similar issues.
- Do not group multiple topics into one issue, but instead each should be its own issue.

<hr>
<br>

## <a name="Contributing_Code" href="Contributing_Code">#</a> Contributing Code

Before contributing code or opening a PR, please open a feature request or issue (see [above](#Reporting_Issues)). This will help us identify whether we have already addressed the feature or issue in an upcoming release and assess how the feature or fix fits into our release plan.

### <a name="Architecture_Philosophy" href="Architecture_Philosophy">#</a> Architecture Philosophy

VCC is a well organized **_Monorepo_** for simplicity!
The components are standard web components developed using Stencil can be reused directly in any web environment and/or framework. The development practices follows guardrails (_e.g. linting, testing etc._) to help maintain consistency and quality.

### <a name="Branching_Structure" href="Branching_Structure">#</a> Branching Structure

All stable releases are tagged on `master`. At any given time, `development` represents the latest development version of the library. Patches or hotfix releases are prepared on an independent branch. We will do our best to keep development branch in good shape, with tests passing at all times.

### <a name="Setup" href="Setup">#</a> Setup

1. Create an issue, if applicable, and then clone locally
1. Create a branch off `development`.
1. `yarn` or `npm install`
1. `yarn bootstrap` or `npm run bootstrap`
1. `yarn start` or `npm run start`

### <a name="Commit_Messages_and_Pull_Requests" href="Commit_Messages_and_Pull_Requests">#</a> Commit Messages and Pull Requests

This library needs to follow the [Conventional Commit specification](https://conventionalcommits.org/) with an addition of **Ticket/Issue Numbers**. Add your issue number to each commit message. Remember that your commit messages are going to be used in creating the `CHANGELOG.md` file, so let that thought guide you to create quality commit messages.
