# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Require is a system modeling and requirements tracing application built with Next.js 15, React 19, Material-UI, and ReactFlow. The app enables users to define and decompose systems into subsystems, interfaces, and connections, while tracing requirements and generating interactive system diagrams.

## Development Commands

- **Build**: `npm run build --turbopack`
- **Production start**: `npm start`
- **Lint**: `npm run lint -- --fix`

**IMPORTANT**: Always run `npm run lint` and `npm run build` to verify changes before considering work complete.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and typed routes enabled
- **UI Library**: Material-UI v7 with Emotion styling
- **Diagram Engine**: ReactFlow (@xyflow/react) for interactive system diagrams
- **Styling**: CSS Modules + Material-UI components
- **TypeScript**: Strict mode enabled with enhanced compiler checks
- **Testing**: Jest + React Testing Library + jsdom environment
- **E2E Testing**: Playwright for end-to-end browser testing

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with navbar and global fonts (Geist Sans/Mono)
  - `page.tsx` - Home page with ReactFlow interactive demo
  - `subsystems/page.tsx` - Subsystems management page with list view
  - `interfaces/page.tsx` - Interfaces management page with list view
  - `__tests__/` - Page-level tests
- `src/components/` - Reusable React components
  - `navbar.tsx` - Material-UI app bar with navigation links (Home, Subsystems, Interfaces, Login)
  - `subsystems_list.tsx` - Displays system components (Engine, Processing, Tires, etc.) with icons
  - `interfaces_list.tsx` - Displays communication interfaces (UART, CAN, USB-C, etc.) with icons
  - `__tests__/` - Component tests with 100% coverage

### Key Dependencies
- `@xyflow/react` - Interactive node-based diagrams with proper TypeScript types
- `@mui/material` - Material Design React components
- `@mui/icons-material` - Material Design icons (Build, Computer, USB, etc.)
- `@emotion/react` & `@emotion/styled` - CSS-in-JS styling
- `next` - Full-stack React framework with typed routes

### Development Dependencies
- `jest` - JavaScript testing framework
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers for DOM testing
- `jest-environment-jsdom` - DOM environment for Jest
- `ts-jest` - TypeScript transformer for Jest
- `identity-obj-proxy` - CSS modules mocking for tests
- `@playwright/test` - End-to-end testing framework

### TypeScript Configuration
- **Path mapping**: `@/*` maps to `./src/*`
- **Strict mode**: Enhanced with additional compiler checks:
  - `noUncheckedIndexedAccess` - Prevents undefined array/object access
  - `noImplicitReturns` - Ensures all code paths return values
  - `noUnusedLocals/Parameters` - Flags unused variables/parameters
  - `exactOptionalPropertyTypes` - Stricter optional property handling
  - `noFallthroughCasesInSwitch` - Prevents accidental switch fallthrough
- **Target**: ES2017 with modern module resolution

### Next.js Configuration
- **Typed Routes**: Enabled in experimental features for compile-time route validation
- **Turbopack**: Disabled (incompatible with typed routes)

## Development Notes

### ReactFlow Integration
- Uses proper TypeScript types (`Node[]`, `Edge[]`, `NodeChange[]`, `EdgeChange[]`, `Connection`)
- State management for dynamic node/edge updates
- Callback handlers for interactive diagram manipulation
- Initial demo shows connected nodes with drag/drop functionality

### Material-UI Implementation
- Uses Material-UI v7 components with TypeScript
- Individual component imports for optimal tree-shaking
- Consistent icon usage from `@mui/icons-material`
- List components use `ListItem`, `ListItemButton`, `ListItemIcon`, `ListItemText` pattern
- Navigation uses Next.js `Link` component with Material-UI `Button`

### Component Patterns
- All components use TypeScript interfaces for props
- Material-UI `sx` prop for styling with theme integration
- Responsive design with `maxWidth` constraints
- Consistent spacing using Material-UI spacing system (`mb`, `mr`, etc.)

### Data Models
Current mock data includes:
- **Subsystems**: Engine, Processing Unit, Tires, Power System, Cooling, Memory, Security, Storage, Communication, Control
- **Interfaces**: UART, CAN Bus, USB-C, I2C, SPI, Ethernet, Bluetooth, Wi-Fi, SD Card, HDMI, Audio, Parallel Port

Each item has `id`, `name`, `description`, and `icon` properties with appropriate Material-UI icons.

### Code Quality Standards
- ESLint configuration extends Next.js recommended rules
- No explicit `any` types allowed (enforced by ESLint)
- Strict TypeScript checking catches potential runtime errors
- All imports must be used (enforced by compiler)
- Consistent file naming and casing enforced

## Testing Strategy

### Jest (Unit/Component Testing)
- **Environment**: jsdom with ts-jest transformer
- **Coverage**: 100% required for components and pages
- **Location**: `__tests__/` directories alongside source code
- **Focus**: User-facing behavior, accessibility, interactions
- **Current Coverage**: SubsystemsList, InterfacesList, ButtonAppBar, all pages

### Playwright (End-to-End Testing)
- **Config**: `playwright.config.ts` - Chromium only, list reporter, auto-starts dev server
- **Tests**: `./tests/` directory - page loads, navigation flows, critical user paths
- **Coverage**: Home page verification, complete navigation between all main pages
- **Notes**: Uses "Require" brand link for home navigation, semantic selectors preferred