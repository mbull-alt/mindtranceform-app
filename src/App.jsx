import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const BACKEND_URL = "https://mindtranceform-backend.onrender.com";
const supabase = createClient(
  "https://rokdnyklcvbzaoodnkbs.supabase.co",
  "sb_publishable_1DNZut5Au5CFFsgwgZT_YA_bB4o2Ohn"
);

// ─── DATA ────────────────────────────────────────────────────────────────────
const PROGRAMS = [
  { value: "Sleep",            icon: "🌙", label: "Sleep",            sub: "Deep rest & nighttime calm" },
  { value: "Stress & Anxiety", icon: "🌊", label: "Stress & Anxiety", sub: "Quiet the mind, steady the body" },
  { value: "Abundance",        icon: "✨", label: "Abundance",         sub: "Expand into success & possibility" },
];

const VOICES = [
  { value: "Female Calm", icon: "◌", label: "Female Calm",        sub: "Warm, nurturing, soft" },
  { value: "Male Calm",   icon: "◎", label: "Male Calm",          sub: "Grounded, steady, assured" },
  { value: "Male Deep",   icon: "●", label: "Male Deep Hypnosis", sub: "Rich, resonant, deeply immersive" },
];

const BACKGROUNDS = [
  { value: "432 Hz",      icon: "♫",   label: "432 Hz",      sub: "Healing resonance" },
  { value: "528 Hz",      icon: "♪",   label: "528 Hz",      sub: "Transformation & clarity" },
  { value: "Theta Waves", icon: "〜",  label: "Theta Waves",  sub: "Deep meditation state" },
  { value: "Delta Sleep", icon: "Zzz", label: "Delta Sleep",  sub: "Profound sleep induction" },
  { value: "Rain",        icon: "◦",   label: "Rain",         sub: "Gentle, grounding" },
  { value: "Ocean",       icon: "≈",   label: "Ocean",        sub: "Expansive, soothing" },
];

