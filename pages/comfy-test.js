import { useMemo, useRef, useState } from "react";
import styles from "@/styles/ComfyTest.module.css";
import GradientText from "@/components/ui/GradientText";

function escapeRegExp(str) {
  return String(str || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toAsciiSlug(input, fallback = "term") {
  const s = String(input || "").trim();
  if (!s) return fallback;
  const ascii = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (ascii) return ascii;

  // fallback hash
  let hash = 5381;
  for (let i = 0; i < s.length; i += 1) hash = (hash * 33) ^ s.charCodeAt(i);
  return `${fallback}-${(hash >>> 0).toString(36)}`;
}

function toEnglishNoun(term) {
  const k = String(term || "").trim().replace(/\(.*?\)$/g, "");
  if (!k) return "character";
  const dict = {
    햄스터: "hamster",
    강아지: "puppy",
    고양이: "cat",
    고슴도치: "hedgehog",
    공룡: "dinosaur",
    개구리: "frog",
    새: "bird",
    오징어: "squid",
    당나귀: "donkey",
    아기: "baby",
    사람: "person",
    친구: "friend",
    선인장: "cactus",
    초콜릿: "chocolate",
    피자: "pizza",
    하트: "heart",
    풍선: "balloon",
    당고: "dango",
    녹차: "matcha",
    흙: "soil",
    우산: "umbrella",
    책: "book"
  };
  if (dict[k]) return dict[k];
  if (/^[A-Za-z0-9 _-]+$/.test(k)) return k.trim();
  return toAsciiSlug(k, "character");
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function extractCandidates(text) {
  const s = String(text || "").trim();
  if (!s) return [];
  const raw = s.match(/[A-Za-z0-9가-힣]{2,}/g) || [];
  const stop = new Set(["그리고", "그런데", "하지만", "그래서", "저는", "나는", "너는", "우리는", "오늘", "진짜", "너무", "완전", "그냥"]);
  return uniq(raw.filter((w) => !stop.has(w))).slice(0, 18);
}

function HighlightText({ text, candidates, onPick }) {
  const value = String(text || "");
  const list = (candidates || []).filter(Boolean);
  if (!value || list.length === 0) return value;

  const pattern = list
    .slice()
    .sort((a, b) => b.length - a.length)
    .map((c) => escapeRegExp(c))
    .join("|");
  if (!pattern) return value;

  const re = new RegExp(`(${pattern})`, "g");
  const parts = value.split(re);
  const set = new Set(list);

  return parts.map((p, idx) => {
    if (!set.has(p)) return <span key={idx}>{p}</span>;
    return (
      <button key={idx} type="button" className={styles.termBtn} onClick={() => onPick(p)}>
        <GradientText inline className={styles.termGradient} colors={["#5227FF", "#FF9FFC", "#B19EEF"]} animationSpeed={6} pauseOnHover>
          {p}
        </GradientText>
      </button>
    );
  });
}

export default function ComfyTestPage() {
  const [text, setText] = useState("");
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const abortRef = useRef(null);

  const candidates = useMemo(() => extractCandidates(text), [text]);
  const mainImage = images?.[0] || "";

  async function generate(term) {
    const t = String(term || "").trim();
    if (!t) return;

    setSelected(t);
    setStatus("loading");
    setError("");
    setImages([]);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const subject = toEnglishNoun(t);
    const promptEn = `A cute glossy 3D ${subject} sticker on a clean white background.`;

    try {
      const res = await fetch("/api/comfy/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          prompt: promptEn,
          count: 2,
          width: 1024,
          height: 1024
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.error || "이미지 생성 실패");
      const imgs = Array.isArray(data?.images) ? data.images.filter(Boolean) : [];
      setImages(imgs.slice(0, 2));
      setStatus("done");
    } catch (e) {
      if (controller.signal.aborted) return;
      setStatus("error");
      setError(String(e?.message || e));
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.title}>ComfyUI 생성 테스트</div>
          <div className={styles.sub}>텍스트 입력 → 하이라이트 단어 클릭 → ComfyUI 결과 이미지 표시</div>
        </header>

        <section className={styles.inputSection}>
          <label className={styles.label}>텍스트</label>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="예: 도쿄 불꽃축제 보고 녹차 당고 먹었어"
            spellCheck={false}
          />

          <div className={styles.previewLabel}>하이라이트 (클릭)</div>
          <div className={styles.previewBox} aria-label="하이라이트 프리뷰">
            <HighlightText text={text} candidates={candidates} onPick={generate} />
          </div>
        </section>

        <section className={styles.resultSection}>
          <div className={styles.resultMeta}>
            <div className={styles.metaLine}>
              <span className={styles.metaKey}>선택</span>
              <span className={styles.metaVal}>{selected || "-"}</span>
            </div>
            <div className={styles.metaLine}>
              <span className={styles.metaKey}>상태</span>
              <span className={styles.metaVal}>
                {status === "idle" ? "대기" : status === "loading" ? "생성 중" : status === "done" ? "완료" : "에러"}
              </span>
            </div>
          </div>

          {status === "error" && error ? <div className={styles.errorBox}>{error}</div> : null}

          <div className={styles.canvas} aria-label="생성 이미지">
            {status === "loading" ? <div className={styles.loadingCard}>ComfyUI로 생성 중...</div> : null}
            {status !== "loading" && mainImage ? <img className={styles.mainImg} src={mainImage} alt="generated" /> : null}
            {status !== "loading" && !mainImage ? <div className={styles.emptyCard}>이미지가 여기에 표시됩니다</div> : null}
          </div>

          {images?.length ? (
            <div className={styles.thumbRow} aria-label="생성 결과(2장)">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  className={styles.thumbBtn}
                  onClick={() => {
                    const next = images.slice();
                    const picked = next.splice(i, 1)[0];
                    setImages([picked, ...next]);
                  }}
                  aria-label={`결과 ${i + 1}`}
                >
                  <img className={styles.thumbImg} src={src} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

