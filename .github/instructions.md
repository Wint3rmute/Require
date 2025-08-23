# Development & Architecture Guide

This repository is a system modeling and requirements tracing app built with Next.js 15, React 19, Material-UI v7, and ReactFlow. It enables users to define systems, subsystems, interfaces, and trace requirements with interactive diagrams.

## Quick Commands

- **Build**: `npm run build`
- **Lint**: `npm run lint -- --fix`

> Always lint and build before submitting changes.

## Tech Stack

- **Framework**: Next.js 15 (App Router, typed routes)
- **UI**: Material-UI v7, Emotion
- **Diagrams**: ReactFlow (`@xyflow/react`)
- **TypeScript**: Strict mode, enhanced compiler checks

## Structure

- `src/app/`: Pages, layouts
- `src/components/`: Reusable components (e.g., navbar, subsystems list)

## Standards

- **Linting**: ESLint (Next.js rules, no `any` types)
- **TypeScript**: Strict, path alias `@/*` → `src/*`
- **Testing**: 100% coverage required for components/pages
- **Styling**: Material-UI, Emotion, CSS Modules

## Notes

- Work in **small steps**, don't do massive rewrites
- Verify with linter after each small step
- All imports must be used
- Consistent file naming/casing
