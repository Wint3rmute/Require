/**
 * Tests for SystemView functionality
 * 
 * Tests the SystemView management functions and models
 */

import {
  createNewProject,
  addSystemViewToProject,
  updateSystemViewInProject,
  removeSystemViewFromProject,
  setCurrentSystemView,
  updateComponentPositionInSystemView,
  getCurrentSystemView,
  ensureProjectHasSystemViews
} from '../storage';
import { 
  createDefaultSystemView, 
  createEmptySystemView, 
  getComponentPosition, 
  isComponentVisible
} from '../models';
import { Project, SystemView, Component } from '../models';

describe('SystemView Models', () => {
  const mockProjectId = 'test-project-1';
  const mockComponents: Component[] = [
    {
      id: 'comp-1',
      name: 'Test Component 1',
      type: 'component',
      position: { x: 100, y: 100 },
      interfaces: []
    },
    {
      id: 'comp-2',
      name: 'Test Component 2',
      type: 'component',
      position: { x: 200, y: 200 },
      interfaces: []
    }
  ];

  describe('createDefaultSystemView', () => {
    it('should create a default system view with all components visible', () => {
      const systemView = createDefaultSystemView(mockProjectId, mockComponents);
      
      expect(systemView.name).toBe('All Components');
      expect(systemView.description).toBe('Default view showing all components in the system');
      expect(systemView.projectId).toBe(mockProjectId);
      expect(systemView.visibleComponents).toEqual(['comp-1', 'comp-2']);
      expect(systemView.componentPositions['comp-1']).toEqual({ x: 100, y: 100 });
      expect(systemView.componentPositions['comp-2']).toEqual({ x: 200, y: 200 });
      expect(systemView.createdAt).toBeInstanceOf(Date);
      expect(systemView.updatedAt).toBeInstanceOf(Date);
    });

    it('should generate grid positions for components without positions', () => {
      const componentsWithoutPositions: Component[] = [
        { id: 'comp-1', name: 'Test 1', type: 'component', interfaces: [] },
        { id: 'comp-2', name: 'Test 2', type: 'component', interfaces: [] },
        { id: 'comp-3', name: 'Test 3', type: 'component', interfaces: [] },
        { id: 'comp-4', name: 'Test 4', type: 'component', interfaces: [] }
      ];

      const systemView = createDefaultSystemView(mockProjectId, componentsWithoutPositions);
      
      expect(systemView.componentPositions['comp-1']).toEqual({ x: 100, y: 100 });
      expect(systemView.componentPositions['comp-2']).toEqual({ x: 350, y: 100 });
      expect(systemView.componentPositions['comp-3']).toEqual({ x: 100, y: 250 });
      expect(systemView.componentPositions['comp-4']).toEqual({ x: 350, y: 250 });
    });
  });

  describe('createEmptySystemView', () => {
    it('should create an empty system view', () => {
      const name = 'Test View';
      const description = 'Test description';
      const systemView = createEmptySystemView(mockProjectId, name, description);
      
      expect(systemView.name).toBe(name);
      expect(systemView.description).toBe(description);
      expect(systemView.projectId).toBe(mockProjectId);
      expect(systemView.visibleComponents).toEqual([]);
      expect(systemView.visibleInterfaces).toEqual([]);
      expect(systemView.componentPositions).toEqual({});
    });

    it('should create view without description when not provided', () => {
      const name = 'Test View';
      const systemView = createEmptySystemView(mockProjectId, name);
      
      expect(systemView.name).toBe(name);
      expect(systemView.description).toBeUndefined();
    });
  });

  describe('getComponentPosition', () => {
    const mockSystemView: SystemView = {
      id: 'view-1',
      name: 'Test View',
      projectId: mockProjectId,
      componentPositions: { 'comp-1': { x: 300, y: 400 } },
      visibleComponents: ['comp-1'],
      visibleInterfaces: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should return position from system view when available', () => {
      const component = mockComponents[0];
      const position = getComponentPosition(component, mockSystemView);
      
      expect(position).toEqual({ x: 300, y: 400 });
    });

    it('should return component position as fallback', () => {
      const component = mockComponents[1]; // not in system view
      const position = getComponentPosition(component, mockSystemView);
      
      expect(position).toEqual({ x: 200, y: 200 });
    });

    it('should return default position as last resort', () => {
      const componentWithoutPosition: Component = {
        id: 'comp-3',
        name: 'Test Component 3',
        type: 'component',
        interfaces: []
      };
      const position = getComponentPosition(componentWithoutPosition, mockSystemView);
      
      expect(position).toEqual({ x: 100, y: 100 });
    });
  });

  describe('isComponentVisible', () => {
    const mockSystemView: SystemView = {
      id: 'view-1',
      name: 'Test View',
      projectId: mockProjectId,
      componentPositions: {},
      visibleComponents: ['comp-1', 'comp-3'],
      visibleInterfaces: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should return true for visible components', () => {
      expect(isComponentVisible('comp-1', mockSystemView)).toBe(true);
      expect(isComponentVisible('comp-3', mockSystemView)).toBe(true);
    });

    it('should return false for non-visible components', () => {
      expect(isComponentVisible('comp-2', mockSystemView)).toBe(false);
      expect(isComponentVisible('comp-999', mockSystemView)).toBe(false);
    });
  });
});

