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
  type: 'system' | 'subsystem' | 'component';
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
// Simple Compatibility
// ========================================

export interface CompatibilityRule {
  sourceInterfaceId: string;
  targetInterfaceId: string;
  isCompatible: boolean;
  message?: string;
}

// ========================================
// Utility Types
// ========================================

export type ComponentType = 'system' | 'subsystem' | 'component';
export type InterfacePosition = 'left' | 'right' | 'top' | 'bottom';
export type CompatibilityStatus = 'compatible' | 'incompatible' | 'unknown';

// ========================================
// Default Values & Helpers
// ========================================

export const DEFAULT_COMPONENT_SIZE = { width: 200, height: 100 };
export const DEFAULT_INTERFACE_SPACING = 30;

// Simple compatibility checker - can be expanded later
export const DEFAULT_COMPATIBILITY_RULES: CompatibilityRule[] = [
  { sourceInterfaceId: 'usbc', targetInterfaceId: 'usbc', isCompatible: true },
  { sourceInterfaceId: 'uart', targetInterfaceId: 'uart', isCompatible: true },
  { sourceInterfaceId: 'can', targetInterfaceId: 'can', isCompatible: true },
  { sourceInterfaceId: 'i2c', targetInterfaceId: 'i2c', isCompatible: true },
  { sourceInterfaceId: 'spi', targetInterfaceId: 'spi', isCompatible: true },
  { sourceInterfaceId: 'ethernet', targetInterfaceId: 'ethernet', isCompatible: true },
];

// Helper function to check compatibility
export function checkInterfaceCompatibility(
  sourceInterfaceId: string, 
  targetInterfaceId: string,
  rules: CompatibilityRule[] = DEFAULT_COMPATIBILITY_RULES
): CompatibilityStatus {
  const rule = rules.find(r => 
    (r.sourceInterfaceId === sourceInterfaceId && r.targetInterfaceId === targetInterfaceId) ||
    (r.sourceInterfaceId === targetInterfaceId && r.targetInterfaceId === sourceInterfaceId)
  );
  
  if (!rule) return 'unknown';
  return rule.isCompatible ? 'compatible' : 'incompatible';
}

// Helper to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
