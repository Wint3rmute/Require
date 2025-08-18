import { CreateInterfaceForm } from "@/app/interfaces/page"
import styles from "@/app/page.module.css";

export default function NewInterfacePage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <CreateInterfaceForm />
      </main>
    </div>
  )
}


