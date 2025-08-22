# GEMINI.md

This file provides guidance for working with the "Require" repository.

## Project Overview

"Require" is a system modeling and requirements tracing application. It's built with Next.js 15, React 19, and Material-UI. The core functionality allows users to model systems with subsystems and interfaces, trace requirements, and generate interactive diagrams using ReactFlow.

## Development Commands

- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

**Important**: Always run `npm run lint` to verify changes before completing a task.

## Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router, typed routes)
- **UI**: Material-UI v7
- **Diagrams**: ReactFlow (`@xyflow/react`)
- **Styling**: Material UI
- **Testing**: Jest, React Testing Library, Playwright (for E2E)
- **TypeScript**: Strict mode is enabled.

### Project Structure

- `src/app/`: Next.js pages and layouts.
- `src/components/`: Reusable React components (e.g., `navbar.tsx`, `subsystems_list.tsx`).
- `__tests__/`: Jest tests are co-located with the source code.
- `tests/`: Playwright E2E tests.

### Key Dependencies

- `next`: Framework
- `@mui/material`: UI components
- `@xyflow/react`: Diagramming engine
- `@testing-library/react`: Component testing
- `@playwright/test`: E2E testing

## Code Quality & Testing

- **Linting**: ESLint with Next.js recommended rules. No `any` types.
- **Unit/Component Tests**: Jest and React Testing Library. Tests are located in `__tests__` directories.
- **E2E Tests**: Playwright. Tests are in the `tests/` directory.
- **TypeScript**: Strict mode is enforced with several additional compiler checks for robustness. Path alias `@/*` maps to `src/*`.
