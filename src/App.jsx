import { useState, useEffect } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const BACKEND_URL = "https://mindtranceform-backend.onrender.com";

// ─── DATA ────────────────────────────────────────────────────────────────────
const PROGRAMS = [
  { value: "Sleep",            icon: "🌙", label: "Sleep",            sub: "Deep rest & nighttime calm" },
  { value: "Stress & Anxiety", icon: "🌊", label: "Stress & Anxiety", sub: "Quiet the mind, steady the body" },
  { value: "Abundance",        icon: "✨", label: "Abundance",         sub: "Expand into success & possibility" },
];

const VOICES = [
  { value: "Female Calm",      icon: "◌", label: "Female Calm",         sub: "Warm, nurturing, soft" },
  { value: "Male Calm",        icon: "◎", label: "Male Calm",           sub: "Grounded, steady, assured" },
  { value: "Male Deep",        icon: "●", label: "Male Deep Hypnosis",  sub: "Rich, resonant, deeply immersive" },
];

const BACKGROUNDS = [
  { value: "432 Hz",      icon: "♫", label: "432 Hz",        sub: "Healing resonance" },
  { value: "528 Hz",      icon: "♪", label: "528 Hz",        sub: "Transformation & clarity" },
  { value: "Theta Waves", icon: "〜", label: "Theta Waves",   sub: "Deep meditation state" },
  { value: "Delta Sleep", icon: "Zzz", label: "Delta Sleep",  sub: "Profound sleep induction" },
  { value: "Rain",        icon: "◦", label: "Rain",          sub: "Gentle, grounding" },
  { value: "Ocean",       icon: "≈", label: "Ocean",         sub: "Expansive, soothing" },
];

const STEPS = [
  { id: "name",       label: "1 of 5", question: "What is your name?",                        type: "input",   placeholder: "Your first name..." },
  { id: "goal",       label: "2 of 5", question: "What do you want to let go of or achieve?", type: "input",   placeholder: "e.g. Release anxiety and sleep deeply..." },
  { id: "program",    label: "3 of 5", question: "Choose your program",                        type: "options", options: PROGRAMS },
  { id: "voice",      label: "4 of 5", question: "Choose your voice",                          type: "options", options: VOICES },
  { id: "background", label: "5 of 5", question: "Choose your background sound",               type: "options", options: BACKGROUNDS },
];

