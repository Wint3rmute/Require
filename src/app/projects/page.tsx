import { getProjects } from "@/lib/db"
import { ProjectsList } from "@/components/projects_list"
import { Project } from '@/generated/prisma';

export default async function Page() {
  const projects: Project[] = await getProjects();

  return <ProjectsList projects={projects} />
}
