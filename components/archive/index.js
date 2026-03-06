import styles from "@/styles/Archive.module.css";
import { useArchiveLogic } from "./logic";

export default function ArchivePage() {
  const { assets, back } = useArchiveLogic();

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <button className={styles.back} type="button" onClick={back}>
          ← 텍스트로
        </button>
        <h1 className={styles.title}>이미지 아카이빙</h1>
        <div className={styles.spacer} aria-hidden="true" />
      </div>

      <div className={styles.grid}>
        {assets.map((a) => (
          <article key={a.node} className={styles.card}>
            <div className={styles.thumb}>
              <img className={styles.img} src={a.src} alt={a.name} loading="lazy" />
            </div>
            <div className={styles.meta}>
              <div className={styles.name}>{a.name}</div>
              <div className={styles.node}>{a.nodeId}</div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

