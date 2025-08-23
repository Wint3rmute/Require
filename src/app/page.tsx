'use client';

import { useProjects, useCurrentProjectId, createNewProject, createCarTemplate } from '@/lib/storage';
import ProjectManager from '@/components/project_manager';
import LandingPage from '@/components/landing_page';

export default function Home() {
  const [projects, setProjects] = useProjects();
  const [, setCurrentProjectId] = useCurrentProjectId();

  const handleCreateProject = (name: string, description?: string, useTemplate?: boolean) => {
    const newProject = useTemplate 
      ? createCarTemplate(name, description)
      : createNewProject(name, description);
    setProjects([...projects, newProject]);
    setCurrentProjectId(newProject.id);
  };

  // Show landing page if no projects exist, otherwise show project manager
  if (projects.length === 0) {
    return <LandingPage onCreateProject={handleCreateProject} />;
  }

  return <ProjectManager />;
}
