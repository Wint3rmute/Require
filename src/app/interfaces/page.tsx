"use client"

import styles from "../page.module.css";
import InterfacesList from "@/components/interfaces_list";

export default function Page() {
  return <div className={styles.page}>
    <main className={styles.main}>
      <InterfacesList />
    </main>
  </div>
}