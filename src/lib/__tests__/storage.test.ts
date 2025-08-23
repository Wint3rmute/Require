/**
 * Tests for storage hooks in lib/storage.ts
 * 
 * Tests the four main hooks:
 * - useInterfaces()
 * - useProjects() 
 * - useCurrentProjectId()
 * - useProject(projectId)
 */

import { renderHook, act } from '@testing-library/react';
import {
  useInterfaces,
  useProjects,
  useCurrentProjectId,
  useProject,
  createNewProject,
  STORAGE_KEYS
} from '../storage';
import { Project, Interface } from '../models';

// Mock localStorage for testing
const mockLocalStorage = window.localStorage as jest.Mocked<Storage>;

describe('Storage Hooks', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('useInterfaces', () => {
    it('should return default interfaces when localStorage is empty', () => {
      const { result } = renderHook(() => useInterfaces());
      
      expect(result.current[0]).toHaveLength(6); // DEFAULT_INTERFACES has 6 items
      expect(result.current[0][0]).toMatchObject({
        id: 'uart',
        name: 'UART',
        description: 'Universal Asynchronous Receiver-Transmitter',
        icon: 'uart'
      });
    });

    it('should load interfaces from localStorage when available', () => {
      const storedInterfaces: Interface[] = [
        { id: 'test1', name: 'Test Interface', description: 'Test', icon: 'test' }
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedInterfaces));

      const { result } = renderHook(() => useInterfaces());
      
      expect(result.current[0]).toEqual(storedInterfaces);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.INTERFACES);
    });

    it('should update interfaces and save to localStorage', () => {
      const { result } = renderHook(() => useInterfaces());
      
      const newInterface: Interface = {
        id: 'new-interface',
        name: 'New Interface',
        description: 'A new test interface',
        icon: 'new'
      };

      act(() => {
        const [interfaces, setInterfaces] = result.current;
        setInterfaces([...interfaces, newInterface]);
      });

      // Check that localStorage setItem was called
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('useProjects', () => {
    it('should return empty array when localStorage is empty', () => {
      const { result } = renderHook(() => useProjects());
      
      expect(result.current[0]).toEqual([]);
    });

    it('should load projects from localStorage when available', () => {
      const testProject = createNewProject('Test Project', 'Test Description');
      const storedProjects = [testProject];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedProjects));

      const { result } = renderHook(() => useProjects());
      
      expect(result.current[0]).toHaveLength(1);
      expect(result.current[0][0].name).toBe('Test Project');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.PROJECTS);
    });

    it('should update projects and save to localStorage', () => {
      const { result } = renderHook(() => useProjects());
      
      const newProject = createNewProject('New Project');

      act(() => {
        const [projects, setProjects] = result.current;
        setProjects([...projects, newProject]);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('useCurrentProjectId', () => {
    it('should return null when localStorage is empty', () => {
      const { result } = renderHook(() => useCurrentProjectId());
      
      expect(result.current[0]).toBeNull();
    });

    it('should load current project ID from localStorage when available', () => {
      const testProjectId = 'test-project-123';
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testProjectId));

      const { result } = renderHook(() => useCurrentProjectId());
      
      expect(result.current[0]).toBe(testProjectId);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.CURRENT_PROJECT_ID);
    });

    it('should update current project ID and save to localStorage', () => {
      const { result } = renderHook(() => useCurrentProjectId());
      
      const newProjectId = 'new-project-456';

      act(() => {
        const [, setCurrentProjectId] = result.current;
        setCurrentProjectId(newProjectId);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('useProject', () => {
    it('should return null project when projectId is null', () => {
      const { result } = renderHook(() => useProject(null));
      
      expect(result.current.project).toBeNull();
    });

    it('should return null project when projectId is not found', () => {
      // Mock empty projects array
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.PROJECTS) return JSON.stringify([]);
        return null;
      });

      const { result } = renderHook(() => useProject('non-existent-id'));
      
      expect(result.current.project).toBeNull();
    });

    it('should return project when projectId is found', () => {
      const testProject = createNewProject('Test Project');
      const storedProjects = [testProject];
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.PROJECTS) return JSON.stringify(storedProjects);
        return null;
      });

      const { result } = renderHook(() => useProject(testProject.id));
      
      expect(result.current.project).toEqual(testProject);
      expect(result.current.project?.name).toBe('Test Project');
    });

    it('should update project using updateProject function', () => {
      const testProject = createNewProject('Test Project');
      const storedProjects = [testProject];
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.PROJECTS) return JSON.stringify(storedProjects);
        return null;
      });

      const { result } = renderHook(() => useProject(testProject.id));
      
      const updatedProject: Project = {
        ...testProject,
        name: 'Updated Project Name'
      };

      act(() => {
        result.current.updateProject(updatedProject);
      });

      // Verify localStorage setItem was called for projects update
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('should handle project updates for multiple projects correctly', () => {
      const project1 = createNewProject('Project 1');
      const project2 = createNewProject('Project 2');
      const storedProjects = [project1, project2];
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.PROJECTS) return JSON.stringify(storedProjects);
        return null;
      });

      const { result } = renderHook(() => useProject(project1.id));
      
      const updatedProject: Project = {
        ...project1,
        name: 'Updated Project 1'
      };

      act(() => {
        result.current.updateProject(updatedProject);
      });

      // The hook should have updated only the first project
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Integration between hooks', () => {
    it('should allow useProject to work with projects from useProjects', () => {
      const testProject = createNewProject('Integration Test');
      
      // First set up projects
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.PROJECTS) return JSON.stringify([testProject]);
        return null;
      });

      const projectsHook = renderHook(() => useProjects());
      const projectHook = renderHook(() => useProject(testProject.id));
      
      expect(projectsHook.result.current[0]).toHaveLength(1);
      expect(projectHook.result.current.project?.id).toBe(testProject.id);
    });
  });
});