// ─── STYLES (inline so no extra CSS files needed) ─────────────────────────────
const S = {
  root: {
    minHeight: "100vh",
    background: "#07091a",
    color: "#e8e6f0",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontWeight: 300,
    padding: "0 1.25rem 4rem",
    position: "relative",
    overflow: "hidden",
  },
  wrap: { maxWidth: 560, margin: "0 auto", position: "relative", zIndex: 1 },
  logo: { textAlign: "center", padding: "2.5rem 0 2rem" },
  h1: { fontSize: "2.3rem", fontWeight: 300, letterSpacing: "0.12em", margin: 0, color: "#e8e6f0" },
  h1span: { fontStyle: "italic", color: "#d4b896" },
  logoSub: { fontSize: "0.72rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8a879e", marginTop: "0.4rem" },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: "2rem",
    marginBottom: "1rem",
  },
  progressBar: { height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginBottom: "1.5rem", overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg,#a8d8c8,#c9a8d8)", borderRadius: 2, transition: "width 0.4s ease" },
  stepLabel: { fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#8a879e", marginBottom: "1rem" },
  stepQ: { fontSize: "1.5rem", fontWeight: 300, lineHeight: 1.35, marginBottom: "1.5rem", color: "#e8e6f0" },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.08)",
    border: "0.5px solid rgba(255,255,255,0.18)",
    borderRadius: 10,
    padding: "0.9rem 1rem",
    color: "#e8e6f0",
    fontFamily: "inherit",
    fontSize: "1rem",
    fontWeight: 300,
    outline: "none",
    boxSizing: "border-box",
  },
  optionsList: { display: "grid", gap: "0.6rem" },
  option: (selected) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.85rem",
    background: selected ? "rgba(168,216,200,0.08)" : "rgba(255,255,255,0.06)",
    border: selected ? "0.5px solid #a8d8c8" : "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "0.85rem 1rem",
    cursor: "pointer",
    transition: "all 0.18s",
    userSelect: "none",
  }),
  optionIcon: { width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 },
  optionLabel: { fontSize: "0.92rem", color: "#e8e6f0" },
  optionSub: { fontSize: "0.75rem", color: "#8a879e", marginTop: 1 },
  check: (selected) => ({
    marginLeft: "auto",
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: selected ? "none" : "1.5px solid rgba(255,255,255,0.2)",
    background: selected ? "#a8d8c8" : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    color: "#07091a",
    flexShrink: 0,
  }),
  row: { display: "flex", gap: "0.7rem", marginTop: "1.5rem" },
  btn: {
    flex: 1,
    padding: "0.8rem 1rem",
    borderRadius: 10,
    border: "0.5px solid rgba(255,255,255,0.18)",
    background: "transparent",
    color: "#e8e6f0",
    fontFamily: "inherit",
    fontSize: "0.88rem",
    fontWeight: 400,
    cursor: "pointer",
    transition: "all 0.18s",
    letterSpacing: "0.04em",
  },
  btnPrimary: {
    flex: 1,
    padding: "0.8rem 1rem",
    borderRadius: 10,
    border: "0.5px solid #a8d8c8",
    background: "linear-gradient(135deg,rgba(168,216,200,0.2),rgba(201,168,216,0.2))",
    color: "#a8d8c8",
    fontFamily: "inherit",
    fontSize: "0.88rem",
    fontWeight: 400,
    cursor: "pointer",
    letterSpacing: "0.04em",
  },
  errorBox: {
    background: "rgba(220,80,80,0.1)",
    border: "0.5px solid rgba(220,80,80,0.3)",
    borderRadius: 12,
    padding: "1rem 1.25rem",
    fontSize: "0.85rem",
    color: "#e89090",
    marginBottom: "1rem",
    lineHeight: 1.6,
  },
  genWrap: { textAlign: "center", padding: "2.5rem 1rem" },
  genTitle: { fontSize: "1.3rem", fontWeight: 300, marginBottom: "0.5rem", color: "#e8e6f0" },
  genSub: { fontSize: "0.75rem", color: "#8a879e", letterSpacing: "0.15em", textTransform: "uppercase" },
  scriptBox: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "1.25rem",
    fontSize: "0.88rem",
    lineHeight: 1.8,
    color: "#c8c5d8",
    whiteSpace: "pre-wrap",
    maxHeight: 300,
    overflowY: "auto",
    marginBottom: "1.25rem",
    border: "0.5px solid rgba(255,255,255,0.1)",
  },
  tagRow: { display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" },
  tag: {
    fontSize: "0.72rem",
    padding: "0.3rem 0.75rem",
    borderRadius: 20,
    border: "0.5px solid rgba(255,255,255,0.18)",
    color: "#8a879e",
    letterSpacing: "0.08em",
  },
  audio: { width: "100%", marginBottom: "0.75rem", accentColor: "#a8d8c8" },
  audioNote: { fontSize: "0.73rem", color: "#8a879e", textAlign: "center", marginBottom: "1.25rem" },
  resetBtn: {
    background: "none",
    border: "none",
    color: "#8a879e",
    fontSize: "0.8rem",
    cursor: "pointer",
    textDecoration: "underline",
    fontFamily: "inherit",
    display: "block",
    margin: "1.25rem auto 0",
  },
};

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────
function StarField() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
      {Array.from({ length: 70 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          borderRadius: "50%",
          background: "white",
          width: Math.random() * 2 + 0.5,
          height: Math.random() * 2 + 0.5,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.5 + 0.1,
          animation: `twinkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}

function PulseRing() {
  return (
    <div style={{
      width: 70, height: 70, borderRadius: "50%",
      border: "1.5px solid #a8d8c8",
      margin: "0 auto 1.5rem",
      animation: "pulseRing 2s ease-in-out infinite",
    }} />
  );
}

function Dots() {
  return (
    <div style={{ display: "inline-flex", gap: 5, marginTop: "1rem" }}>
      {[0, 0.2, 0.4].map((d, i) => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: "50%", background: "#a8d8c8",
          animation: `dotPop 1.4s ease-in-out ${d}s infinite`,
        }} />
      ))}
    </div>
  );
}

function OptionList({ options, selected, onSelect }) {
  return (
    <div style={S.optionsList}>
      {options.map((o) => {
        const sel = selected === o.value;
        return (
          <div key={o.value} style={S.option(sel)} onClick={() => onSelect(o.value)}>
            <div style={S.optionIcon}>{o.icon}</div>
            <div>
              <div style={S.optionLabel}>{o.label}</div>
              <div style={S.optionSub}>{o.sub}</div>
            </div>
            <div style={S.check(sel)}>{sel ? "✓" : ""}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function MindTranceformApp() {
  const [step, setStep]           = useState(0);
  const [form, setForm]           = useState({ name: "", goal: "", program: "", voice: "", background: "" });
  const [error, setError]         = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult]       = useState(null);

  // Inject keyframes once
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes twinkle { 0%{opacity:0.1} 100%{opacity:0.6} }
      @keyframes pulseRing { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.12);opacity:1} }
      @keyframes dotPop { 0%,60%,100%{transform:scale(1);opacity:0.4} 30%{transform:scale(1.4);opacity:1} }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  function updateForm(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  function goNext() {
    const s = STEPS[step];
    if (s.type === "input") {
      const val = form[s.id].trim();
      if (!val) { setError("Please fill this in to continue."); return; }
    } else {
      if (!form[s.id]) { setError("Please choose an option."); return; }
    }
    setError("");
    setStep((p) => p + 1);
  }

  function goBack() { setError(""); setStep((p) => Math.max(0, p - 1)); }

  async function generate() {
    setGenerating(true);
    setError("");
    try {
      const response = await fetch(`${BACKEND_URL}/generate-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(typeof data.error === "string" ? data.error : "Generation failed. Please try again.");
      }
      if (!data.script) throw new Error("No script returned from server.");
      const audioUrl = data.audioBase64
        ? `data:audio/mpeg;base64,${data.audioBase64}`
        : null;
      setResult({ script: data.script, audioUrl });
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function restart() {
    setStep(0);
    setForm({ name: "", goal: "", program: "", voice: "", background: "" });
    setResult(null);
    setError("");
    setGenerating(false);
  }

  // ── GENERATING SCREEN ──
  if (generating) {
    return (
      <div style={S.root}>
        <StarField />
        <div style={S.wrap}>
          <div style={S.logo}>
            <h1 style={S.h1}>Mind <span style={S.h1span}>Tranceform</span></h1>
          </div>
          <div style={S.card}>
            <div style={S.genWrap}>
              <PulseRing />
              <div style={S.genTitle}>Creating your session</div>
              <div style={S.genSub}>Personalizing for {form.name || "you"}</div>
              <Dots />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN ──
  if (result) {
    const tags = [form.program, form.voice, form.background].filter(Boolean);
    return (
      <div style={S.root}>
        <StarField />
        <div style={S.wrap}>
          <div style={S.logo}>
            <h1 style={S.h1}>Mind <span style={S.h1span}>Tranceform</span></h1>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: "1.5rem", fontWeight: 300, marginBottom: "0.4rem" }}>
              Your session is ready{form.name ? `, ${form.name}` : ""}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#8a879e", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Personalized {form.program} · {form.voice}
            </div>
            <div style={S.tagRow}>
              {tags.map((t) => <div key={t} style={S.tag}>{t}</div>)}
            </div>

            {result.audioUrl && (
              <>
                <audio controls style={S.audio} src={result.audioUrl} />
                <div style={S.audioNote}>Your personalized audio session</div>
              </>
            )}

            {!result.audioUrl && (
              <div style={{ ...S.errorBox, background: "rgba(168,216,200,0.06)", borderColor: "rgba(168,216,200,0.2)", color: "#8a879e" }}>
                Audio voice generation requires your ElevenLabs API key on the backend. Your personalized script is below — it is ready to be read or converted to audio.
              </div>
            )}

            <div style={S.scriptBox}>{result.script}</div>

            <button style={{ ...S.btnPrimary, width: "100%" }} onClick={generate}>
              ✦ Regenerate Session
            </button>
          </div>
          <button style={S.resetBtn} onClick={restart}>Start a new session</button>
        </div>
      </div>
    );
  }

  // ── QUESTIONNAIRE SCREEN ──
  const current = STEPS[step];
  const pct = (step / STEPS.length) * 100;

  return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <div style={S.logo}>
          <h1 style={S.h1}>Mind <span style={S.h1span}>Tranceform</span></h1>
          <p style={S.logoSub}>Personalized Meditation &amp; Hypnosis</p>
        </div>

        <div style={S.card}>
          <div style={S.progressBar}>
            <div style={{ ...S.progressFill, width: `${pct}%` }} />
          </div>
          <div style={S.stepLabel}>Step {current.label}</div>
          <div style={S.stepQ}>{current.question}</div>

          {current.type === "input" ? (
            <input
              style={S.input}
              type="text"
              placeholder={current.placeholder}
              value={form[current.id]}
              autoFocus
              onChange={(e) => { updateForm(current.id, e.target.value); setError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") goNext(); }}
            />
          ) : (
            <OptionList
              options={current.options}
              selected={form[current.id]}
              onSelect={(val) => { updateForm(current.id, val); setError(""); }}
            />
          )}

          <div style={S.row}>
            {step > 0 && (
              <button style={S.btn} onClick={goBack}>← Back</button>
            )}
            {step < STEPS.length - 1 ? (
              <button style={S.btnPrimary} onClick={goNext}>Continue →</button>
            ) : (
              <button style={S.btnPrimary} onClick={generate}>
                Generate My Session ✦
              </button>
            )}
          </div>
        </div>

        {error && <div style={S.errorBox}>⚠ {error}</div>}
      </div>
    </div>
  );
}