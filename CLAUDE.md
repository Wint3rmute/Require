# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Require is a system modeling and requirements tracing application built with Next.js 15, React 19, Material-UI, and ReactFlow. The app enables users to define and decompose systems into subsystems, interfaces, and connections, while tracing requirements and generating interactive system diagrams.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build**: `npm run build`
- **Production start**: `npm start`
- **Lint**: `npm run lint`

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI Library**: Material-UI v7 with Emotion styling
- **Diagram Engine**: ReactFlow (@xyflow/react) for interactive system diagrams
- **Styling**: CSS Modules + Material-UI components
- **TypeScript**: Strict mode enabled

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with navbar and global fonts
  - `page.tsx` - Home page with ReactFlow demo
  - `subsystems/page.tsx` - Subsystems management page
- `src/components/` - Reusable React components
  - `navbar.tsx` - Material-UI app bar with "Require" branding
  - `subsystems_list.tsx` - Material-UI list component (currently placeholder)

### Key Dependencies
- `@xyflow/react` - Interactive node-based diagrams
- `@mui/material` - Material Design React components
- `@mui/icons-material` - Material Design icons
- `@emotion/react` & `@emotion/styled` - CSS-in-JS styling

### TypeScript Configuration
- Path mapping: `@/*` maps to `./src/*`
- Strict mode enabled
- Target ES2017 with modern module resolution

## Development Notes

### ReactFlow Integration
The main page demonstrates ReactFlow usage with:
- Initial nodes and edges setup
- State management for dynamic updates
- Node/edge change handlers
- Connection handling

### Material-UI Theme
The app uses Material-UI's default theme with custom typography (Geist fonts). Components follow Material Design patterns.

### Component Architecture
- Components use TypeScript with proper typing
- Material-UI components are imported individually for tree-shaking
- CSS Modules used for custom styling alongside Material-UI