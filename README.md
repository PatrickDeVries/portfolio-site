# Development Guide

This is a Vite React app (formerly a Create React App, formerly a Next.js App)

## Getting started

### Bun / package management

This project uses Bun for package management, with a version of [v1.0.20](.tool-versions)

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

### `bun format/bun format:changed`

- Format the application with Biome
- `bun format` will format all files
- `bun format:changed` will format files that git detects as changed relative to `main`

### `bun fix/bun fix:changed`

- Auto-formatting and lint errors
- `bun fix` will fix errors in all files
- `bun fix:changed` will fix errors in files that git detects as changed relative to `main`

### `bun lint:styles`

- Checks for CSS format errors with Stylelint

### `bun lint:types`

- Checks for type errors with tsc

### `bun lint:code`/`bun lint:changed:code` / `bun lint:format`/`bun lint:changed:format` / `bun lint:check`/`bun lint:changed:check`

- Check code for errors with Biome
- `bun lint:code` will check for lint errors in all files
- `bun lint:changed:code` will check for lint errors in files that git detects as changed relative to `main`
- `bun lint:format` will check for format errors in all files
- `bun lint:changed:format` will check for format errors in files that git detects as changed relative to `main`
- `bun lint:check` will check for both format and lint errors in all files
- `bun lint:changed:check` will check for both format and lint errors in files that git detects as changed relative to `main`

### `bun lint`

- Lint the entire application, running `bun lint:check`, `bun lint:styles`, and `bun lint:types` concurrently
