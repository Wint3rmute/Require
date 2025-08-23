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
  position?: { x: number; y: number }; // Optional for backwards compatibility, now stored in SystemViews
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
  systemViews: SystemView[]; // Multiple views of the system
  currentSystemViewId?: string; // Currently active view
  // Use existing global interfaces from localStorage
}

// ========================================
// System Views - New concept for positioning
// ========================================

export interface SystemView {
  id: string;
  name: string;
  description?: string;
  projectId: string; // Reference to parent project
  componentPositions: Record<string, { x: number; y: number }>; // componentId -> position
  visibleComponents: string[]; // Array of component IDs to show in this view
  visibleInterfaces: string[]; // Array of interface IDs to show in this view
  createdAt: Date;
  updatedAt: Date;
}

export interface ComponentViewSettings {
  componentId: string;
  position: { x: number; y: number };
  visible: boolean;
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
  const now = new Date();
  
  // Generate default positions in a grid layout
  const componentPositions: Record<string, { x: number; y: number }> = {};
  components.forEach((component, index) => {
    // Use existing position if available (for migration), otherwise generate grid position
    if (component.position) {
      componentPositions[component.id] = component.position;
    } else {
      const cols = Math.ceil(Math.sqrt(components.length));
      const row = Math.floor(index / cols);
      const col = index % cols;
      componentPositions[component.id] = {
        x: col * 250 + 100,
        y: row * 150 + 100
      };
    }
  });

  return {
    id: generateId(),
    name: 'All Components',
    description: 'Default view showing all components in the system',
    projectId,
    componentPositions,
    visibleComponents: components.map(c => c.id),
    visibleInterfaces: components.flatMap(c => c.interfaces.map(i => i.id)),
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Create a new empty system view
 */
export function createEmptySystemView(projectId: string, name: string, description?: string): SystemView {
  const now = new Date();
  
  const systemView: SystemView = {
    id: generateId(),
    name,
    projectId,
    componentPositions: {},
    visibleComponents: [],
    visibleInterfaces: [],
    createdAt: now,
    updatedAt: now
  };
  
  if (description) {
    systemView.description = description;
  }
  
  return systemView;
}

/**
 * Get component position from system view with fallback
 */
export function getComponentPosition(component: Component, systemView: SystemView): { x: number; y: number } {
  // First try to get position from system view
  const viewPosition = systemView.componentPositions[component.id];
  if (viewPosition) {
    return viewPosition;
  }
  
  // Fallback to component's stored position (for migration)
  if (component.position) {
    return component.position;
  }
  
  // Last resort: default position
  return { x: 100, y: 100 };
}

/**
 * Check if component is visible in system view
 */
export function isComponentVisible(componentId: string, systemView: SystemView): boolean {
  return systemView.visibleComponents.includes(componentId);
}
