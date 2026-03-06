import styles from "@/styles/Text.module.css";
import { useTextLogic } from "./logic";
import { useRef } from "react";
import GradientText from "@/components/ui/GradientText";

const AVATAR_1 = "https://www.figma.com/api/mcp/asset/18dff48d-f38a-47be-a34a-04b06dd781d0";
const AVATAR_2 = "https://www.figma.com/api/mcp/asset/77875335-69e8-49ba-a511-c42c87bda56f";

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeSpace(str) {
  return String(str || "").replace(/\s+/g, " ").trim();
}

function candidateToPattern(candidate) {
  // 후보 내 공백은 원문에서의 공백/줄바꿈/다중공백과 매칭되도록 \s+ 로 변환
  const norm = normalizeSpace(candidate);
  const escaped = escapeRegExp(norm);
  return escaped.replace(/\\\s+/g, "\\s+");
}

function HighlightText({ text, candidates, onPick, guide, sourceMessageId }) {
  const list = (candidates || []).filter(Boolean);
  if (!text || list.length === 0) return text;

  const normalizedMap = new Map(list.map((c) => [normalizeSpace(c), c]));

  const pattern = list
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(candidateToPattern)
    .join("|");

  if (!pattern) return text;
  const re = new RegExp(`(${pattern})`, "g");
  const parts = String(text).split(re);

  let guideUsed = false;
  return parts.map((p, idx) => {
    const key = normalizeSpace(p);
    const canonical = normalizedMap.get(key);
    const hit = Boolean(canonical);
    if (!hit) return <span key={idx}>{p}</span>;
    const isGuide = Boolean(!guideUsed && guide);
    if (isGuide) guideUsed = true;
    return (
      <button
        key={idx}
        type="button"
        className={isGuide ? `${styles.candidateBtn} ${styles.candidateBtnGuide}` : styles.candidateBtn}
        onClick={() => onPick(canonical, sourceMessageId)}
      >
        <GradientText
          inline
          className={styles.candidateGradient}
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          animationSpeed={6}
          pauseOnHover
        >
          {p}
        </GradientText>
      </button>
    );
  });
}

function BubbleText({ message, onPick, guide }) {
  if (message.parts && Array.isArray(message.parts)) {
    return message.parts.map((p, idx) => {
      const clean = String(p.text || "").replace(/\n[ \t]+/g, "\n");
      if (p.tone === "pinkGlow") {
        return (
          <GradientText
            key={idx}
            inline
            className={styles.inlineGradient}
            colors={["#FF9FFC", "#5227FF", "#B19EEF"]}
            animationSpeed={8}
            pauseOnHover
          >
            {clean}
          </GradientText>
        );
      }
      if (p.tone === "blueGlow") {
        return (
          <GradientText
            key={idx}
            inline
            className={styles.inlineGradient}
            colors={["#1F6998", "#4CC9FF", "#B19EEF"]}
            animationSpeed={8}
            pauseOnHover
          >
            {clean}
          </GradientText>
        );
      }
      return <span key={idx}>{clean}</span>;
    });
  }

  if (message.role === "user" && message.candidates?.length) {
    return (
      <HighlightText
        text={message.text}
        candidates={message.candidates}
        onPick={onPick}
        guide={guide}
        sourceMessageId={message.id}
      />
    );
  }

  return message.text;
}

