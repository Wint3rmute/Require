"use client"

import styles from "../page.module.css";
import Button from '@mui/material/Button';
import '@xyflow/react/dist/style.css';
import SubsystemsList from "@/components/subsystems_list";

export default function Page() {
  return <div className={styles.page}>
    <main className={styles.main}>
      <SubsystemsList />
    </main>
  </div>
}