describe('SystemView Storage Functions', () => {
  let testProject: Project;

  beforeEach(() => {
    testProject = createNewProject('Test Project');
  });

  describe('addSystemViewToProject', () => {
    it('should add a new system view to a project', () => {
      const systemViewData = {
        name: 'Custom View',
        description: 'A custom view',
        projectId: testProject.id,
        componentPositions: {},
        visibleComponents: [],
        visibleInterfaces: []
      };

      const updatedProject = addSystemViewToProject(testProject, systemViewData);
      
      expect(updatedProject.systemViews).toHaveLength(2); // default + new
      const newView = updatedProject.systemViews[1];
      expect(newView.name).toBe('Custom View');
      expect(newView.description).toBe('A custom view');
      expect(newView.id).toBeDefined();
      expect(newView.createdAt).toBeInstanceOf(Date);
      expect(newView.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('updateSystemViewInProject', () => {
    it('should update an existing system view', () => {
      const systemViewId = testProject.systemViews![0].id;
      const updates = {
        name: 'Updated View Name',
        description: 'Updated description'
      };

      const updatedProject = updateSystemViewInProject(testProject, systemViewId, updates);
      const updatedView = updatedProject.systemViews!.find(v => v.id === systemViewId);
      
      expect(updatedView!.name).toBe('Updated View Name');
      expect(updatedView!.description).toBe('Updated description');
      expect(updatedView!.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('removeSystemViewFromProject', () => {
    it('should remove a system view from project', () => {
      // Add a second view first
      const updatedProject = addSystemViewToProject(testProject, {
        name: 'View to Remove',
        projectId: testProject.id,
        componentPositions: {},
        visibleComponents: [],
        visibleInterfaces: []
      });

      const viewToRemove = updatedProject.systemViews![1];
      const finalProject = removeSystemViewFromProject(updatedProject, viewToRemove.id);
      
      expect(finalProject.systemViews).toHaveLength(1);
      expect(finalProject.systemViews!.find(v => v.id === viewToRemove.id)).toBeUndefined();
    });

    it('should switch current view when removing the active view', () => {
      // Add a second view
      const projectWithTwoViews = addSystemViewToProject(testProject, {
        name: 'Second View',
        projectId: testProject.id,
        componentPositions: {},
        visibleComponents: [],
        visibleInterfaces: []
      });

      const secondViewId = projectWithTwoViews.systemViews![1].id;
      
      // Set second view as current
      const projectWithCurrentView = setCurrentSystemView(projectWithTwoViews, secondViewId);
      
      // Remove the current view
      const finalProject = removeSystemViewFromProject(projectWithCurrentView, secondViewId);
      
      expect(finalProject.currentSystemViewId).toBe(finalProject.systemViews![0].id);
    });
  });

  describe('setCurrentSystemView', () => {
    it('should set the current system view', () => {
      const systemViewId = testProject.systemViews![0].id;
      const updatedProject = setCurrentSystemView(testProject, systemViewId);
      
      expect(updatedProject.currentSystemViewId).toBe(systemViewId);
    });
  });

  describe('updateComponentPositionInSystemView', () => {
    it('should update component position in a system view', () => {
      const systemViewId = testProject.systemViews![0].id;
      const componentId = testProject.components[0].id;
      const newPosition = { x: 500, y: 600 };

      const updatedProject = updateComponentPositionInSystemView(
        testProject,
        systemViewId,
        componentId,
        newPosition
      );

      const systemView = updatedProject.systemViews!.find(v => v.id === systemViewId);
      expect(systemView!.componentPositions[componentId]).toEqual(newPosition);
    });
  });

  describe('getCurrentSystemView', () => {
    it('should return current system view when set', () => {
      const systemViewId = testProject.systemViews![0].id;
      const projectWithCurrentView = setCurrentSystemView(testProject, systemViewId);
      
      const currentView = getCurrentSystemView(projectWithCurrentView);
      
      expect(currentView!.id).toBe(systemViewId);
    });

    it('should return first view when no current view is set', () => {
      const currentView = getCurrentSystemView(testProject);
      
      expect(currentView!.id).toBe(testProject.systemViews![0].id);
    });

    it('should return null when no system views exist', () => {
      const projectWithoutViews: Project = {
        ...testProject,
        systemViews: []
      };
      
      const currentView = getCurrentSystemView(projectWithoutViews);
      
      expect(currentView).toBeNull();
    });
  });

  describe('ensureProjectHasSystemViews', () => {
    it('should create default system view for project without views', () => {
      const projectWithoutViews: Project = {
        ...testProject,
        systemViews: []
      };

      const migratedProject = ensureProjectHasSystemViews(projectWithoutViews);
      
      expect(migratedProject.systemViews).toHaveLength(1);
      expect(migratedProject.systemViews![0].name).toBe('All Components');
      expect(migratedProject.currentSystemViewId).toBe(migratedProject.systemViews![0].id);
    });

    it('should not modify project that already has system views', () => {
      const migratedProject = ensureProjectHasSystemViews(testProject);
      
      expect(migratedProject).toBe(testProject); // should return same object
    });
  });
});