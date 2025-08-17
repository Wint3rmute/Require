import { getProjects } from "@/lib/db"
import { ProjectsList } from "@/components/projects_list"
import { Project } from '@/generated/prisma';
import styles from "../page.module.css";

export default async function Page() {
  const projects: Project[] = await getProjects();


  return (

    <div className={styles.page}>
      <main>
        <ProjectsList projects={projects} />
      </main>
    </div>
  )
}
