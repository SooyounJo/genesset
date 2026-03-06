import Link from "next/link";
import styles from "@/styles/Figma.module.css";
import { figmaAssets } from "@/lib/figmaAssets";

export default function FigmaIndexPage() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Figma Designs (8)</h1>
        <Link className={styles.link} href="/">
          메인으로
        </Link>
      </div>

      <div className={styles.grid}>
        {figmaAssets.map((asset) => (
          <Link key={asset.node} className={styles.card} href={`/figma/${asset.node}`}>
            <div className={styles.thumb}>
              <img className={styles.thumbImg} alt={asset.name} src={asset.src} loading="lazy" />
            </div>
            <div className={styles.meta}>
              <div className={styles.name}>{asset.name}</div>
              <div className={styles.node}>{asset.nodeId}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

