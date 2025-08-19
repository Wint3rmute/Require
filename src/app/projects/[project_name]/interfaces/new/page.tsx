import { CreateInterfaceForm } from "@/app/interfaces/page"
import styles from "@/app/page.module.css";

export default async function NewInterfacePage({
  params,
}: {
  params: Promise<{ project_name: string }>
}) {
  const { project_name } = await params
  console.log(project_name)
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <CreateInterfaceForm project_name={project_name} />
      </main>
    </div>
  )
}


