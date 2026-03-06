import styles from "@/styles/Landing.module.css";
import { useLandingLogic } from "./logic";

export default function Landing() {
  const { start } = useLandingLogic();

  return (
    <main className={styles.page}>
      <section className={styles.stage}>
        <div className={styles.center}>
          <h1 className={styles.heading}>Generative Emoji</h1>
          <button className={styles.cta} type="button" onClick={start}>
            Chat now
          </button>
        </div>
      </section>
    </main>
  );
}

