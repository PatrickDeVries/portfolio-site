# Development Guide

This is a Vite React app (formerly a Create React App, formerly a Next.js App)

## Getting started

### Bun / package management

This project uses Bun for package management, with a version of [v1.0.19](.tool-versions)

## Scripts

The following scripts are available for this project:

### `bun dev`

- Start the app in development mode with Vite

### `bun run build`

- Build the app with Vite to the `/dist` directory

### `bun preview`

- Preview the build Vite app and serve it locally from `/dist`

### `bun deploy`

- Deploy the application to GitHub pages
- This implicitly runs the `predeploy` script first, which lints and builds the app

### `bun format`

- Format the application with prettier

### `bun lint`/`bun lint:code`/`bun lint:styles`/`bun lint:format`/`bun lint:types`

- Lint the application
- `bun lint` will run all lint scripts concurrently
- `bun lint:code` lints with ESLint
- `bun lint:styles` lints with Stylelint
- `bun lint:format` checks the formatting with prettier
- `bun lint:types` runs a type check
