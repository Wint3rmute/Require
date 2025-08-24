'use client';

import { useCallback, useRef } from 'react';
import { useProjects, useCurrentProjectId, createNewProject } from '@/lib/storage';
import { getTemplateById } from '@/lib/templates';
import ProjectManager from '@/components/project_manager';
import LandingPage from '@/components/landing_page';

export default function Home() {
  const [projects, setProjects] = useProjects();
  const [, setCurrentProjectId] = useCurrentProjectId();
  
  /**
   * RACE CONDITION PROTECTION: Prevents duplicate project creation calls
   * 
   * PROBLEM: React's development mode (StrictMode) intentionally double-invokes
   * functions to detect side effects, causing duplicate project creation.
   * 
   * SOLUTION: Use a ref-based guard that:
   * 1. Blocks subsequent calls while one is in progress
   * 2. Resets after a short delay to allow legitimate future calls
   * 3. Persists across renders (unlike state) to be truly effective
   */
  const isCreatingRef = useRef(false);

  const handleCreateProject = useCallback((name: string, description?: string, templateId?: string) => {
    // GUARD: Prevent duplicate calls from React StrictMode or rapid user clicks
    if (isCreatingRef.current) {
      return;
    }
    
    isCreatingRef.current = true;
    
    const template = templateId ? getTemplateById(templateId) : null;
    const newProject = template 
      ? template.createProject(name, description)
      : createNewProject(name, description);
    
    /**
     * FUNCTIONAL STATE UPDATE: Critical pattern to avoid stale closures
     * 
     * BEFORE (problematic): setProjects([...projects, newProject])
     * - Uses 'projects' from closure, which may be stale in rapid updates
     * - Causes race conditions where updates overwrite each other
     * 
     * AFTER (fixed): setProjects(prevProjects => [...prevProjects, newProject])
     * - Always uses the most current state value
     * - Guarantees atomic updates even in rapid succession
     */
    setProjects(prevProjects => [...prevProjects, newProject]);
    setCurrentProjectId(newProject.id);
    
    // Reset guard after brief delay to allow future legitimate calls
    // 100ms is sufficient to prevent double-calls while allowing normal usage
    setTimeout(() => {
      isCreatingRef.current = false;
    }, 100);
  }, [setProjects, setCurrentProjectId]); // Dependencies ensure fresh references

  // Show landing page if no projects exist, otherwise show project manager
  if (projects.length === 0) {
    return <LandingPage onCreateProject={handleCreateProject} />;
  }

  return <ProjectManager />;
}
