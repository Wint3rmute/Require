/**
 * LocalStorage persistence layer for Require data models
 * 
 * This file provides:
 * - Storage keys and default data
 * - CRUD operations for all entities
 * - Data migration and validation
 * - Integration with existing useLocalStorage hook
 */

import { useLocalStorage } from './use_local_storage';
import { 
  Project, 
  Component, 
  Connection, 
  Interface,
  CompatibilityRule,
  DEFAULT_COMPATIBILITY_RULES,
  generateId,
  checkInterfaceCompatibility
} from './data-models';

// ========================================
// Storage Keys
// ========================================

export const STORAGE_KEYS = {
  PROJECTS: 'require_projects',
  INTERFACES: 'require_interfaces', // Reuse existing key
  COMPATIBILITY_RULES: 'require_compatibility_rules',
  CURRENT_PROJECT_ID: 'require_current_project_id',
} as const;

// ========================================
// Default Data
// ========================================

const DEFAULT_INTERFACES: Interface[] = [
  { id: 'uart', name: 'UART', description: 'Universal Asynchronous Receiver-Transmitter', icon: 'uart' },
  { id: 'can', name: 'CAN Bus', description: 'Controller Area Network protocol', icon: 'can' },
  { id: 'usbc', name: 'USB-C', description: 'Universal Serial Bus Type-C', icon: 'usbc' },
  { id: 'i2c', name: 'I2C', description: 'Inter-Integrated Circuit protocol', icon: 'i2c' },
  { id: 'spi', name: 'SPI', description: 'Serial Peripheral Interface', icon: 'spi' },
  { id: 'ethernet', name: 'Ethernet', description: 'Wired network interface', icon: 'ethernet' },
];

const DEFAULT_PROJECTS: Project[] = [];

// ========================================
// Custom Hooks for Data Management
// ========================================

/**
 * Hook for managing global interfaces (reuses existing system)
 */
export function useInterfaces() {
  return useLocalStorage<Interface[]>(STORAGE_KEYS.INTERFACES, DEFAULT_INTERFACES);
}

/**
 * Hook for managing all projects
 */
export function useProjects() {
  return useLocalStorage<Project[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
}

/**
 * Hook for managing compatibility rules
 */
export function useCompatibilityRules() {
  return useLocalStorage<CompatibilityRule[]>(STORAGE_KEYS.COMPATIBILITY_RULES, DEFAULT_COMPATIBILITY_RULES);
}

/**
 * Hook for managing current project ID
 */
export function useCurrentProjectId() {
  return useLocalStorage<string | null>(STORAGE_KEYS.CURRENT_PROJECT_ID, null);
}

/**
 * Hook for managing a specific project
 */
export function useProject(projectId: string | null) {
  const [projects, setProjects] = useProjects();
  
  const project = projectId ? projects.find(p => p.id === projectId) : null;
  
  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };
  
  return { project, updateProject };
}

// ========================================
// Project Management Functions
// ========================================

/**
 * Create a new project with a default root system component
 */
export function createNewProject(name: string, description?: string): Project {
  const projectId = generateId();
  const rootSystemId = generateId();
  
  const rootSystem: Component = {
    id: rootSystemId,
    name: `${name} System`,
    description: `Root system for ${name}`,
    type: 'system',
    position: { x: 100, y: 100 },
    interfaces: []
  };
  
  const project: Project = {
    id: projectId,
    name,
    components: [rootSystem],
    connections: []
  };
  
  if (description) {
    project.description = description;
  }
  
  return project;
}

/**
 * Add a component to a project
 */
export function addComponentToProject(
  project: Project, 
  component: Omit<Component, 'id'>
): Project {
  const newComponent: Component = {
    ...component,
    id: generateId()
  };
  
  return {
    ...project,
    components: [...project.components, newComponent]
  };
}

/**
 * Update a component in a project
 */
export function updateComponentInProject(
  project: Project,
  componentId: string,
  updates: Partial<Component>
): Project {
  return {
    ...project,
    components: project.components.map(c => 
      c.id === componentId ? { ...c, ...updates } : c
    )
  };
}

/**
 * Remove a component and its connections from a project
 */
export function removeComponentFromProject(
  project: Project,
  componentId: string
): Project {
  return {
    ...project,
    components: project.components.filter(c => c.id !== componentId),
    connections: project.connections.filter(conn => 
      conn.sourceComponentId !== componentId && 
      conn.targetComponentId !== componentId
    )
  };
}

/**
 * Add an interface to a component
 */
export function addInterfaceToComponent(
  project: Project,
  componentId: string,
  interfaceData: Omit<import('./data-models').ComponentInterface, 'id' | 'componentId' | 'isConnected'>
): Project {
  return updateComponentInProject(project, componentId, {
    interfaces: [
      ...project.components.find(c => c.id === componentId)?.interfaces || [],
      {
        id: generateId(),
        componentId,
        isConnected: false,
        ...interfaceData
      }
    ]
  });
}

/**
 * Create a connection between two component interfaces
 */
