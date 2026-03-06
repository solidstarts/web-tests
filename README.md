# Web Tests

Playwright end-to-end tests for the Solid Starts web funnel, emulating an iPhone 15 Pro Max.

## Prerequisites

- Node.js
- npm

## Setup

```bash
npm install
```

## Usage

**Record new test code:**

```bash
npx playwright codegen --device="iPhone 15 Pro Max" https://welcome.solidstarts.com/
```

**Run tests (headed with debugger):**

```bash
npx playwright test --headed --debug
```

**Run tests (headless):**

```bash
npx playwright test
```

**Show test report:**

```bash
npx playwright show-report
```
