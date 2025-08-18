import styles from "@/app/page.module.css";
import Link from 'next/link';
import { getProjectBySlug, getNumComponents, getNumInterfaces } from "@/lib/db";
import { Button } from "@mui/material";

export default async function ProjectDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug);

  if (project == null) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <ProjectNotFound slug={slug} />
        </main>
      </div>
    )
  }

  const num_components = getNumComponents(slug);
  const num_interfaces = getNumInterfaces(slug);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p>
          {project.name}
        </p>

        <p>Total components: {num_components}</p>
        <Link href={`/projects/${slug}/components/new`}>
          <Button>new component</Button>
        </Link>

        <p>Total interfaces: {num_interfaces}</p>
        <Link href={`/projects/${slug}/interfaces/new`}>
          <Button>new interface</Button>
        </Link>


      </main>
    </div>
  )
}

async function ProjectNotFound(slug: { slug: string }) {
  return (<p>Project &quot;{slug.slug}&quot; not found</p>)
}
