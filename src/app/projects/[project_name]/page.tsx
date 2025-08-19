import styles from "@/app/page.module.css";
import Link from 'next/link';
import { getProjectBySlug, getNumComponents, getNumInterfaces } from "@/lib/db";
import { Button } from "@mui/material";

export default async function ProjectDashboardPage({
  params,
}: {
  params: Promise<{ project_name: string }>
}) {
  const { project_name } = await params
  const project = await getProjectBySlug(project_name);

  if (project == null) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <ProjectNotFound slug={project_name} />
        </main>
      </div>
    )
  }

  const num_components = getNumComponents(project_name);
  const num_interfaces = getNumInterfaces(project_name);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p>
          {project.name}
        </p>

        <p>Total components: {num_components}</p>
        <Link href={`/projects/${project_name}/components/new`}>
          <Button>new component</Button>
        </Link>

        <p>Total interfaces: {num_interfaces}</p>
        <Link href={`/projects/${project_name}/interfaces/new`}>
          <Button>new interface</Button>
        </Link>


      </main>
    </div>
  )
}

async function ProjectNotFound(slug: { slug: string }) {
  return (<p>Project &quot;{slug.slug}&quot; not found</p>)
}
