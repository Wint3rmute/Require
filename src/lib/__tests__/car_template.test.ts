/**
 * Tests for createCarTemplate function in lib/car_template.ts
 * 
 * Tests that the car template creates a comprehensive automotive system
 * with proper components, interfaces, and hierarchy structure.
 */

import { createCarTemplate } from '../car_template';

describe('createCarTemplate', () => {
  describe('Basic project structure', () => {
    it('should create a project with the correct name and description', () => {
      const projectName = 'Test Car Project';
      const projectDescription = 'Test automotive system';
      
      const project = createCarTemplate(projectName, projectDescription);
      
      expect(project.name).toBe(projectName);
      expect(project.description).toBe(projectDescription);
      expect(project.id).toBeDefined();
      expect(project.connections).toEqual([]);
    });

    it('should create a project with optional description', () => {
      const projectName = 'Car Without Description';
      
      const project = createCarTemplate(projectName);
      
      expect(project.name).toBe(projectName);
      expect(project.description).toBeUndefined();
    });

    it('should generate unique project IDs for multiple calls', () => {
      const project1 = createCarTemplate('Car 1');
      const project2 = createCarTemplate('Car 2');
      
      expect(project1.id).not.toBe(project2.id);
    });
  });

  describe('Component structure', () => {
    let project: ReturnType<typeof createCarTemplate>;

    beforeEach(() => {
      project = createCarTemplate('Test Car');
    });

    it('should create exactly 8 components', () => {
      expect(project.components).toHaveLength(8);
    });

    it('should create a root system component', () => {
      const rootSystem = project.components.find(c => c.type === 'system');
      
      expect(rootSystem).toBeDefined();
      expect(rootSystem?.name).toBe('Test Car System');
      expect(rootSystem?.type).toBe('system');
      expect(rootSystem?.parentId).toBeUndefined();
      expect(rootSystem?.interfaces).toEqual([]);
    });

    it('should create subsystem components with proper hierarchy', () => {
      const rootSystem = project.components.find(c => c.type === 'system');
      const subsystems = project.components.filter(c => c.type === 'subsystem');
      
      expect(subsystems).toHaveLength(5);
      
      const expectedSubsystems = [
        'Engine Subsystem',
        'Transmission',
        'Electrical System',
        'Braking System',
        'Steering System'
      ];

      expectedSubsystems.forEach(name => {
        const subsystem = subsystems.find(s => s.name === name);
        expect(subsystem).toBeDefined();
        expect(subsystem?.parentId).toBe(rootSystem?.id);
      });
    });

    it('should create component-level modules with proper hierarchy', () => {
      const rootSystem = project.components.find(c => c.type === 'system');
      const components = project.components.filter(c => c.type === 'component');
      
      expect(components).toHaveLength(2);
      
      const expectedComponents = [
        'Infotainment System',
        'Body Control Module'
      ];

      expectedComponents.forEach(name => {
        const component = components.find(c => c.name === name);
        expect(component).toBeDefined();
        expect(component?.parentId).toBe(rootSystem?.id);
      });
    });

    it('should assign proper positions to all components', () => {
      project.components.forEach(component => {
        expect(component.position).toBeDefined();
        expect(component.position.x).toBeGreaterThanOrEqual(0);
        expect(component.position.y).toBeGreaterThanOrEqual(0);
      });
    });

    it('should assign unique IDs to all components', () => {
      const componentIds = project.components.map(c => c.id);
      const uniqueIds = new Set(componentIds);
      
      expect(uniqueIds.size).toBe(componentIds.length);
    });
  });

  describe('Interface configuration', () => {
    let project: ReturnType<typeof createCarTemplate>;

    beforeEach(() => {
      project = createCarTemplate('Test Car');
    });

    it('should create components with interfaces (excluding root system)', () => {
      const componentsWithInterfaces = project.components.filter(c => c.interfaces.length > 0);
      
      // All components except root system should have interfaces
      expect(componentsWithInterfaces).toHaveLength(7);
    });

    it('should use valid interface definition IDs', () => {
      const validInterfaceTypes = ['can', 'uart', 'usbc', 'ethernet'];
      
      project.components.forEach(component => {
        component.interfaces.forEach(interface_ => {
          expect(validInterfaceTypes).toContain(interface_.interfaceDefinitionId);
        });
      });
    });

    it('should assign correct componentId to all interfaces', () => {
      project.components.forEach(component => {
        component.interfaces.forEach(interface_ => {
          expect(interface_.componentId).toBe(component.id);
        });
      });
    });

    it('should set all interfaces as not connected initially', () => {
      project.components.forEach(component => {
        component.interfaces.forEach(interface_ => {
          expect(interface_.isConnected).toBe(false);
        });
      });
    });

    it('should assign unique interface IDs', () => {
      const allInterfaces = project.components.flatMap(c => c.interfaces);
      const interfaceIds = allInterfaces.map(i => i.id);
      const uniqueIds = new Set(interfaceIds);
      
      expect(uniqueIds.size).toBe(interfaceIds.length);
    });

    it('should assign proper positions to interfaces', () => {
      const validPositions = ['top', 'bottom', 'left', 'right'];
      
      project.components.forEach(component => {
        component.interfaces.forEach(interface_ => {
          expect(validPositions).toContain(interface_.position);
        });
      });
    });
  });

  describe('Specific component interface requirements', () => {
    let project: ReturnType<typeof createCarTemplate>;

    beforeEach(() => {
      project = createCarTemplate('Test Car');
    });

    it('should configure Engine Subsystem with CAN and UART interfaces', () => {
      const engine = project.components.find(c => c.name === 'Engine Subsystem');
      
      expect(engine?.interfaces).toHaveLength(2);
      
      const canInterface = engine?.interfaces.find(i => i.interfaceDefinitionId === 'can');
      const uartInterface = engine?.interfaces.find(i => i.interfaceDefinitionId === 'uart');
      
      expect(canInterface).toBeDefined();
      expect(canInterface?.name).toBe('Engine CAN Bus');
      expect(uartInterface).toBeDefined();
      expect(uartInterface?.name).toBe('Diagnostic Port');
    });

    it('should configure Transmission with CAN interface', () => {
      const transmission = project.components.find(c => c.name === 'Transmission');
      
      expect(transmission?.interfaces).toHaveLength(1);
      
      const canInterface = transmission?.interfaces.find(i => i.interfaceDefinitionId === 'can');
      expect(canInterface).toBeDefined();
      expect(canInterface?.name).toBe('Transmission CAN');
    });

    it('should configure Electrical System with CAN and USB-C interfaces', () => {
      const electrical = project.components.find(c => c.name === 'Electrical System');
      
      expect(electrical?.interfaces).toHaveLength(2);
      
      const canInterface = electrical?.interfaces.find(i => i.interfaceDefinitionId === 'can');
      const usbcInterface = electrical?.interfaces.find(i => i.interfaceDefinitionId === 'usbc');
      
      expect(canInterface).toBeDefined();
      expect(canInterface?.name).toBe('Power Management CAN');
      expect(usbcInterface).toBeDefined();
      expect(usbcInterface?.name).toBe('Charging Port');
    });

    it('should configure Infotainment System with multiple interface types', () => {
      const infotainment = project.components.find(c => c.name === 'Infotainment System');
      
      expect(infotainment?.interfaces).toHaveLength(3);
      
      const canInterface = infotainment?.interfaces.find(i => i.interfaceDefinitionId === 'can');
      const usbcInterface = infotainment?.interfaces.find(i => i.interfaceDefinitionId === 'usbc');
      const ethernetInterface = infotainment?.interfaces.find(i => i.interfaceDefinitionId === 'ethernet');
      
      expect(canInterface).toBeDefined();
      expect(canInterface?.name).toBe('Infotainment CAN');
      expect(usbcInterface).toBeDefined();
      expect(usbcInterface?.name).toBe('USB Media Port');
      expect(ethernetInterface).toBeDefined();
      expect(ethernetInterface?.name).toBe('Internet Connection');
    });

    it('should configure all CAN bus interfaces for system connectivity', () => {
      const canInterfaces = project.components.flatMap(c => 
        c.interfaces.filter(i => i.interfaceDefinitionId === 'can')
      );
      
      // Should have CAN interfaces on most subsystems for automotive network
      expect(canInterfaces.length).toBeGreaterThanOrEqual(6);
      
      const expectedCanComponents = [
        'Engine Subsystem',
        'Transmission',
        'Electrical System',
        'Braking System',
        'Steering System',
        'Infotainment System',
        'Body Control Module'
      ];

      expectedCanComponents.forEach(componentName => {
        const component = project.components.find(c => c.name === componentName);
        const hasCanInterface = component?.interfaces.some(i => i.interfaceDefinitionId === 'can');
        expect(hasCanInterface).toBe(true);
      });
    });
  });

  describe('Data consistency', () => {
    it('should create consistent data across multiple calls', () => {
      const project1 = createCarTemplate('Car 1');
      const project2 = createCarTemplate('Car 2');
      
      // Should have same structure
      expect(project1.components.length).toBe(project2.components.length);
      
      // Should have same component types in same order
      const types1 = project1.components.map(c => c.type);
      const types2 = project2.components.map(c => c.type);
      expect(types1).toEqual(types2);
      
      // Should have same interface counts per component
      const interfaceCounts1 = project1.components.map(c => c.interfaces.length);
      const interfaceCounts2 = project2.components.map(c => c.interfaces.length);
      expect(interfaceCounts1).toEqual(interfaceCounts2);
    });

    it('should create well-formed component descriptions', () => {
      const project = createCarTemplate('Test Car');
      
      project.components.forEach(component => {
        expect(component.description).toBeDefined();
        expect(component.description).not.toBe('');
        expect(component.description.length).toBeGreaterThan(10);
      });
    });
  });
});