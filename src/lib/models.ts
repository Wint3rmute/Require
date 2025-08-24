/**
 * Simplified data models for Require prototype (Milestone 1)
 * 
 * Focus on core functionality:
 * - Basic components with hierarchical structure
 * - Reusable interface definitions
 * - Simple connections between components
 * - Basic compatibility checking
 */

// ========================================
// Core Models for Prototype
// ========================================

export interface Component {
  id: string;
  name: string;
  description?: string;
  type: 'system' | 'component'; // 'system' = root only, 'component' = everything else
  parentId?: string; // For hierarchical nesting
  interfaces: ComponentInterface[]; // Interfaces this component has
}

export interface ComponentInterface {
  id: string;
  componentId: string;
  interfaceDefinitionId: string; // References the global Interface
  name: string; // Instance name (e.g., "USB Port 1")
  position: 'left' | 'right' | 'top' | 'bottom';
  isConnected: boolean;
  connectionId?: string;
}

export interface Connection {
  id: string;
  sourceComponentId: string;
  sourceInterfaceId: string;
  targetComponentId: string;
  targetInterfaceId: string;
  isFullyDefined: boolean; // Core "fully defined" concept
  compatibilityStatus: 'compatible' | 'incompatible' | 'unknown';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  components: Component[];
  connections: Connection[];
  systemViews: SystemView[];
  activeSystemViewId?: string;
  // Use existing global interfaces from localStorage
}

// ========================================
// System Views for Multiple Perspectives
// ========================================

export interface SystemView {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  componentPositions: Record<string, { x: number; y: number }>; // componentId -> position
  visibleComponentIds: string[]; // Which components to show
  visibleInterfaceIds: string[]; // Which interfaces to show (optional - can show all if empty)
  isDefault: boolean; // One default view per project
}

// ========================================
// Interface System (Reuse existing)
// ========================================

export interface Interface {
  id: string;
  name: string;
  description: string;
  icon: string;
  category?: string; // Optional for prototype
  compatibleWith?: string[]; // Simple compatibility list
}

// ========================================
// Utility Types
// ========================================

export type ComponentType = 'system' | 'component'; // Simplified: system=root, component=everything else
export type InterfacePosition = 'left' | 'right' | 'top' | 'bottom';
export type CompatibilityStatus = 'compatible' | 'incompatible' | 'unknown';

// ========================================
// Default Values & Helpers
// ========================================

export const DEFAULT_COMPONENT_SIZE = { width: 200, height: 100 };
export const DEFAULT_INTERFACE_SPACING = 30;

// Simple compatibility checker - just check if interface names match
export function checkInterfaceCompatibility(
  sourceInterfaceName: string, 
  targetInterfaceName: string
): CompatibilityStatus {
  if (sourceInterfaceName === targetInterfaceName) {
    return 'compatible';
  }
  return 'incompatible';
}

// Helper to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ========================================
// SystemView Helper Functions
// ========================================

/**
 * Create a default "All Components" system view for a project
 */
export function createDefaultSystemView(projectId: string, components: Component[]): SystemView {
  const componentPositions: Record<string, { x: number; y: number }> = {};
  
  // Auto-layout components in a grid pattern
  components.forEach((component, index) => {
    const cols = Math.ceil(Math.sqrt(components.length));
    const row = Math.floor(index / cols);
    const col = index % cols;
    componentPositions[component.id] = {
      x: 100 + col * 250,
      y: 100 + row * 150
    };
  });

  return {
    id: generateId(),
    name: 'All Components',
    description: 'Complete system overview showing all components',
    projectId,
    componentPositions,
    visibleComponentIds: components.map(c => c.id),
    visibleInterfaceIds: [], // Empty means show all interfaces
    isDefault: true
  };
}

/**
 * Get component position from a system view, with fallback to default
 */
export function getComponentPosition(systemView: SystemView, componentId: string): { x: number; y: number } {
  return systemView.componentPositions[componentId] || { x: 100, y: 100 };
}

/**
 * Update component position in a system view
 */
export function updateComponentPositionInView(
  systemView: SystemView,
  componentId: string,
  position: { x: number; y: number }
): SystemView {
  return {
    ...systemView,
    componentPositions: {
      ...systemView.componentPositions,
      [componentId]: position
    }
  };
}
