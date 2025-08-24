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
  SystemView,
  generateId,
  checkInterfaceCompatibility,
  createDefaultSystemView
} from './models';
import { createCarTemplate } from './car_template';

// ========================================
// Storage Keys
// ========================================

export const STORAGE_KEYS = {
  PROJECTS: 'require_projects',
  INTERFACES: 'require_interfaces', // Reuse existing key
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
  
  const project = projectId ? projects.find(p => p.id === projectId) || null : null;
  
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
    interfaces: []
  };
  
  const components = [rootSystem];
  const defaultSystemView = createDefaultSystemView(projectId, components);
  
  const project: Project = {
    id: projectId,
    name,
    components,
    connections: [],
    systemViews: [defaultSystemView],
    activeSystemViewId: defaultSystemView.id
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
 * Add a component to a project and position it in the active system view
 */
export function addComponentToProjectWithPosition(
  project: Project,
  component: Omit<Component, 'id'>,
  position: { x: number; y: number }
): Project {
  const newComponent: Component = {
    ...component,
    id: generateId()
  };

  const updatedProject = {
    ...project,
    components: [...project.components, newComponent]
  };

  // Add component to active system view
  const activeSystemView = getActiveSystemView(updatedProject);
  if (activeSystemView) {
    const updatedSystemView = {
      ...activeSystemView,
      visibleComponentIds: [...activeSystemView.visibleComponentIds, newComponent.id],
      componentPositions: {
        ...activeSystemView.componentPositions,
        [newComponent.id]: position
      }
    };
    
    return updateSystemViewInProject(updatedProject, activeSystemView.id, updatedSystemView);
  }

  return updatedProject;
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
  interfaceData: Omit<import('./models').ComponentInterface, 'id' | 'componentId' | 'isConnected'>
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
  targetInterfaceId: string
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
    targetInterface.interfaceDefinitionId
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
// SystemView Management Functions
// ========================================

/**
 * Add a new system view to a project
 */
export function addSystemViewToProject(
  project: Project,
  systemView: Omit<SystemView, 'id' | 'projectId'>
): Project {
  const newSystemView: SystemView = {
    ...systemView,
    id: generateId(),
    projectId: project.id
  };

  return {
    ...project,
    systemViews: [...project.systemViews, newSystemView]
  };
}

/**
 * Update a system view in a project
 */
export function updateSystemViewInProject(
  project: Project,
  systemViewId: string,
  updates: Partial<SystemView>
): Project {
  return {
    ...project,
    systemViews: project.systemViews.map(sv =>
      sv.id === systemViewId ? { ...sv, ...updates } : sv
    )
  };
}

/**
 * Remove a system view from a project (cannot remove default view)
 */
export function removeSystemViewFromProject(
  project: Project,
  systemViewId: string
): Project {
  const systemViewToRemove = project.systemViews.find(sv => sv.id === systemViewId);
  
  // Cannot remove default view
  if (systemViewToRemove?.isDefault) {
    console.warn('Cannot remove default system view');
    return project;
  }

  const updatedSystemViews = project.systemViews.filter(sv => sv.id !== systemViewId);
  
  // If we're removing the active view, switch to default
  let newActiveViewId = project.activeSystemViewId;
  if (project.activeSystemViewId === systemViewId) {
    const defaultView = updatedSystemViews.find(sv => sv.isDefault);
    newActiveViewId = defaultView?.id || undefined;
  }

  const result: Project = {
    ...project,
    systemViews: updatedSystemViews
  };
  
  if (newActiveViewId !== undefined) {
    result.activeSystemViewId = newActiveViewId;
  }

  return result;
}

/**
 * Get the active system view for a project
 */
export function getActiveSystemView(project: Project): SystemView | null {
  if (project.activeSystemViewId) {
    const activeView = project.systemViews.find(sv => sv.id === project.activeSystemViewId);
    if (activeView) return activeView;
  }
  
  // Fallback to default view
  return project.systemViews.find(sv => sv.isDefault) || null;
}

/**
 * Set the active system view for a project
 */
export function setActiveSystemView(
  project: Project,
  systemViewId: string
): Project {
  const systemView = project.systemViews.find(sv => sv.id === systemViewId);
  if (!systemView) {
    console.warn('System view not found:', systemViewId);
    return project;
  }

  return {
    ...project,
    activeSystemViewId: systemViewId
  };
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
    
    // Ensure all components have required fields and migrate position data
    const validatedComponents = (data.components as unknown[]).map((comp: unknown) => {
      const component = comp as Record<string, unknown>;
      
      // Remove position from component - it will be migrated to SystemView
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { position: _position, ...componentWithoutPosition } = component;
      
      return {
        id: component.id || generateId(),
        name: component.name || 'Unnamed Component',
        type: component.type || 'component',
        interfaces: component.interfaces || [],
        ...componentWithoutPosition
      } as Component;
    });
    
    // Migration: Check if project already has SystemViews
    let systemViews = (data.systemViews as SystemView[]) || [];
    let activeSystemViewId = data.activeSystemViewId as string | undefined;
    
    // If no SystemViews exist, create a default one with migrated positions
    if (systemViews.length === 0) {
      const componentPositions: Record<string, { x: number; y: number }> = {};
      
      // Extract positions from original components data
      (data.components as unknown[]).forEach((comp: unknown) => {
        const component = comp as Record<string, unknown>;
        if (component.id && component.position) {
          componentPositions[component.id as string] = component.position as { x: number; y: number };
        }
      });
      
      const defaultSystemView = createDefaultSystemView(
        data.id as string,
        validatedComponents
      );
      
      // Use migrated positions if available
      if (Object.keys(componentPositions).length > 0) {
        defaultSystemView.componentPositions = componentPositions;
      }
      
      systemViews = [defaultSystemView];
      activeSystemViewId = defaultSystemView.id;
    }
    
    const project: Project = {
      id: data.id as string,
      name: data.name as string,
      components: validatedComponents,
      connections: (data.connections as Connection[]) || [],
      systemViews
    };
    
    if (activeSystemViewId) {
      project.activeSystemViewId = activeSystemViewId;
    }
    
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
  useCurrentProjectId,
  useProject,
  
  // Project operations
  createNewProject,
  createCarTemplate,
  addComponentToProject,
  addComponentToProjectWithPosition,
  updateComponentInProject,
  removeComponentFromProject,
  addInterfaceToComponent,
  createConnection,
  removeConnection,
  
  // SystemView operations
  addSystemViewToProject,
  updateSystemViewInProject,
  removeSystemViewFromProject,
  getActiveSystemView,
  setActiveSystemView,
  
  // Analysis
  calculateProjectCompleteness,
  findOrphanedComponents,
  getCompatibilityIssues,
  
  // Utility
  validateAndMigrateProject,
  STORAGE_KEYS
};

// Re-export from models for convenience
export { generateId, DEFAULT_COMPONENT_SIZE } from './models';

// Re-export from car_template for convenience
export { createCarTemplate } from './car_template';
