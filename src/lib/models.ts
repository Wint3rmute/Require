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
  position: { x: number; y: number }; // Required for ReactFlow
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
  // Use existing global interfaces from localStorage
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