const STEPS = [
  { id: "name",       label: "1 of 5", question: "What is your name?",                        type: "input",   placeholder: "Your first name..." },
  { id: "goal",       label: "2 of 5", question: "What do you want to let go of or achieve?", type: "input",   placeholder: "e.g. Release anxiety and sleep deeply..." },
  { id: "program",    label: "3 of 5", question: "Choose your program",                        type: "options", options: PROGRAMS },
  { id: "voice",      label: "4 of 5", question: "Choose your voice",                          type: "options", options: VOICES },
  { id: "background", label: "5 of 5", question: "Choose your background sound",               type: "options", options: BACKGROUNDS },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
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
  infoBox: {
    background: "rgba(168,216,200,0.06)",
    border: "0.5px solid rgba(168,216,200,0.2)",
    borderRadius: 12,
    padding: "1rem 1.25rem",
    fontSize: "0.85rem",
    color: "#8a879e",
    marginBottom: "1.25rem",
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
  sessionItem: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "0.9rem 1rem",
    marginBottom: "0.6rem",
    cursor: "pointer",
    transition: "border-color 0.18s",
  },
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

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function StarField() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
      {Array.from({ length: 70 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%", background: "white",
          width: Math.random() * 2 + 0.5, height: Math.random() * 2 + 0.5,
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
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
      border: "1.5px solid #a8d8c8", margin: "0 auto 1.5rem",
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

function Logo({ sub = false }) {
  return (
    <div style={S.logo}>
      <h1 style={S.h1}>Mind <span style={S.h1span}>Tranceform</span></h1>
      {sub && <p style={S.logoSub}>Personalized Meditation &amp; Hypnosis</p>}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function MindTranceformApp() {
  const [user, setUser]           = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [view, setView]           = useState("auth");

  // Auth form
  const [authMode, setAuthMode]       = useState("login");
  const [authEmail, setAuthEmail]     = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError]     = useState("");
  const [authBusy, setAuthBusy]       = useState(false);

  // Quiz
  const [step, setStep]   = useState(0);
  const [form, setForm]   = useState({ name: "", goal: "", program: "", voice: "", background: "" });
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  // Sessions
  const [genStep, setGenStep] = useState(0);

  const [sessions, setSessions]             = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

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

  useEffect(() => {
    if (!generating) { setGenStep(0); return; }
    const t1 = setTimeout(() => setGenStep(1), 3500);
    const t2 = setTimeout(() => setGenStep(2), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [generating]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setView(session?.user ? "home" : "auth");
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setView(session?.user ? "home" : "auth");
    });
    return () => subscription.unsubscribe();
  }, []);

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  }

  async function handleAuth(e) {
    e.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    let error;
    if (authMode === "signup") {
      ({ error } = await supabase.auth.signUp({ email: authEmail, password: authPassword }));
      if (!error) setAuthError("Check your email to confirm your account, then log in.");
    } else {
      ({ error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword }));
    }
    if (error) setAuthError(error.message);
    setAuthBusy(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setStep(0);
    setForm({ name: "", goal: "", program: "", voice: "", background: "" });
    setResult(null);
    setSessions([]);
    setSelectedSession(null);
  }

  async function fetchSessions() {
    setSessionsLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {}
    setSessionsLoading(false);
  }

  async function openSession(id) {
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.session) {
        setSelectedSession({
          ...data.session,
          audioUrl: data.session.audioBase64
            ? `data:audio/mpeg;base64,${data.session.audioBase64}`
            : null,
        });
        setView("sessionDetail");
      }
    } catch {}
  }

  function updateForm(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  async function generate() {
    setGenerating(true);
    setError("");
    try {
      const token = await getToken();
      const response = await fetch(`${BACKEND_URL}/generate-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(typeof data.error === "string" ? data.error : "Generation failed.");
      if (!data.script) throw new Error("No script returned from server.");
      const audioUrl = data.audioBase64 ? `data:audio/mpeg;base64,${data.audioBase64}` : null;
      setResult({ script: data.script, audioUrl, audioUnavailable: data.audioUnavailable });
      setView("result");
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function goNext() {
    const s = STEPS[step];
    if (s.type === "input") {
      if (!form[s.id].trim()) { setError("Please fill this in to continue."); return; }
    } else {
      if (!form[s.id]) { setError("Please choose an option."); return; }
    }
    setError("");
    if (step < STEPS.length - 1) setStep((p) => p + 1);
    else generate();
  }

  function goBack() {
    setError("");
    if (step === 0) setView("home");
    else setStep((p) => p - 1);
  }

  if (!authReady) return null;

  // ── AUTH ──
  if (view === "auth") return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo sub />
        <div style={S.card}>
          <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "1.5rem", textAlign: "center" }}>
            {authMode === "login" ? "Welcome back" : "Create your account"}
          </div>
          {authError && (
            <div style={authError.includes("Check your email") ? S.infoBox : S.errorBox}>
              {authError}
            </div>
          )}
          <form onSubmit={handleAuth}>
            <input style={{ ...S.input, marginBottom: "0.75rem" }} type="email" placeholder="Email"
              value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required autoFocus />
            <input style={{ ...S.input, marginBottom: "1.25rem" }} type="password" placeholder="Password (min 6 characters)"
              value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
            <button style={{ ...S.btnPrimary, width: "100%" }} type="submit" disabled={authBusy}>
              {authBusy ? "..." : authMode === "login" ? "Log In" : "Create Account"}
            </button>
          </form>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button style={S.resetBtn} onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError(""); }}>
              {authMode === "login" ? "No account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── GENERATING ──
  const GEN_STEPS = ["Writing your script...", "Creating your voice...", "Mixing your audio..."];
  if (generating) return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo />
        <div style={S.card}>
          <div style={S.genWrap}>
            <PulseRing />
            <div style={S.genTitle}>Creating your session</div>
            <div style={S.genSub}>Personalizing for {form.name || "you"}</div>
            <div style={{ marginTop: "2rem", textAlign: "left", display: "inline-block" }}>
              {GEN_STEPS.map((label, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  marginBottom: "0.75rem",
                  opacity: i <= genStep ? 1 : 0.25,
                  transition: "opacity 0.5s ease",
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: i < genStep ? "none" : "1.5px solid rgba(168,216,200,0.4)",
                    background: i < genStep ? "#a8d8c8" : "transparent",
                    fontSize: 11, color: "#07091a",
                    transition: "all 0.4s ease",
                  }}>
                    {i < genStep ? "✓" : ""}
                  </div>
                  <span style={{
                    fontSize: "0.9rem",
                    color: i === genStep ? "#e8e6f0" : i < genStep ? "#a8d8c8" : "#8a879e",
                    transition: "color 0.4s ease",
                  }}>
                    {label}
                    {i === genStep && <span style={{ color: "#a8d8c8", marginLeft: 2 }}>●</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── RESULT ──
  if (view === "result" && result) {
    const tags = [form.program, form.voice, form.background].filter(Boolean);
    return (
      <div style={S.root}>
        <StarField />
        <div style={S.wrap}>
          <Logo />
          <div style={S.card}>
            <div style={{ fontSize: "1.5rem", fontWeight: 300, marginBottom: "0.4rem" }}>
              Your session is ready{form.name ? `, ${form.name}` : ""}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#8a879e", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Personalized {form.program} · {form.voice}
            </div>
            <div style={S.tagRow}>{tags.map((t) => <div key={t} style={S.tag}>{t}</div>)}</div>
            {result.audioUrl
              ? <><audio controls style={S.audio} src={result.audioUrl} /><div style={S.audioNote}>Your personalized audio session</div></>
              : <div style={S.infoBox}>{result.audioUnavailable ? "Audio is temporarily unavailable — your personalized script is ready below." : "Your personalized script is ready below."}</div>
            }
            <div style={S.scriptBox}>{result.script}</div>
            <div style={S.row}>
              <button style={S.btn} onClick={() => setView("home")}>Home</button>
              <button style={S.btnPrimary} onClick={generate}>✦ Regenerate</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── SESSIONS LIST ──
  if (view === "sessions") return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo />
        <div style={S.card}>
          <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "1.25rem" }}>My Sessions</div>
          {sessionsLoading && <div style={{ color: "#8a879e", textAlign: "center", padding: "2rem 0" }}>Loading...</div>}
          {!sessionsLoading && sessions.length === 0 && (
            <div style={{ color: "#8a879e", textAlign: "center", padding: "2rem 0" }}>No sessions yet. Generate your first one!</div>
          )}
          {sessions.map((s) => (
            <div key={s.id} style={S.sessionItem} onClick={() => openSession(s.id)}>
              <div style={{ fontSize: "0.92rem", color: "#e8e6f0" }}>{s.title}</div>
              <div style={{ fontSize: "0.75rem", color: "#8a879e", marginTop: 3 }}>{s.program} · {s.voice}</div>
            </div>
          ))}
        </div>
        <button style={S.resetBtn} onClick={() => setView("home")}>← Back to home</button>
      </div>
    </div>
  );

  // ── SESSION DETAIL ──
  if (view === "sessionDetail" && selectedSession) return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo />
        <div style={S.card}>
          <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "0.3rem" }}>{selectedSession.title}</div>
          <div style={{ fontSize: "0.75rem", color: "#8a879e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
            {selectedSession.program} · {selectedSession.voice}
          </div>
          {selectedSession.audioUrl
            ? <><audio controls style={S.audio} src={selectedSession.audioUrl} /><div style={S.audioNote}>Your personalized audio session</div></>
            : null
          }
          <div style={S.scriptBox}>{selectedSession.script}</div>
        </div>
        <button style={S.resetBtn} onClick={() => { setSelectedSession(null); setView("sessions"); }}>← Back to sessions</button>
      </div>
    </div>
  );

  // ── HOME ──
  if (view === "home") return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo sub />
        <div style={S.card}>
          <div style={{ fontSize: "1.2rem", fontWeight: 300, marginBottom: "0.3rem" }}>
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#8a879e", marginBottom: "2rem" }}>{user?.email}</div>
          <button
            style={{ ...S.btnPrimary, width: "100%", padding: "1rem", marginBottom: "0.75rem", fontSize: "1rem" }}
            onClick={() => { setStep(0); setForm({ name: "", goal: "", program: "", voice: "", background: "" }); setError(""); setResult(null); setView("quiz"); }}
          >
            ✦ New Session
          </button>
          <button
            style={{ ...S.btn, width: "100%", padding: "1rem" }}
            onClick={() => { setView("sessions"); fetchSessions(); }}
          >
            My Sessions
          </button>
        </div>
        <button style={S.resetBtn} onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );

  // ── QUIZ ──
  const current = STEPS[step];
  const pct = (step / STEPS.length) * 100;
  return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo sub />
        <div style={S.card}>
          <div style={S.progressBar}><div style={{ ...S.progressFill, width: `${pct}%` }} /></div>
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
            <OptionList options={current.options} selected={form[current.id]} onSelect={(val) => { updateForm(current.id, val); setError(""); }} />
          )}
          <div style={S.row}>
            <button style={S.btn} onClick={goBack}>← Back</button>
            <button style={S.btnPrimary} onClick={goNext}>
              {step < STEPS.length - 1 ? "Continue →" : "Generate My Session ✦"}
            </button>
          </div>
        </div>
        {error && <div style={S.errorBox}>⚠ {error}</div>}
      </div>
    </div>
  );
}
