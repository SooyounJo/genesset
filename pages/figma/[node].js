import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Figma.module.css";
import { getFigmaAsset } from "@/lib/figmaAssets";

export default function FigmaNodePage() {
  const router = useRouter();
  const node = typeof router.query.node === "string" ? router.query.node : "";
  const asset = getFigmaAsset(node);

  if (!router.isReady) return null;

  if (!asset) {
    return (
      <main className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Not Found</h1>
          <Link className={styles.link} href="/figma">
            목록으로
          </Link>
        </div>
        <p className={styles.help}>알 수 없는 node 입니다: {node}</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {asset.name} <span className={styles.nodeInline}>({asset.nodeId})</span>
        </h1>
        <Link className={styles.link} href="/figma">
          목록으로
        </Link>
      </div>

      <div className={styles.detail}>
        <img className={styles.detailImg} alt={asset.name} src={asset.src} />
      </div>
    </main>
  );
}

