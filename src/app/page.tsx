'use client';

import { useCallback, useRef } from 'react';
import { useProjects, useCurrentProjectId, createNewProject, createCarTemplate } from '@/lib/storage';
import ProjectManager from '@/components/project_manager';
import LandingPage from '@/components/landing_page';

export default function Home() {
  const [projects, setProjects] = useProjects();
  const [, setCurrentProjectId] = useCurrentProjectId();
  const isCreatingRef = useRef(false);

  const handleCreateProject = useCallback((name: string, description?: string, useTemplate?: boolean) => {
    if (isCreatingRef.current) {
      return;
    }
    
    isCreatingRef.current = true;
    
    const newProject = useTemplate 
      ? createCarTemplate(name, description)
      : createNewProject(name, description);
    
    setProjects(prevProjects => [...prevProjects, newProject]);
    setCurrentProjectId(newProject.id);
    
    // Reset the ref after a short delay
    setTimeout(() => {
      isCreatingRef.current = false;
    }, 100);
  }, [setProjects, setCurrentProjectId]);

  // Show landing page if no projects exist, otherwise show project manager
  if (projects.length === 0) {
    return <LandingPage onCreateProject={handleCreateProject} />;
  }

  return <ProjectManager />;
}
