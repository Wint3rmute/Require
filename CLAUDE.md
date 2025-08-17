# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Require is a system modeling and requirements tracing application built with Next.js 15, React 19, Material-UI, and ReactFlow. The app enables users to define and decompose systems into subsystems, interfaces, and connections, while tracing requirements and generating interactive system diagrams.

## Development Commands

- **Development server**: `npm run dev` (standard webpack, no Turbopack due to typed routes)
- **Build**: `npm run build`
- **Production start**: `npm start`
- **Lint**: `npm run lint`

**IMPORTANT**: Always run `npm run lint` and `npm run build` to verify changes before considering work complete.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and typed routes enabled
- **UI Library**: Material-UI v7 with Emotion styling
- **Diagram Engine**: ReactFlow (@xyflow/react) for interactive system diagrams
- **Styling**: CSS Modules + Material-UI components
- **TypeScript**: Strict mode enabled with enhanced compiler checks

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with navbar and global fonts (Geist Sans/Mono)
  - `page.tsx` - Home page with ReactFlow interactive demo
  - `subsystems/page.tsx` - Subsystems management page with list view
  - `interfaces/page.tsx` - Interfaces management page with list view
- `src/components/` - Reusable React components
  - `navbar.tsx` - Material-UI app bar with navigation links (Home, Subsystems, Interfaces, Login)
  - `subsystems_list.tsx` - Displays system components (Engine, Processing, Tires, etc.) with icons
  - `interfaces_list.tsx` - Displays communication interfaces (UART, CAN, USB-C, etc.) with icons

### Key Dependencies
- `@xyflow/react` - Interactive node-based diagrams with proper TypeScript types
- `@mui/material` - Material Design React components
- `@mui/icons-material` - Material Design icons (Build, Computer, USB, etc.)
- `@emotion/react` & `@emotion/styled` - CSS-in-JS styling
- `next` - Full-stack React framework with typed routes

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