export function createConnection(
  project: Project,
  sourceComponentId: string,
  sourceInterfaceId: string,
  targetComponentId: string,
  targetInterfaceId: string,
  compatibilityRules: CompatibilityRule[] = DEFAULT_COMPATIBILITY_RULES
): Project {
  const sourceInterface = project.components
    .find(c => c.id === sourceComponentId)
    ?.interfaces.find(i => i.id === sourceInterfaceId);
  
  const targetInterface = project.components
    .find(c => c.id === targetComponentId)
    ?.interfaces.find(i => i.id === targetInterfaceId);
  
  if (!sourceInterface || !targetInterface) {
    throw new Error('Invalid interface IDs');
  }
  
  const connectionId = generateId();
  const compatibilityStatus = checkInterfaceCompatibility(
    sourceInterface.interfaceDefinitionId,
    targetInterface.interfaceDefinitionId,
    compatibilityRules
  );
  
  const newConnection: Connection = {
    id: connectionId,
    sourceComponentId,
    sourceInterfaceId,
    targetComponentId,
    targetInterfaceId,
    isFullyDefined: compatibilityStatus === 'compatible',
    compatibilityStatus
  };
  
  // Update interface connection status
  const updatedProject = {
    ...project,
    connections: [...project.connections, newConnection],
    components: project.components.map(component => ({
      ...component,
      interfaces: component.interfaces.map(iface => {
        if (iface.id === sourceInterfaceId || iface.id === targetInterfaceId) {
          return {
            ...iface,
            isConnected: true,
            connectionId: connectionId
          };
        }
        return iface;
      })
    }))
  };
  
  return updatedProject;
}

/**
 * Remove a connection and update interface statuses
 */
export function removeConnection(project: Project, connectionId: string): Project {
  const connection = project.connections.find(c => c.id === connectionId);
  if (!connection) return project;
  
  return {
    ...project,
    connections: project.connections.filter(c => c.id !== connectionId),
    components: project.components.map(component => ({
      ...component,
      interfaces: component.interfaces.map(iface => {
        if (iface.connectionId === connectionId) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { connectionId: _removedConnectionId, ...ifaceWithoutConnection } = iface;
          return {
            ...ifaceWithoutConnection,
            isConnected: false
          };
        }
        return iface;
      })
    }))
  };
}

// ========================================
// System Analysis Functions
// ========================================

/**
 * Calculate how "fully defined" a project is
 */
export function calculateProjectCompleteness(project: Project): number {
  if (project.components.length === 0) return 0;
  
  const totalConnections = project.connections.length;
  if (totalConnections === 0) return 0;
  
  const fullyDefinedConnections = project.connections.filter(c => c.isFullyDefined).length;
  return Math.round((fullyDefinedConnections / totalConnections) * 100);
}

/**
 * Find orphaned components (not connected to anything)
 */
export function findOrphanedComponents(project: Project): Component[] {
  const connectedComponentIds = new Set([
    ...project.connections.map(c => c.sourceComponentId),
    ...project.connections.map(c => c.targetComponentId)
  ]);
  
  return project.components.filter(c => !connectedComponentIds.has(c.id));
}

/**
 * Get compatibility issues in a project
 */
export function getCompatibilityIssues(project: Project): Array<{
  connectionId: string;
  message: string;
  severity: 'error' | 'warning';
}> {
  return project.connections
    .filter(c => c.compatibilityStatus === 'incompatible' || c.compatibilityStatus === 'unknown')
    .map(c => ({
      connectionId: c.id,
      message: c.compatibilityStatus === 'incompatible' 
        ? 'Incompatible interface types' 
        : 'Unknown compatibility - needs verification',
      severity: c.compatibilityStatus === 'incompatible' ? 'error' as const : 'warning' as const
    }));
}

// ========================================
// Data Migration & Validation
// ========================================

/**
 * Validate and migrate project data if needed
 */
export function validateAndMigrateProject(projectData: unknown): Project | null {
  try {
    // Basic validation
    if (!projectData || typeof projectData !== 'object' || projectData === null) {
      console.warn('Invalid project data structure');
      return null;
    }
    
    const data = projectData as Record<string, unknown>;
    
    if (!data.id || !data.name || !Array.isArray(data.components)) {
      console.warn('Invalid project data structure');
      return null;
    }
    
    // Ensure all components have required fields
    const validatedComponents = (data.components as unknown[]).map((comp: unknown) => {
      const component = comp as Record<string, unknown>;
      return {
        id: component.id || generateId(),
        name: component.name || 'Unnamed Component',
        type: component.type || 'component',
        position: component.position || { x: 0, y: 0 },
        interfaces: component.interfaces || [],
        ...component
      } as Component;
    });
    
    const project: Project = {
      id: data.id as string,
      name: data.name as string,
      components: validatedComponents,
      connections: (data.connections as Connection[]) || []
    };
    
    if (data.description && typeof data.description === 'string') {
      project.description = data.description;
    }
    
    return project;
  } catch (error) {
    console.error('Failed to validate project data:', error);
    return null;
  }
}

// ========================================
// Export for easy importing
// ========================================

export const RequireStorage = {
  // Hooks
  useInterfaces,
  useProjects,
  useCompatibilityRules,
  useCurrentProjectId,
  useProject,
  
  // Project operations
  createNewProject,
  addComponentToProject,
  updateComponentInProject,
  removeComponentFromProject,
  addInterfaceToComponent,
  createConnection,
  removeConnection,
  
  // Analysis
  calculateProjectCompleteness,
  findOrphanedComponents,
  getCompatibilityIssues,
  
  // Utility
  validateAndMigrateProject,
  STORAGE_KEYS
};

// Re-export from data-models for convenience
export { generateId, DEFAULT_COMPONENT_SIZE } from './data-models';