export default function TextPage() {
  const {
    step,
    nickname,
    setNickname,
    proceedNickname,
    joinChat,
    dateText,
    timeline,
    revealedCount,
    input,
    setInput,
    listRef,
    canSend,
    send,
    hasUserMessage,
    showComposer,
    selectCandidate,
    guideMessageId,
    goNext
  } = useTextLogic();
  const nicknameRef = useRef(null);

  return (
    <main className={styles.page}>
      {step === "nickname" ? (
        <div className={styles.onboardingPhone + " " + styles.phoneGreen}>
          <div className={styles.onboardingCenter}>
            <div className={styles.prompt}>
              <div className={styles.promptSmall}>입장하기 전에</div>
              <div className={styles.promptBig}>사용자님의 이름을 알려주세요!</div>
            </div>

            <div
              className={styles.capsule}
              onClick={() => {
                nicknameRef.current?.focus();
              }}
            >
              <input
                className={styles.nicknameInput}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") proceedNickname();
                }}
                placeholder=""
                aria-label="닉네임"
                ref={nicknameRef}
              />
            </div>

            {nickname.trim() ? (
              <button className={styles.nicknameNext} type="button" onClick={proceedNickname}>
                다음
              </button>
            ) : null}
          </div>
        </div>
      ) : step === "join" ? (
        <div className={styles.onboardingPhone + " " + styles.phoneBlue}>
          <div className={styles.onboardingCenter}>
            <div className={styles.avatarStack} aria-hidden="true">
              <div className={styles.avatarOne}>
                <img className={styles.avatarImg} src={AVATAR_1} alt="" />
              </div>
              <div className={styles.avatarTwo}>
                <img className={styles.avatarImg} src={AVATAR_2} alt="" />
              </div>
            </div>
            <button className={styles.joinBtn} type="button" onClick={joinChat}>
              채팅방 입장
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.chatPhone}>
          <div className={styles.chatDate}>{dateText}</div>

          <div ref={listRef} className={styles.chatStream} aria-label="채팅">
            {timeline.slice(0, revealedCount).map((m) => {
              if (m.type === "system") {
                return (
                  <div key={m.id} className={styles.chatSystem}>
                    {m.text}
                  </div>
                );
              }

              if (m.type === "analysis") {
                const a = m.analysis || {};
                return (
                  <div key={m.id} className={styles.analysisRow}>
                    <div className={styles.analysisCard}>
                      <div className={styles.analysisLine}>1. 캐릭터: {a.character || "-"}</div>
                      <div className={styles.analysisLine}>
                        2. 행동 및 감정: {a.action || "-"} / {a.emotion || "-"}
                      </div>
                      <div className={styles.analysisLine}>3. 외형 묘사 및 특징: {a.appearance || "-"}</div>
                      <div className={styles.analysisLine}>
                        4. 소품 및 특수 소품: {(a.props && a.props.length ? a.props.join(", ") : "-")}
                      </div>
                      <div className={styles.analysisLine}>5. 이미지 저장 이름: {a.saveName || "-"}</div>
                    </div>
                  </div>
                );
              }

              if (m.type === "image") {
                return (
                  <div key={m.id} className={styles.introRow}>
                    <div className={styles.introAvatar}>
                      <img
                        className={styles.introAvatarImg}
                        src={m.speaker === "B" ? AVATAR_1 : AVATAR_2}
                        alt=""
                      />
                    </div>
                    <div className={styles.figImageCard}>
                      <div className={styles.figImageLabel}>{m.label || "예시"}</div>
                      <img className={styles.figImage} src={m.src} alt={m.label || ""} />
                      {m.reaction ? <div className={styles.figReaction}>{m.reaction}</div> : null}
                    </div>
                  </div>
                );
              }

              const bubbleClass =
                m.variant === "userWhite"
                  ? styles.userBubble
                  : m.variant === "blue"
                  ? styles.figBubbleBlue
                  : m.variant === "yellowPink"
                    ? styles.figBubbleYellowPink
                    : styles.figBubbleYellow;

              return (
                <div key={m.id} className={styles.introRow}>
                  <div className={styles.introAvatar}>
                    {m.role === "user" ? (
                      <div className={styles.userAvatar} aria-hidden="true" />
                    ) : (
                      <img
                        className={styles.introAvatarImg}
                        src={m.speaker === "B" ? AVATAR_1 : AVATAR_2}
                        alt=""
                      />
                    )}
                  </div>
                  <div className={bubbleClass}>
                    <BubbleText message={m} onPick={selectCandidate} guide={m.id === guideMessageId} />
                  </div>
                </div>
              );
            })}
          </div>

          {showComposer ? (
            <div className={styles.figComposer}>
              <form
                className={styles.figComposerInner}
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <input
                  className={styles.figInput}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder=""
                />
                <button className={styles.figSend} type="submit" disabled={!canSend} aria-label="전송">
                  ↗
                </button>
              </form>
            </div>
          ) : null}

          {showComposer && (hasUserMessage || canSend) ? (
            <button className={styles.nextAfterSend} type="button" onClick={goNext}>
              다음
            </button>
          ) : null}
        </div>
      )}
    </main>
  );
}

