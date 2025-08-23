# Require - System Modeling & Requirements Tracing Application

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Initial Setup & Dependencies

- Install dependencies: `npm ci` -- takes 30 seconds. NEVER CANCEL.
- Set up environment: `cp .env.cicd .env`
- **IMPORTANT**: Prisma database features are currently disabled due to network restrictions. The `src/lib/db.ts` file is commented out for builds to succeed.

### Build & Development Commands

- **Lint**: `npm run lint -- --fix` -- takes 3 seconds. Always run before committing.
- **Build**: `npm run build` -- takes 6-10 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- **Test**: `npm run test` -- takes 1-2 seconds. All tests should pass.

### Build System Details

- Uses **Next.js 15 with Turbopack** (experimental but required)
- Builds are fast (~6-10 seconds) and include warnings about experimental Turbopack support
- Google Fonts are disabled due to network restrictions in build environment
- TypeScript strict mode with enhanced compiler checks
- CI/CD pipeline runs lint + build on PRs (see `.github/workflows/ci.yml`)
- **Build warnings are expected**: Turbopack experimental warnings are normal and safe to ignore

## Validation Scenarios

Always manually validate changes by running through these complete user scenarios:

### Interface Management Workflow

1. Navigate to `/interfaces` page
2. Add a new interface using the form (name + description)
3. Verify interface appears in the list with default icon
4. Test interface deletion with confirmation dialog
5. Verify changes persist with localStorage

### Project & System Modeling Workflow

1. Navigate to `/system-model` page
2. Create a new project using "Create First Project" button
3. Fill project name and description, verify project appears in list
4. Verify project shows as "Active" with component/connection counts
5. Test project manager UI shows proper statistics

### Component Tree Management Workflow

1. Navigate to `/tree-editor` page (requires active project)
2. Verify root system component displays correctly
3. Add new component using "Add Component" button
4. Fill component details (name, type, description, parent)
5. Verify component appears in hierarchical tree structure
6. Test component editing and deletion actions

### Navigation & UI Workflow

1. Test navbar navigation between all pages
2. Verify Material-UI components render correctly
3. Test responsive dialogs and forms
4. Verify React Flow diagrams display on home page

## Technology Stack & Architecture

### Core Technologies

- **Framework**: Next.js 15 (App Router, Turbopack)
- **UI Library**: Material-UI v7 with Emotion styling
- **Diagrams**: ReactFlow (`@xyflow/react`) for interactive system diagrams
- **State Management**: localStorage with custom hooks in `src/lib/storage.ts`
- **TypeScript**: Strict mode with path alias `@/*` → `src/*`

### Key File Locations

- **Pages**: `src/app/` - Next.js app router pages
  - `src/app/page.tsx` - Home page with React Flow demo
  - `src/app/interfaces/page.tsx` - Interface management
  - `src/app/system-model/page.tsx` - Project management
  - `src/app/tree-editor/page.tsx` - Component hierarchy editor
- **Components**: `src/components/` - Reusable UI components
  - `src/components/navbar.tsx` - Main navigation
  - `src/components/project_manager.tsx` - Project CRUD operations
  - `src/components/system_editor.tsx` - System modeling interface
  - `src/components/tree_node.tsx` - Hierarchical component display
- **Business Logic**: `src/lib/` - Core functionality
  - `src/lib/storage.ts` - Data persistence and state management
  - `src/lib/models.ts` - TypeScript data models
  - `src/lib/use_local_storage.ts` - LocalStorage hook

### Data Models

- **Project**: Top-level container with components and connections
- **Component**: System elements with interfaces and hierarchy (parentId)
  - **Simplified Types**: 'system' (root only) | 'component' (everything else)
- **Interface**: Reusable interface definitions (UART, CAN, USB-C, etc.)
- **Connection**: Links between component interfaces

## Common Development Tasks

### Available npm Scripts

- `npm ci` - Install dependencies (30-40 seconds)
- `npm run build` - Production build with Turbopack (6-10 seconds)
- `npm run lint -- --fix` - Run ESLint (3 seconds)
- `npm run test` - Run Jest test suite (1-2 seconds, 36 tests)
- `npm run dev` - Start development server with Turbopack

### Code Style & Standards

- **Always run linting**: `npm run lint -- --fix` before committing changes
- **No `any` types**: ESLint enforces strict TypeScript
- **Import validation**: All imports must be used (ESLint will catch unused imports)
- **File naming**: Use lowercase with underscores for components

### When Making Changes

1. Always build first to check baseline: `npm run build`
2. Make incremental changes and test in browser
3. Run linting after each change: `npm run lint -- --fix`
4. Run tests if modifying core logic: `npm run test`
5. Manually test affected user workflows (see Validation Scenarios above)
6. Run final build to ensure no regressions: `npm run build`
7. If you get a working build, make a commit and push it.

### Troubleshooting Common Issues

- **Build fails with Google Fonts error**: This is expected due to network restrictions. Google Fonts are disabled in `src/app/layout.tsx`.
- **Prisma errors**: Database features are disabled. The `src/lib/db.ts` file is commented out.
- **ESLint unused variable errors**: Remove unused imports and variables or use underscore prefix for intentionally unused parameters.
- **TypeScript strict errors**: Fix all type issues - no `any` types allowed.

## Application Architecture Notes

### State Management

- Uses **localStorage** for persistence (100% client-side)
- Custom hooks in `src/lib/storage.ts` provide CRUD operations
- No server-side database in current milestone
- Data validation and migration handled in storage layer

### Component Hierarchy

- Projects contain Components
- Components can have parent-child relationships (unlimited nesting)
- Components have Interfaces for connections
- Connections link Component Interfaces together

### Current Development Status

- **Milestone 1**: Proof of concept with local storage only
- No component reusability yet
- Interface compatibility checking implemented
- System completeness metrics available
- **Testing**: Jest test suite covering core functionality

Always validate your changes work by running through the complete user scenarios above. The application should remain fully functional after any modifications.

## Validation Status

**Last Validated**: All commands and user scenarios verified working as of latest update.
- ✅ All setup commands work correctly
- ✅ Build completes successfully with expected warnings  
- ✅ All user workflows functional
- ✅ Test suite passes (36 tests)
- ✅ Development server starts and application accessible
