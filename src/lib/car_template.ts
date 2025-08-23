/**
 * Car Template for Project Creation
 * 
 * This file contains the createCarTemplate function that generates
 * a comprehensive automotive system model with realistic components
 * and interfaces for demonstration and testing purposes.
 */

import { Project, Component, generateId } from './models';

/**
 * Create a car template project with automotive components
 */
export function createCarTemplate(name: string, description?: string): Project {
  const projectId = generateId();
  
  // Create all components with proper hierarchy
  const rootSystem: Component = {
    id: generateId(),
    name: `${name} System`,
    description: description || 'Complete automotive system breakdown',
    type: 'system',
    position: { x: 100, y: 100 },
    interfaces: []
  };

  const engineSubsystem: Component = {
    id: generateId(),
    name: 'Engine Subsystem',
    description: 'Internal combustion engine with fuel injection and ignition systems',
    type: 'component',
    parentId: rootSystem.id,
    position: { x: 150, y: 200 },
    interfaces: [
      {
        id: generateId(),
        componentId: '',
        interfaceDefinitionId: 'can',
        name: 'Engine CAN Bus',
        position: 'right',
        isConnected: false
      },
      {
        id: generateId(),
        componentId: '',
        interfaceDefinitionId: 'uart',
        name: 'Diagnostic Port',
        position: 'bottom',
        isConnected: false
      }
    ]
  };

  const transmissionSubsystem: Component = {
    id: generateId(),
    name: 'Transmission',
    description: 'Automatic transmission system with electronic control',
    type: 'component', 
    parentId: rootSystem.id,
    position: { x: 400, y: 200 },
    interfaces: [
      {
        id: generateId(),
        componentId: '',
        interfaceDefinitionId: 'can',
        name: 'Transmission CAN',
        position: 'left',
        isConnected: false
      }
    ]
  };

  const electricalSystem: Component = {
    id: generateId(),
    name: 'Electrical System',
    description: 'Main electrical distribution, battery management, and charging system',
    type: 'component',
    parentId: rootSystem.id,
    position: { x: 150, y: 350 },
    interfaces: [
      {
        id: generateId(),
        componentId: '',
        interfaceDefinitionId: 'can',
        name: 'Power Management CAN',
        position: 'top',
        isConnected: false
      },
      {
        id: generateId(),
        componentId: '',
        interfaceDefinitionId: 'usbc',
        name: 'Charging Port',
        position: 'bottom',
        isConnected: false
      }
    ]
  };

  const brakingSystem: Component = {
    id: generateId(),
    name: 'Braking System',
    description: 'Anti-lock braking system (ABS) with electronic brake distribution',
    type: 'component',
    parentId: rootSystem.id,
    position: { x: 400, y: 350 },
    interfaces: [
      {
        id: generateId(),
        componentId: '',
        interfaceDefinitionId: 'can',
        name: 'Brake CAN Bus',
        position: 'top',
        isConnected: false
      }
    ]
  };

  const steeringSystem: Component = {
    id: generateId(),
    name: 'Steering System',
    description: 'Electronic power steering with lane keeping assistance',
    type: 'component',
    parentId: rootSystem.id,
    position: { x: 650, y: 200 },
    interfaces: [
      {
        id: generateId(),
        componentId: '',
        interfaceDefinitionId: 'can',
        name: 'Steering CAN Bus',
        position: 'left',
        isConnected: false
      }
    ]
  };

  const infotainmentSystem: Component = {
    id: generateId(),
    name: 'Infotainment System',
    description: 'Multimedia system with navigation, connectivity, and user interface',
    type: 'component',
    parentId: rootSystem.id,
    position: { x: 650, y: 350 },
    interfaces: [
      {
        id: generateId(),
        componentId: '',
        interfaceDefinitionId: 'can',
        name: 'Infotainment CAN',
        position: 'left',
        isConnected: false
      },
      {
        id: generateId(),
        componentId: '',
        interfaceDefinitionId: 'usbc',
        name: 'USB Media Port',
        position: 'bottom',
        isConnected: false
      },
      {
        id: generateId(),
        componentId: '',
        interfaceDefinitionId: 'ethernet',
        name: 'Internet Connection',
        position: 'top',
        isConnected: false
      }
    ]
  };

  const bodyControlModule: Component = {
    id: generateId(),
    name: 'Body Control Module',
    description: 'Controls lighting, windows, locks, and other body electronics',
    type: 'component',
    parentId: rootSystem.id,
    position: { x: 900, y: 275 },
    interfaces: [
      {
        id: generateId(),
        componentId: '',
        interfaceDefinitionId: 'can',
        name: 'Body CAN Bus',
        position: 'left',
        isConnected: false
      }
    ]
  };

  // Update component IDs in interfaces
  const components = [rootSystem, engineSubsystem, transmissionSubsystem, electricalSystem, brakingSystem, steeringSystem, infotainmentSystem, bodyControlModule];
  components.forEach(component => {
    component.interfaces.forEach(interface_ => {
      interface_.componentId = component.id;
    });
  });

  const project: Project = {
    id: projectId,
    name,
    components,
    connections: []
  };
  
  if (description) {
    project.description = description;
  }
  
  return project;
}