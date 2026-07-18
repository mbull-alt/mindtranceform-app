import { useEffect, useState } from "react";
import { S, StarField, Logo } from "./App.jsx";

// ─── PHQ-9 / GAD-7 — validated clinical screening instruments ────────────────
// Wired to mindtranceform-backend commit b822583:
//   POST /clinical-assessments
//   GET  /clinical-assessments/status
//   GET  /clinical-assessments/safety-pending
//   POST /clinical-assessments/safety-events/:id/acknowledge
//   GET  /progress (clinicalAssessmentTrend field)
// Item text/stem/answer scale/attribution all come from the backend
// (GET /clinical-assessments/status) so this file never hardcodes or
// rewords the instruments.

const MAX_SCORE = { phq9: 27, gad7: 21 };
const INSTRUMENT_LABEL = { phq9: "PHQ-9", gad7: "GAD-7" };
const INSTRUMENT_SUBLABEL = { phq9: "depression screening", gad7: "anxiety screening" };

// ─── Safety resources card ────────────────────────────────────────────────────
// Non-dismissible by design: no tap-outside-to-close, no ✕ button, no Escape
// handler. The only way off this screen is a successful acknowledge call.
// Do NOT add a close affordance here — see
// Discussions/code-prompts/phq9-gad7-assessment-reporting.md Section 3.
export function SafetyResourcesCard({ onAcknowledge }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleAcknowledge() {
    setBusy(true);
    setError("");
    try {
      await onAcknowledge();
    } catch (e) {
      setError("Something went wrong — please tap again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem 1rem",
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="safety-card-title"
    >
      <div
        style={{
          background: "#0d1030", border: "0.5px solid rgba(232,144,144,0.35)",
          borderRadius: 20, padding: "2rem 1.75rem", maxWidth: 460, width: "100%",
        }}
      >
        <div id="safety-card-title" style={{ fontSize: "1.15rem", fontWeight: 400, color: "#e8e6f0", lineHeight: 1.5, marginBottom: "1.25rem" }}>
          We noticed your answer to the last question. If you're having thoughts of harming yourself, you don't have to go through it alone.
        </div>

        <div style={{ background: "rgba(232,144,144,0.08)", border: "0.5px solid rgba(232,144,144,0.25)", borderRadius: 14, padding: "1.1rem 1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "0.92rem", color: "#e8e6f0", marginBottom: "0.6rem" }}>
            <strong>988 Suicide &amp; Crisis Lifeline</strong> — call or text 988, available 24/7
          </div>
          <div style={{ fontSize: "0.92rem", color: "#e8e6f0" }}>
            <strong>Crisis Text Line</strong> — text HOME to 741741
          </div>
        </div>

        <div style={{ fontSize: "0.8rem", color: "#8a879e", lineHeight: 1.65, marginBottom: "1.5rem" }}>
          Mind Tranceform is a self-guided wellness tool, not a crisis service or a substitute for professional care.
          If you're in immediate danger, please call 911 or go to your nearest emergency room.
        </div>

        {error && <div style={{ ...S.errorBox, marginBottom: "1rem" }}>{error}</div>}

        <button
          style={{ ...S.btnPrimary, width: "100%", opacity: busy ? 0.6 : 1, cursor: busy ? "wait" : "pointer" }}
          onClick={handleAcknowledge}
          disabled={busy}
        >
          {busy ? "…" : "I understand"}
        </button>
      </div>
    </div>
  );
}

// ─── Answer picker for one question ───────────────────────────────────────────
function AnswerOptions({ answerScale, value, onSelect }) {
  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      {answerScale.map((opt) => {
        const selected = value === opt.value;
        return (
          <div
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            style={{
              display: "flex", alignItems: "center", gap: "0.85rem",
              background: selected ? "rgba(168,216,200,0.08)" : "rgba(255,255,255,0.06)",
              border: selected ? "0.5px solid #a8d8c8" : "0.5px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "0.85rem 1rem", cursor: "pointer", userSelect: "none",
            }}
          >
            <span style={{ fontSize: "0.92rem", color: "#e8e6f0" }}>{opt.label}</span>
            <span style={{
              marginLeft: "auto", width: 18, height: 18, borderRadius: "50%",
              border: selected ? "none" : "1.5px solid rgba(255,255,255,0.2)",
              background: selected ? "#a8d8c8" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#07091a", flexShrink: 0,
            }}>{selected ? "✓" : ""}</span>
          </div>
        );
      })}
    </div>
  );
}

function computeInitialPhase(caStatus) {
  if (!caStatus) return "intro";
  const neitherTaken = !caStatus.phq9.hasTaken && !caStatus.gad7.hasTaken;
  if (neitherTaken) return "intro";
  if (caStatus.phq9.shouldOffer) return "phq9";
  if (caStatus.gad7.shouldOffer) return "gad7";
  return "done";
}

// ─── Assessment screen: intro → PHQ-9 → (safety card if triggered) → GAD-7 → done ─
// Baseline offered once (post-onboarding); re-offered per instrument every 14
// days via the caller's banner. Skippable at any point. Item 9 safety-ack
// blocking is driven by `awaitingSafetyAck` (mirrors the parent's global
// safety-card state) — this screen will not advance to GAD-7 until that
// clears, and the SafetyResourcesCard overlay itself blocks all interaction
// underneath in the meantime.
export function ClinicalAssessmentScreen({ content, caStatus, awaitingSafetyAck, onSubmit, onDone, onSkip, footer, modal }) {
  const [phase, setPhase] = useState(() => computeInitialPhase(caStatus));
  const [qIndex, setQIndex] = useState(0);
  const [phq9Answers, setPhq9Answers] = useState({});
  const [gad7Answers, setGad7Answers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [pendingAdvance, setPendingAdvance] = useState(false); // true while waiting on safety ack before moving to GAD-7
  const [lastResult, setLastResult] = useState(null); // { instrument, totalScore, severityBand } for the "done" screen

  const isBaseline = !caStatus?.phq9?.hasTaken && !caStatus?.gad7?.hasTaken;

  // Once the safety card is acknowledged (awaitingSafetyAck flips true → false),
  // continue on to GAD-7 if it's due, otherwise finish.
  useEffect(() => {
    if (pendingAdvance && !awaitingSafetyAck) {
      setPendingAdvance(false);
      advancePastPhq9();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awaitingSafetyAck]);

  function advancePastPhq9() {
    if (caStatus?.gad7?.shouldOffer) {
      setPhase("gad7");
      setQIndex(0);
    } else {
      setPhase("done");
    }
  }

  async function submitInstrument(instrument, answers) {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await onSubmit(instrument, answers);
      setLastResult({ instrument, totalScore: res.totalScore, severityBand: res.severityBand });
      if (instrument === "phq9" && res.requiresSafetyAck) {
        // Safety card is now showing globally (parent set it) — hold here until acknowledged.
        setPendingAdvance(true);
      } else if (instrument === "phq9") {
        advancePastPhq9();
      } else {
        setPhase("done");
      }
    } catch (e) {
      setSubmitError("Couldn't save your answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function selectAnswer(instrument, qId, value) {
    const items = instrument === "phq9" ? content.phq9Items : content.gad7Items;
    const answers = instrument === "phq9" ? phq9Answers : gad7Answers;
    const setAnswers = instrument === "phq9" ? setPhq9Answers : setGad7Answers;
    const nextAnswers = { ...answers, [qId]: value };
    setAnswers(nextAnswers);

    if (qIndex < items.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      submitInstrument(instrument, nextAnswers);
    }
  }

  function goBackQuestion() {
    if (qIndex > 0) setQIndex((i) => i - 1);
  }

  const wrap = (children) => (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo />
        <div style={S.card}>{children}</div>
        {footer}
      </div>
      {modal}
    </div>
  );

  if (phase === "intro") {
    return wrap(
      <>
        <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "0.75rem" }}>Track how you're doing</div>
        <div style={{ fontSize: "0.9rem", color: "#c8c5d8", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          This app uses two standard, validated wellness questionnaires (PHQ-9 and GAD-7) so you can track how
          you're doing over time. Takes about 2 minutes. You can skip this.
        </div>
        <div style={S.row}>
          <button style={S.btn} onClick={onSkip}>Skip for now</button>
          <button
            style={{ ...S.btnPrimary, opacity: content.phq9Items?.length ? 1 : 0.5 }}
            disabled={!content.phq9Items?.length}
            onClick={() => { setPhase("phq9"); setQIndex(0); }}
          >Start →</button>
        </div>
        {!content.phq9Items?.length && (
          <div style={{ fontSize: "0.75rem", color: "#8a879e", textAlign: "center", marginTop: "0.75rem" }}>
            Couldn't load the questionnaire right now — please try again shortly.
          </div>
        )}
        <div style={{ fontSize: "0.68rem", color: "#8a879e", lineHeight: 1.6, marginTop: "1.5rem", textAlign: "center" }}>
          {content.attribution}
        </div>
      </>
    );
  }

  if (phase === "phq9" || phase === "gad7") {
    const instrument = phase;
    const items = instrument === "phq9" ? content.phq9Items : content.gad7Items;
    const answers = instrument === "phq9" ? phq9Answers : gad7Answers;
    const item = items[qIndex];

    if (!item) {
      return wrap(
        <>
          <div style={S.errorBox}>Couldn't load the questionnaire. Please go back and try again.</div>
          <button style={{ ...S.resetBtn, marginTop: "0.5rem" }} onClick={onSkip}>← Back to home</button>
        </>
      );
    }

    return wrap(
      <>
        <div style={S.progressBar}>
          <div style={{ ...S.progressFill, width: `${((qIndex + 1) / items.length) * 100}%` }} />
        </div>
        <div style={S.stepLabel}>{INSTRUMENT_LABEL[instrument]} — Question {qIndex + 1} of {items.length}</div>
        <div style={{ fontSize: "0.82rem", color: "#8a879e", marginBottom: "1rem" }}>{content.stem}</div>
        <div style={S.stepQ}>{item.text}</div>
        <AnswerOptions
          answerScale={content.answerScale}
          value={answers[item.id]}
          onSelect={(v) => !submitting && selectAnswer(instrument, item.id, v)}
        />
        {submitError && <div style={{ ...S.errorBox, marginTop: "1rem" }}>{submitError}</div>}
        <div style={S.row}>
          <button style={S.btn} onClick={qIndex === 0 ? onSkip : goBackQuestion} disabled={submitting}>
            {qIndex === 0 ? "Skip for now" : "← Back"}
          </button>
        </div>
        {submitting && <div style={{ fontSize: "0.78rem", color: "#8a879e", textAlign: "center", marginTop: "0.75rem" }}>Saving…</div>}
        <div style={{ fontSize: "0.68rem", color: "#8a879e", lineHeight: 1.6, marginTop: "1.5rem", textAlign: "center" }}>
          {content.attribution}
        </div>
      </>
    );
  }

  // phase === "done"
  return wrap(
    <>
      <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "0.75rem" }}>
        {isBaseline ? "Thanks — you're all set" : "Thanks for checking in"}
      </div>
      <div style={{ fontSize: "0.9rem", color: "#c8c5d8", lineHeight: 1.7, marginBottom: "1.5rem" }}>
        Your answers are saved. We'll check in again in a couple of weeks so you can see how things are trending.
      </div>
      <div style={S.row}>
        <button style={S.btn} onClick={() => onDone("home")}>Back to home</button>
        <button style={S.btnPrimary} onClick={() => onDone("progress")}>View your progress →</button>
      </div>
    </>
  );
}

// ─── Lightweight dependency-free sparkline ────────────────────────────────────
function Sparkline({ points, max, color }) {
  if (!points.length) return null;
  const w = 280, h = 56, pad = 8;
  const xStep = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0;
  const y = (v) => h - pad - (v / max) * (h - pad * 2);
  const coords = points.map((v, i) => `${pad + i * xStep},${y(v)}`).join(" ");
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      {points.length > 1 && <polyline points={coords} fill="none" stroke={color} strokeWidth="2" />}
      {points.map((v, i) => <circle key={i} cx={pad + i * xStep} cy={y(v)} r="3" fill={color} />)}
    </svg>
  );
}

function trendSentence(instrument, entries) {
  if (entries.length < 2) return null;
  const first = entries[0].totalScore;
  const last = entries[entries.length - 1].totalScore;
  const label = INSTRUMENT_LABEL[instrument];
  if (last < first) return `Your ${label} score has trended down over your last ${entries.length} check-ins.`;
  if (last > first) return `Your ${label} score has trended up over your last ${entries.length} check-ins.`;
  return `Your ${label} score has stayed steady over your last ${entries.length} check-ins.`;
}

function InstrumentTrendCard({ instrument, entries, onStartAssessment }) {
  if (!entries || entries.length === 0) {
    return (
      <div style={{ ...S.infoBox, marginBottom: "1.25rem" }}>
        <div style={{ color: "#e8e6f0", fontSize: "0.92rem", marginBottom: "0.4rem" }}>
          {INSTRUMENT_LABEL[instrument]} <span style={{ color: "#8a879e", fontSize: "0.75rem" }}>· {INSTRUMENT_SUBLABEL[instrument]}</span>
        </div>
        <div style={{ marginBottom: "0.85rem" }}>You haven't taken a {INSTRUMENT_LABEL[instrument]} check-in yet.</div>
        <button style={{ ...S.btnPrimary, padding: "0.55rem 1.1rem", fontSize: "0.82rem" }} onClick={onStartAssessment}>
          Take a 2-minute check-in →
        </button>
      </div>
    );
  }

  const latest = entries[entries.length - 1];
  const points = entries.map((e) => e.totalScore);
  const sentence = trendSentence(instrument, entries);

  return (
    <div style={{ ...S.card, marginBottom: "1.25rem", padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
        <div style={{ color: "#e8e6f0", fontSize: "0.92rem" }}>
          {INSTRUMENT_LABEL[instrument]} <span style={{ color: "#8a879e", fontSize: "0.75rem" }}>· {INSTRUMENT_SUBLABEL[instrument]}</span>
        </div>
        <div style={{ color: "#a8d8c8", fontSize: "0.8rem", textTransform: "capitalize" }}>{latest.severityBand}</div>
      </div>
      <Sparkline points={points} max={MAX_SCORE[instrument]} color="#a8d8c8" />
      {sentence && <div style={{ fontSize: "0.8rem", color: "#8a879e", marginTop: "0.75rem", lineHeight: 1.6 }}>{sentence}</div>}
    </div>
  );
}

// ─── Progress screen ───────────────────────────────────────────────────────────
// Displays clinicalAssessmentTrend alongside the existing selfAssessmentTrend
// (read-only here — no self-assessment submission UI is added or modified).
export function ProgressScreen({ data, loading, onBack, onStartAssessment, footer, modal }) {
  return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo />
        <div style={S.card}>
          <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "1.25rem" }}>Your Progress</div>

          {loading && (
            <div style={{ color: "#8a879e", textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: "1.4rem", animation: "spin 1s linear infinite", display: "inline-block" }}>◌</div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>Loading your progress…</div>
            </div>
          )}

          {!loading && data && (
            <>
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.6rem", color: "#a8d8c8" }}>{data.currentStreak}</div>
                  <div style={{ fontSize: "0.7rem", color: "#8a879e", textTransform: "uppercase", letterSpacing: "0.1em" }}>Current streak</div>
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.6rem", color: "#c9a8d8" }}>{data.totalSessions}</div>
                  <div style={{ fontSize: "0.7rem", color: "#8a879e", textTransform: "uppercase", letterSpacing: "0.1em" }}>Total sessions</div>
                </div>
              </div>

              <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8a879e", marginBottom: "0.85rem" }}>
                Wellness check-ins
              </div>
              <InstrumentTrendCard instrument="phq9" entries={data.clinicalAssessmentTrend?.phq9} onStartAssessment={onStartAssessment} />
              <InstrumentTrendCard instrument="gad7" entries={data.clinicalAssessmentTrend?.gad7} onStartAssessment={onStartAssessment} />

              {data.selfAssessmentTrend && data.selfAssessmentTrend.length > 0 && (
                <div style={{ ...S.infoBox, marginTop: "0.25rem" }}>
                  <div style={{ color: "#e8e6f0", fontSize: "0.85rem", marginBottom: "0.4rem" }}>Wellness score trend</div>
                  {data.selfAssessmentTrend.length} entries recorded.
                </div>
              )}
            </>
          )}

          {!loading && !data && (
            <div style={{ color: "#8a879e", textAlign: "center", padding: "2rem 0" }}>Couldn't load your progress right now.</div>
          )}
        </div>
        <button style={S.resetBtn} onClick={onBack}>← Back to home</button>
        {footer}
      </div>
      {modal}
    </div>
  );
}
