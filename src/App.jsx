import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const BACKEND_URL = "https://mindtranceform-backend.onrender.com";
const supabase = createClient(
  "https://rokdnyklcvbzaoodnkbs.supabase.co",
  "sb_publishable_1DNZut5Au5CFFsgwgZT_YA_bB4o2Ohn"
);

// ─── DATA ────────────────────────────────────────────────────────────────────
function getProgramOptions(plan) {
  const isPaid = plan === "premium" || plan === "pro";
  return [
    { value: "Sleep",                icon: "🌙", label: "Sleep",                sub: "Deep rest & nighttime calm" },
    { value: "Stress & Anxiety",     icon: "🌊", label: "Stress & Anxiety",     sub: "Quiet the mind, steady the body" },
    { value: "Abundance",            icon: "✨", label: "Abundance",             sub: "Expand into success & possibility" },
    { value: "Confidence",           icon: "⚡", label: "Confidence",            sub: "Step into your power",              locked: !isPaid, badge: "🔒 Premium" },
    { value: "Focus & Productivity", icon: "🎯", label: "Focus & Productivity",  sub: "Clear mind, sharp execution",       locked: !isPaid, badge: "🔒 Premium" },
    { value: "Quit Smoking",         icon: "🌿", label: "Quit Smoking",          sub: "Break free for good",               locked: !isPaid, badge: "🔒 Premium" },
    { value: "Weight Loss Mindset",  icon: "🦋", label: "Weight Loss Mindset",   sub: "Reshape how you see yourself",      locked: !isPaid, badge: "🔒 Premium" },
    { value: "Relationship Healing", icon: "💫", label: "Relationship Healing",  sub: "Open your heart, release the past", locked: !isPaid, badge: "🔒 Premium" },
    { value: "Abundance & Wealth",   icon: "💎", label: "Abundance & Wealth",    sub: "Reprogram your money mindset",      locked: !isPaid, badge: "🔒 Premium" },
  ];
}

const VOICES = [
  { value: "Female Calm",   icon: "◌", label: "Female Calm",        sub: "Warm, nurturing, soft" },
  { value: "Female Warm",   icon: "◍", label: "Female Warm",        sub: "Bright, soothing, uplifting" },
  { value: "Male Calm",     icon: "◎", label: "Male Calm",          sub: "Grounded, steady, assured" },
  { value: "Male Smooth",   icon: "◉", label: "Male Smooth",        sub: "Gentle, clear, approachable" },
  { value: "Male Deep",     icon: "●", label: "Male Deep Hypnosis", sub: "Rich, resonant, deeply immersive" },
  { value: "Male Resonant", icon: "◈", label: "Male Resonant",      sub: "Bold, commanding, hypnotic" },
];

const BACKGROUNDS = [
  { value: "432 Hz",      icon: "♫",   label: "432 Hz",      sub: "Healing resonance" },
  { value: "528 Hz",      icon: "♪",   label: "528 Hz",      sub: "Transformation & clarity" },
  { value: "Theta Waves", icon: "〜",  label: "Theta Waves",  sub: "Deep meditation state" },
  { value: "Delta Sleep", icon: "Zzz", label: "Delta Sleep",  sub: "Profound sleep induction" },
  { value: "Rain",        icon: "◦",   label: "Rain",         sub: "Gentle, grounding" },
  { value: "Ocean",       icon: "≈",   label: "Ocean",        sub: "Expansive, soothing" },
];

function getLengthOptions(plan) {
  const rank = { null: 0, undefined: 0, single: 1, premium: 2, pro: 3 }[plan] ?? 0;
  return [
    { value: "5",  icon: "◦", label: "5 minutes",  sub: "Quick reset",          locked: false },
    { value: "10", icon: "◎", label: "10 minutes", sub: "Full session",          locked: rank < 2 },
    { value: "15", icon: "●", label: "15 minutes", sub: "Deep dive",             locked: rank < 2 },
    { value: "20", icon: "◉", label: "20 minutes", sub: "Extended journey",      locked: rank < 3 },
    { value: "30", icon: "◈", label: "30 minutes", sub: "Complete immersion",    locked: rank < 3 },
  ];
}

function getStyleOptions(plan) {
  const isFree = !plan;
  return [
    { value: "Gentle Meditation", icon: "◌",   label: "Gentle Meditation", sub: "Soft, calming guidance",         locked: false },
    { value: "Deep Hypnosis",     icon: "●",   label: "Deep Hypnosis",     sub: "Profound trance induction",      locked: false },
    { value: "Affirmations Only", icon: "◎",   label: "Affirmations Only", sub: "Pure positive programming",      locked: false },
    { value: "Visualization",     icon: "◈",   label: "Visualization",     sub: "Vivid mental imagery",           locked: false },
    { value: "Sleep Induction",   icon: "Zzz", label: "Sleep Induction",   sub: "Drift into deep sleep",          locked: isFree },
    { value: "Confidence Boost",  icon: "✦",   label: "Confidence Boost",  sub: "Expand your inner power",        locked: isFree },
  ];
}

const PAID_PLANS = [
  { id: "single",  label: "Single Session", price: "$14.99", period: "",    sub: "One custom session · 5 min",        accent: "#8a879e" },
  { id: "premium", label: "Premium",        price: "$19.99", period: "/mo", sub: "Unlimited sessions · up to 15 min", accent: "#a8d8c8" },
  { id: "pro",     label: "Pro",            price: "$29.99", period: "/mo", sub: "Unlimited sessions · up to 30 min", accent: "#c9a8d8" },
];

const EMPTY_FORM = {
  name: "", goal: "", program: "", voice: "", background: "",
  length: "5", style: "", personalization: "standard",
  fears: "", motivation: "", idealLife: "",
  affirmationStyle: "", backgroundIntensity: "",
};

function buildSteps(plan) {
  const steps = [
    { id: "name",       question: "What is your name?",                        type: "input",   placeholder: "Your first name..." },
    { id: "goal",       question: "What do you want to let go of or achieve?", type: "input",   placeholder: "e.g. Release anxiety and sleep deeply..." },
    { id: "program",    question: "Choose your program",                        type: "options", options: getProgramOptions(plan), lockedAction: "payment" },
    { id: "voice",      question: "Choose your voice",                          type: "options", options: VOICES },
    { id: "background", question: "Choose your background sound",               type: "options", options: BACKGROUNDS },
    { id: "length",     question: "How long would you like your session?",      type: "options", options: getLengthOptions(plan) },
    { id: "style",      question: "Choose your session style",                  type: "options", options: getStyleOptions(plan) },
    { id: "personalization", question: "How deeply personalized should your session be?", type: "personalization", options: [
      { value: "standard", icon: "◎", label: "Standard",     sub: "Personalized to your name and goal" },
      { value: "deep",     icon: "●", label: "Deep Personal", sub: "Tailored to your inner world" },
    ]},
    { id: "affirmationStyle", question: "How would you like your affirmations?", type: "options", options: [
      { value: "I am",          icon: "◦", label: "I am...",       sub: "First person — powerful ownership" },
      { value: "You are",       icon: "◎", label: "You are...",    sub: "Second person — like a trusted guide" },
      { value: "Present tense", icon: "●", label: "Present tense", sub: "As if it's already true" },
      { value: "Future tense",  icon: "◈", label: "Future tense",  sub: "Planting seeds of what's to come" },
    ]},
    { id: "backgroundIntensity", question: "How prominent should the background sound be?", type: "options", options: [
      { value: "Subtle",    icon: "◦", label: "Subtle",    sub: "Barely there — voice is the focus" },
      { value: "Balanced",  icon: "◎", label: "Balanced",  sub: "Equal blend of voice and sound" },
      { value: "Immersive", icon: "●", label: "Immersive", sub: "Rich soundscape, deeply enveloping" },
    ]},
  ];
  const total = steps.length;
  return steps.map((s, i) => ({ ...s, label: `${i + 1} of ${total}` }));
}

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
    width: 18, height: 18, borderRadius: "50%",
    border: selected ? "none" : "1.5px solid rgba(255,255,255,0.2)",
    background: selected ? "#a8d8c8" : "transparent",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 10, color: "#07091a", flexShrink: 0,
  }),
  row: { display: "flex", gap: "0.7rem", marginTop: "1.5rem" },
  btn: {
    flex: 1, padding: "0.8rem 1rem", borderRadius: 10,
    border: "0.5px solid rgba(255,255,255,0.18)", background: "transparent",
    color: "#e8e6f0", fontFamily: "inherit", fontSize: "0.88rem",
    fontWeight: 400, cursor: "pointer", transition: "all 0.18s", letterSpacing: "0.04em",
  },
  btnPrimary: {
    flex: 1, padding: "0.8rem 1rem", borderRadius: 10,
    border: "0.5px solid #a8d8c8",
    background: "linear-gradient(135deg,rgba(168,216,200,0.2),rgba(201,168,216,0.2))",
    color: "#a8d8c8", fontFamily: "inherit", fontSize: "0.88rem",
    fontWeight: 400, cursor: "pointer", letterSpacing: "0.04em",
  },
  errorBox: {
    background: "rgba(220,80,80,0.1)", border: "0.5px solid rgba(220,80,80,0.3)",
    borderRadius: 12, padding: "1rem 1.25rem", fontSize: "0.85rem",
    color: "#e89090", marginBottom: "1rem", lineHeight: 1.6,
  },
  infoBox: {
    background: "rgba(168,216,200,0.06)", border: "0.5px solid rgba(168,216,200,0.2)",
    borderRadius: 12, padding: "1rem 1.25rem", fontSize: "0.85rem",
    color: "#8a879e", marginBottom: "1.25rem", lineHeight: 1.6,
  },
  genWrap: { textAlign: "center", padding: "2.5rem 1rem" },
  genTitle: { fontSize: "1.3rem", fontWeight: 300, marginBottom: "0.5rem", color: "#e8e6f0" },
  genSub: { fontSize: "0.75rem", color: "#8a879e", letterSpacing: "0.15em", textTransform: "uppercase" },
  scriptBox: {
    background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "1.25rem",
    fontSize: "0.88rem", lineHeight: 1.8, color: "#c8c5d8", whiteSpace: "pre-wrap",
    maxHeight: 300, overflowY: "auto", marginBottom: "1.25rem",
    border: "0.5px solid rgba(255,255,255,0.1)",
  },
  tagRow: { display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" },
  tag: {
    fontSize: "0.72rem", padding: "0.3rem 0.75rem", borderRadius: 20,
    border: "0.5px solid rgba(255,255,255,0.18)", color: "#8a879e", letterSpacing: "0.08em",
  },
  audio: { width: "100%", marginBottom: "0.75rem", accentColor: "#a8d8c8" },
  audioNote: { fontSize: "0.73rem", color: "#8a879e", textAlign: "center", marginBottom: "1.25rem" },
  sessionItem: {
    background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)",
    borderRadius: 12, padding: "0.9rem 1rem", marginBottom: "0.6rem",
    cursor: "pointer", transition: "border-color 0.18s",
  },
  resetBtn: {
    background: "none", border: "none", color: "#8a879e", fontSize: "0.8rem",
    cursor: "pointer", textDecoration: "underline", fontFamily: "inherit",
    display: "block", margin: "1.25rem auto 0",
  },
  freeTag: {
    fontSize: "0.72rem", color: "#a8d8c8", letterSpacing: "0.1em",
    textAlign: "center", marginTop: "1rem",
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

function OptionList({ options, selected, onSelect, onLockedSelect, onPreview, previewLoading, previewPlaying }) {
  return (
    <div style={S.optionsList}>
      {options.map((o) => {
        const sel = selected === o.value;
        const locked = !!o.locked;
        const hasLockedAction = locked && !!onLockedSelect;
        const isLoadingPreview = previewLoading === o.value;
        const isPlayingPreview = previewPlaying === o.value;
        return (
          <div
            key={o.value}
            style={{
              ...S.option(sel && !locked),
              opacity: locked ? 0.5 : 1,
              cursor: locked ? (hasLockedAction ? "pointer" : "not-allowed") : "pointer",
            }}
            onClick={() => {
              if (locked) { if (hasLockedAction) onLockedSelect(); }
              else onSelect(o.value);
            }}
          >
            <div style={S.optionIcon}>{o.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={S.optionLabel}>{o.label}</div>
              <div style={S.optionSub}>{o.sub}</div>
            </div>
            {onPreview && !locked && (
              <button
                onClick={(e) => { e.stopPropagation(); onPreview(o.value); }}
                style={{
                  background: isPlayingPreview ? "rgba(168,216,200,0.15)" : "none",
                  border: "0.5px solid rgba(168,216,200,0.35)",
                  borderRadius: 6, color: "#a8d8c8", fontSize: "0.78rem",
                  padding: "0.2rem 0.55rem", cursor: "pointer", flexShrink: 0,
                  marginRight: "0.5rem", fontFamily: "inherit",
                  transition: "background 0.18s",
                }}
              >
                {isLoadingPreview ? "···" : isPlayingPreview ? "■" : "▷"}
              </button>
            )}
            {locked
              ? <div style={{ fontSize: "0.68rem", color: "#c9a8d8", border: "0.5px solid #c9a8d8", borderRadius: 6, padding: "0.15rem 0.45rem", flexShrink: 0, letterSpacing: "0.04em" }}>{o.badge || "🔒 Upgrade"}</div>
              : <div style={S.check(sel)}>{sel ? "✓" : ""}</div>
            }
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

  // Plan & usage (localStorage)
  const [plan, setPlan]               = useState(() => localStorage.getItem("mt_plan"));
  const [sessionsUsed, setSessionsUsed] = useState(() => parseInt(localStorage.getItem("mt_sessions_used") || "0"));

  // Auth form
  const [authMode, setAuthMode]         = useState("login");
  const [authEmail, setAuthEmail]       = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError]       = useState("");
  const [authBusy, setAuthBusy]         = useState(false);
  const [authForgot, setAuthForgot]     = useState(false);

  // Safety
  const [safetyAccepted, setSafetyAccepted] = useState(() => !!localStorage.getItem("mt_safety_accepted"));
  const [safetyChecked, setSafetyChecked]   = useState(false);
  const [safetyReturn, setSafetyReturn]     = useState("home"); // "generate" | "home"

  // Quiz
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [error, setError]   = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [genStep, setGenStep] = useState(0);

  // Voice preview
  const previewAudioRef                         = useRef(null);
  const [previewLoading, setPreviewLoading]     = useState(null);
  const [previewPlaying, setPreviewPlaying]     = useState(null);

  // Sessions
  const [sessions, setSessions]               = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // Account / subscription
  const [welcomeMsg, setWelcomeMsg]       = useState("");
  const [subStatus, setSubStatus]         = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelling, setCancelling]       = useState(false);

  // PWA install prompt
  const [deferredInstall, setDeferredInstall] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Dynamic steps based on plan
  const steps = buildSteps(plan);

  // Capture PWA install prompt
  useEffect(() => {
    const handler = e => { e.preventDefault(); setDeferredInstall(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Inject keyframe animations
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

  // Progress steps timer
  useEffect(() => {
    if (!generating) { setGenStep(0); return; }
    const t1 = setTimeout(() => setGenStep(1), 3500);
    const t2 = setTimeout(() => setGenStep(2), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [generating]);

  // Auth state + Stripe return handling
  useEffect(() => {
    // Handle Stripe success redirect
    const params = new URLSearchParams(window.location.search);
    const isPaymentSuccess = params.get("payment") === "success";
    if (isPaymentSuccess) {
      const newPlan = params.get("plan");
      if (newPlan) {
        localStorage.setItem("mt_plan", newPlan);
        setPlan(newPlan);
        const planLabel = { single: "Single Session", premium: "Premium", pro: "Pro" }[newPlan] || newPlan;
        setWelcomeMsg(`Welcome to Mind Tranceform ${planLabel}. Your personalized sessions are ready.`);
      }
      window.history.replaceState({}, "", window.location.pathname);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      // After payment, show safety screen if not yet accepted
      if (isPaymentSuccess && session?.user && !localStorage.getItem("mt_safety_accepted")) {
        setSafetyReturn("home");
        setView("safety");
      } else {
        setView(session?.user ? "home" : "auth");
      }
      setAuthReady(true);
      if (isPaymentSuccess && session?.user) {
        fetch(`${BACKEND_URL}/user/subscribe`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
        }).catch(() => {});
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setView(u ? "home" : "auth");
      if (u) {
        localStorage.setItem("mt_user_id", u.id);
        if (u.email) localStorage.setItem("mt_user_email", u.email);
        // Only register named accounts — skip anonymous guests
        if (u.email) {
          fetch(`${BACKEND_URL}/user/register`, {
            method: "POST",
            headers: { Authorization: `Bearer ${session.access_token}` },
          }).catch(() => {});
        }
      } else {
        localStorage.removeItem("mt_user_id");
        localStorage.removeItem("mt_user_email");
      }
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

  async function handleForgotPassword() {
    if (!authEmail.trim()) { setAuthError("Enter your email above first."); return; }
    setAuthBusy(true);
    setAuthError("");
    const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
      redirectTo: window.location.origin,
    });
    if (error) setAuthError(error.message);
    else setAuthError("Check your email for a password reset link.");
    setAuthBusy(false);
  }

  async function handleGuestLogin() {
    setAuthBusy(true);
    setAuthError("");
    const { error } = await supabase.auth.signInAnonymously();
    if (error) setAuthError("Guest access unavailable — please create a free account.");
    setAuthBusy(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem("mt_user_id");
    localStorage.removeItem("mt_user_email");
    setStep(0);
    setForm(EMPTY_FORM);
    setResult(null);
    setSessions([]);
    setSelectedSession(null);
  }

  function acceptSafety() {
    localStorage.setItem("mt_safety_accepted", "1");
    setSafetyAccepted(true);
    setSafetyChecked(false);
    if (safetyReturn === "generate") generate();
    else setView("home");
  }

  async function startCheckout(planId) {
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: planId, email: user?.email }),
      });
      const data = await res.json();
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } catch (e) {
      console.error("Checkout error:", e);
    }
  }

  async function fetchSessions() {
    setSessionsLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/sessions`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {}
    setSessionsLoading(false);
  }

  async function openSession(id) {
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/sessions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.session) {
        setSelectedSession({
          ...data.session,
          audioUrl: data.session.audioBase64 ? `data:audio/mpeg;base64,${data.session.audioBase64}` : null,
        });
        setView("sessionDetail");
      }
    } catch {}
  }

  async function fetchSubStatus() {
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/subscription-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setSubStatus(data);
    } catch {}
  }

  async function cancelSubscription() {
    setCancelling(true);
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/cancel-subscription`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSubStatus((s) => ({ ...s, status: "cancelling" }));
        setCancelConfirm(false);
      }
    } catch {}
    setCancelling(false);
  }

  function updateForm(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  async function previewVoice(voiceName) {
    // Stop and clean up any current preview
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
      if (previewPlaying === voiceName) { setPreviewPlaying(null); return; } // toggle off
      setPreviewPlaying(null);
    }
    setPreviewLoading(voiceName);
    try {
      const res = await fetch(`${BACKEND_URL}/preview-voice/${encodeURIComponent(voiceName)}`);
      if (!res.ok) throw new Error("Preview failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => { setPreviewPlaying(null); URL.revokeObjectURL(url); previewAudioRef.current = null; };
      previewAudioRef.current = audio;
      audio.play();
      setPreviewPlaying(voiceName);
    } catch (err) {
      console.error("Voice preview failed:", err);
    }
    setPreviewLoading(null);
  }

  async function generate() {
    // Free session limit: null plan = free tier, 1 session lifetime
    if (!plan && sessionsUsed >= 1) {
      setView("payment");
      return;
    }
    // Safety disclaimer must be accepted before first generation
    if (!safetyAccepted) {
      setSafetyReturn("generate");
      setView("safety");
      return;
    }

    setGenerating(true);
    setError("");
    try {
      const token = await getToken();
      const response = await fetch(`${BACKEND_URL}/generate-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          goal: form.goal,
          program: form.program,
          voice: form.voice,
          background: form.background,
          length: form.length,
          style: form.style,
          personalization: form.personalization,
          fears: form.fears,
          motivation: form.motivation,
          idealLife: form.idealLife,
          affirmationStyle: form.affirmationStyle,
          backgroundIntensity: form.backgroundIntensity,
        }),
      });
      const data = await response.json();
      if (data.script) {
        // Increment usage counter
        const newUsed = sessionsUsed + 1;
        localStorage.setItem("mt_sessions_used", String(newUsed));
        setSessionsUsed(newUsed);
        const audioUrl = data.audioBase64 ? `data:audio/mpeg;base64,${data.audioBase64}` : null;
        setResult({ script: data.script, audioUrl, audioUnavailable: data.audioUnavailable || !data.audioBase64 });
        setView("result");
        // Show install prompt after first session
        if (newUsed === 1) setShowInstallBanner(true);
        return;
      }
      throw new Error(typeof data.error === "string" ? data.error : "Generation failed. Please try again.");
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
      setView("genError");
    } finally {
      setGenerating(false);
    }
  }

  function goNext() {
    const s = steps[step];
    if (s.type === "input") {
      if (!form[s.id].trim()) { setError("Please fill this in to continue."); return; }
    } else if (s.type === "personalization") {
      if (!form[s.id]) { setError("Please choose an option."); return; }
      if (form.personalization === "deep") {
        if (!form.fears.trim() || !form.motivation.trim() || !form.idealLife.trim()) {
          setError("Please fill in all three fields to continue."); return;
        }
      }
    } else {
      if (!form[s.id]) { setError("Please choose an option."); return; }
    }
    setError("");
    if (step < steps.length - 1) setStep((p) => p + 1);
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
          {authForgot ? (
            <>
              <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "0.4rem", textAlign: "center" }}>Reset password</div>
              <div style={{ fontSize: "0.8rem", color: "#8a879e", textAlign: "center", marginBottom: "1.5rem" }}>
                Enter your email and we'll send a reset link
              </div>
              {authError && (
                <div style={authError.includes("Check your email") || authError.includes("reset link") ? S.infoBox : S.errorBox}>{authError}</div>
              )}
              <input style={{ ...S.input, marginBottom: "1rem" }} type="email" placeholder="Email"
                value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} autoFocus />
              <button style={{ ...S.btnPrimary, width: "100%", marginBottom: "0.75rem" }}
                onClick={handleForgotPassword} disabled={authBusy}>
                {authBusy ? "..." : "Send Reset Email"}
              </button>
              <div style={{ textAlign: "center" }}>
                <button style={S.resetBtn} onClick={() => { setAuthForgot(false); setAuthError(""); }}>← Back to sign in</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "1.5rem", textAlign: "center" }}>
                {authMode === "login" ? "Welcome back" : "Create your account"}
              </div>
              {authError && (
                <div style={authError.includes("Check your email") ? S.infoBox : S.errorBox}>{authError}</div>
              )}
              <form onSubmit={handleAuth}>
                <input style={{ ...S.input, marginBottom: "0.75rem" }} type="email" placeholder="Email"
                  value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required autoFocus />
                <input style={{ ...S.input, marginBottom: authMode === "login" ? "0.4rem" : "1.25rem" }}
                  type="password" placeholder="Password (min 6 characters)"
                  value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
                {authMode === "login" && (
                  <div style={{ textAlign: "right", marginBottom: "1.25rem" }}>
                    <button type="button" style={{ ...S.resetBtn, fontSize: "0.78rem" }}
                      onClick={() => { setAuthForgot(true); setAuthError(""); }}>
                      Forgot password?
                    </button>
                  </div>
                )}
                <button style={{ ...S.btnPrimary, width: "100%" }} type="submit" disabled={authBusy}>
                  {authBusy ? "..." : authMode === "login" ? "Sign In" : "Create Account"}
                </button>
              </form>
              <div style={S.freeTag}>✦ Your first session is free. No card needed.</div>
              <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
                <button style={S.resetBtn} onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError(""); }}>
                  {authMode === "login" ? "No account? Sign up free" : "Already have an account? Sign in"}
                </button>
              </div>
              <div style={{ height: "0.5px", background: "rgba(255,255,255,0.07)", margin: "1.25rem 0" }} />
              <div style={{ textAlign: "center" }}>
                <button style={{ ...S.resetBtn, color: "#8a879e" }} onClick={handleGuestLogin} disabled={authBusy}>
                  Continue as guest
                </button>
                <div style={{ fontSize: "0.7rem", color: "#8a879e", marginTop: "0.35rem", opacity: 0.7 }}>
                  1 free session · no account needed
                </div>
              </div>
            </>
          )}
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
                    fontSize: 11, color: "#07091a", transition: "all 0.4s ease",
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
            {result.audioUrl && (
              !plan ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginTop: "0.75rem", fontSize: "0.82rem", color: "#8a879e" }}>
                  <span>🔒</span><span>Upgrade to Premium to download your sessions</span>
                </div>
              ) : (
                <div style={{ ...S.row, marginTop: "0.5rem" }}>
                  <button style={S.btn} onClick={() => {
                    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                    const d = new Date();
                    const a = document.createElement("a");
                    a.href = result.audioUrl;
                    a.download = `MindTranceform-${form.program || "Session"}-${months[d.getMonth()]}-${d.getDate()}-${d.getFullYear()}.mp3`;
                    a.click();
                  }}>↓ Download MP3</button>
                  {plan === "pro" && (
                    <button style={S.btn} onClick={() => navigator.clipboard.writeText("I just created a personalized meditation with Mind Tranceform — try it free at mindtranceform.com")}>Share</button>
                  )}
                </div>
              )
            )}
            <div style={{ ...S.row, marginTop: "0.5rem" }}>
              <button style={S.btn} onClick={() => {
                const blob = new Blob([result.script], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${form.program || "session"} — script.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}>↓ Download Script</button>
            </div>
            {showInstallBanner && (
              <div style={{ ...S.infoBox, marginTop: "1.25rem", borderColor: "rgba(168,216,200,0.25)" }}>
                <div style={{ fontSize: "0.88rem", color: "#e8e6f0", marginBottom: "0.25rem" }}>
                  Add Mind Tranceform to your home screen
                </div>
                <div style={{ fontSize: "0.75rem", color: "#8a879e", marginBottom: "0.85rem" }}>
                  {deferredInstall
                    ? "Install for easy access — opens instantly, no browser needed."
                    : "Tap your browser menu and select \"Add to Home Screen\" for instant access."}
                </div>
                <div style={S.row}>
                  <button style={S.btn} onClick={() => setShowInstallBanner(false)}>Dismiss</button>
                  {deferredInstall && (
                    <button style={S.btnPrimary} onClick={() => {
                      deferredInstall.prompt();
                      deferredInstall.userChoice.then(() => {
                        setDeferredInstall(null);
                        setShowInstallBanner(false);
                      });
                    }}>Install App ✦</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── PAYMENT / UPGRADE ──
  if (view === "payment") return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo />
        <div style={S.card}>
          <div style={{ fontSize: "1.4rem", fontWeight: 300, marginBottom: "0.5rem" }}>
            You've used your free session
          </div>
          <div style={{ fontSize: "0.88rem", color: "#8a879e", lineHeight: 1.7, marginBottom: "0.5rem" }}>
            Upgrade to generate unlimited personalized sessions.
          </div>
          <div style={S.freeTag}>✦ Your first session is free. No card needed.</div>
          <div style={{ height: "1.5rem" }} />
          {PAID_PLANS.map((p) => (
            <div key={p.id} style={{ ...S.sessionItem, padding: "1.1rem 1.25rem", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.3rem" }}>
                <div style={{ fontSize: "1rem", color: "#e8e6f0" }}>{p.label}</div>
                <div style={{ fontSize: "1.05rem", color: p.accent }}>
                  {p.price}<span style={{ fontSize: "0.72rem", color: "#8a879e" }}>{p.period}</span>
                </div>
              </div>
              <div style={{ fontSize: "0.78rem", color: "#8a879e", marginBottom: "0.85rem" }}>{p.sub}</div>
              <button
                style={{ ...S.btnPrimary, width: "100%", borderColor: p.accent, color: p.accent }}
                onClick={() => startCheckout(p.id)}
              >
                Choose {p.label} →
              </button>
            </div>
          ))}
        </div>
        <button style={S.resetBtn} onClick={() => setView("home")}>← Back to home</button>
      </div>
    </div>
  );

  // ── SAFETY DISCLAIMER ──
  if (view === "safety") {
    const sec = (title, items, color = "#c8c5d8") => (
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8a879e", marginBottom: "0.6rem" }}>{title}</div>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.4rem", alignItems: "flex-start" }}>
            <span style={{ color: "#a8d8c8", flexShrink: 0, marginTop: "0.05rem" }}>◦</span>
            <span style={{ fontSize: "0.88rem", color, lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>
    );
    return (
      <div style={S.root}>
        <StarField />
        <div style={S.wrap}>
          <Logo />
          <div style={S.card}>
            <div style={{ fontSize: "1.6rem", fontWeight: 300, marginBottom: "0.4rem" }}>Before You Listen</div>
            <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", margin: "1rem 0 1.5rem" }} />

            {sec("Best times to listen", [
              "Before sleep — lying in bed with eyes closed",
              "Morning — before getting out of bed",
              "During meditation — seated comfortably in a quiet space",
              "During rest — lying down on a couch or mat",
              "During a break — somewhere quiet with no distractions",
            ])}

            {sec("For best results", [
              "Use headphones or earbuds for the most immersive experience",
              "Find a quiet space where you will not be interrupted",
              "Close your eyes during the session",
              "Listen at a comfortable volume",
              "Give yourself time to return to full alertness afterward before resuming activity",
              "Listen consistently — daily use produces the best results over time",
            ])}

            {sec("Do not listen while", [
              "Driving or operating any vehicle",
              "Operating machinery or equipment",
              "Caring for children or others who depend on you",
              "In any situation where you need to remain fully alert",
              "Standing or walking",
            ], "#e89090")}

            <div style={{ ...S.infoBox, marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8a879e", marginBottom: "0.5rem" }}>Important notice</div>
              Mind Tranceform is designed for relaxation, personal development, and wellness purposes only. It is not medical, psychological, or therapeutic treatment and is not a substitute for professional care. If you have a medical or mental health condition, consult your doctor before use. Do not use as a replacement for prescribed treatment or medication.
            </div>

            {/* Checkbox */}
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", marginBottom: "1.5rem" }}
              onClick={() => setSafetyChecked((v) => !v)}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 2,
                border: safetyChecked ? "none" : "1.5px solid rgba(168,216,200,0.4)",
                background: safetyChecked ? "#a8d8c8" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: "#07091a", transition: "all 0.2s",
              }}>
                {safetyChecked ? "✓" : ""}
              </div>
              <span style={{ fontSize: "0.88rem", color: "#c8c5d8", lineHeight: 1.6 }}>
                I understand and agree to use Mind Tranceform safely
              </span>
            </div>

            <button
              style={{ ...S.btnPrimary, width: "100%", opacity: safetyChecked ? 1 : 0.4, cursor: safetyChecked ? "pointer" : "not-allowed" }}
              onClick={() => safetyChecked && acceptSafety()}
            >
              {safetyReturn === "generate" ? "Continue to My Session ✦" : "Got It"}
            </button>
          </div>
          {safetyReturn === "home" && (
            <button style={S.resetBtn} onClick={() => setView("home")}>← Back to home</button>
          )}
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
          {selectedSession.audioUrl &&
            <><audio controls style={S.audio} src={selectedSession.audioUrl} /><div style={S.audioNote}>Your personalized audio session</div></>
          }
          <div style={S.scriptBox}>{selectedSession.script}</div>
          {selectedSession.audioUrl && (
            !plan ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginBottom: "0.5rem", fontSize: "0.82rem", color: "#8a879e" }}>
                <span>🔒</span><span>Upgrade to Premium to download your sessions</span>
              </div>
            ) : (
              <div style={{ ...S.row, marginBottom: "0.5rem" }}>
                <button style={S.btn} onClick={() => {
                  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                  const d = new Date();
                  const a = document.createElement("a");
                  a.href = selectedSession.audioUrl;
                  a.download = `MindTranceform-${selectedSession.program || "Session"}-${months[d.getMonth()]}-${d.getDate()}-${d.getFullYear()}.mp3`;
                  a.click();
                }}>↓ Download MP3</button>
                {plan === "pro" && (
                  <button style={S.btn} onClick={() => navigator.clipboard.writeText("I just created a personalized meditation with Mind Tranceform — try it free at mindtranceform.com")}>Share</button>
                )}
              </div>
            )
          )}
          <div style={S.row}>
            <button style={S.btn} onClick={() => {
              const blob = new Blob([selectedSession.script], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${selectedSession.title || "session"} — script.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}>↓ Download Script</button>
          </div>
        </div>
        <button style={S.resetBtn} onClick={() => { setSelectedSession(null); setView("sessions"); }}>← Back to sessions</button>
      </div>
    </div>
  );

  // ── GENERATION ERROR ──
  if (view === "genError") return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo />
        <div style={S.card}>
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "0.75rem" }}>Something went wrong</div>
            <div style={{ fontSize: "0.85rem", color: "#8a879e", lineHeight: 1.7, marginBottom: "2rem" }}>{error}</div>
            <div style={S.row}>
              <button style={S.btn} onClick={() => setView("home")}>Home</button>
              <button style={S.btnPrimary} onClick={generate}>Try Again ✦</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── ACCOUNT ──
  if (view === "account") {
    const planMeta = {
      single:  { label: "Single Session", price: "$14.99",       period: "one-time", accent: "#8a879e" },
      premium: { label: "Premium",         price: "$19.99/mo",    period: "monthly",  accent: "#a8d8c8" },
      pro:     { label: "Pro",             price: "$29.99/mo",    period: "monthly",  accent: "#c9a8d8" },
    };
    const current = plan ? planMeta[plan] : null;
    const isCancelling = subStatus?.status === "cancelling";
    const isPastDue    = subStatus?.status === "past_due";
    const nextDate = subStatus?.nextBillingDate
      ? new Date(subStatus.nextBillingDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : null;
    const canCancel = (plan === "premium" || plan === "pro") && !isCancelling;

    return (
      <div style={S.root}>
        <StarField />
        <div style={S.wrap}>
          <Logo />
          <div style={S.card}>
            <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "1.5rem" }}>Account</div>

            {/* Email */}
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8a879e", marginBottom: "0.3rem" }}>Email</div>
            <div style={{ fontSize: "0.92rem", color: "#e8e6f0", marginBottom: "1.5rem" }}>{user?.email}</div>

            {/* Plan */}
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8a879e", marginBottom: "0.3rem" }}>Plan</div>
            {current ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.3rem" }}>
                <div style={{ fontSize: "1rem", color: current.accent }}>{current.label}</div>
                <div style={{ fontSize: "0.85rem", color: "#8a879e" }}>{current.price}</div>
              </div>
            ) : (
              <div style={{ fontSize: "0.92rem", color: "#8a879e", marginBottom: "0.3rem" }}>Free</div>
            )}

            {isCancelling && (
              <div style={{ fontSize: "0.78rem", color: "#e8a87c", marginBottom: "0.5rem" }}>
                Cancels at end of billing period{nextDate ? ` — ${nextDate}` : ""}
              </div>
            )}
            {isPastDue && (
              <div style={{ fontSize: "0.78rem", color: "#e87c7c", marginBottom: "0.5rem" }}>
                Payment failed — please update your payment method
              </div>
            )}

            {/* Next billing */}
            {nextDate && !isCancelling && (
              <>
                <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8a879e", marginTop: "1.25rem", marginBottom: "0.3rem" }}>Next billing date</div>
                <div style={{ fontSize: "0.92rem", color: "#e8e6f0", marginBottom: "1.25rem" }}>{nextDate}</div>
              </>
            )}

            <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", margin: "1.25rem 0" }} />

            {/* Upgrade button */}
            {(!plan || plan === "single") && (
              <button
                style={{ ...S.btnPrimary, width: "100%", marginBottom: "0.75rem" }}
                onClick={() => setView("payment")}
              >
                Upgrade Plan →
              </button>
            )}

            {/* Cancel */}
            {canCancel && !cancelConfirm && (
              <button
                style={{ ...S.btn, width: "100%", color: "#8a879e", borderColor: "rgba(255,255,255,0.08)" }}
                onClick={() => setCancelConfirm(true)}
              >
                Cancel Subscription
              </button>
            )}

            {/* Cancel confirmation */}
            {cancelConfirm && (
              <div style={{ ...S.infoBox, borderColor: "rgba(232,135,100,0.3)", marginTop: "0.5rem" }}>
                <div style={{ fontSize: "0.88rem", color: "#e8e6f0", marginBottom: "1rem", lineHeight: 1.6 }}>
                  Are you sure? You will lose access to premium sessions at the end of your billing period.
                </div>
                <div style={S.row}>
                  <button style={S.btn} onClick={() => setCancelConfirm(false)}>Keep Plan</button>
                  <button
                    style={{ ...S.btn, color: "#e87c7c", borderColor: "rgba(232,124,124,0.35)" }}
                    onClick={cancelSubscription}
                    disabled={cancelling}
                  >
                    {cancelling ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                </div>
              </div>
            )}
          </div>
          <button style={S.resetBtn} onClick={() => setView("home")}>← Back to home</button>
        </div>
      </div>
    );
  }

  // ── HOME ──
  if (view === "home") return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo sub />
        <div style={S.card}>
          {user?.is_anonymous && (
            <div style={{ ...S.infoBox, marginBottom: "1.25rem", textAlign: "center", borderColor: "rgba(201,168,216,0.3)" }}>
              <div style={{ fontSize: "0.82rem", color: "#c9a8d8", marginBottom: "0.5rem" }}>You're in guest mode</div>
              <div style={{ fontSize: "0.75rem", color: "#8a879e", marginBottom: "0.75rem" }}>Create a free account to save sessions and access your library</div>
              <button style={{ ...S.btnPrimary, padding: "0.4rem 1.25rem", fontSize: "0.82rem", borderColor: "#c9a8d8", color: "#c9a8d8" }}
                onClick={() => { supabase.auth.signOut(); }}>
                Create Account →
              </button>
            </div>
          )}
          {welcomeMsg && (
            <div style={{ ...S.infoBox, marginBottom: "1.25rem", textAlign: "center", color: "#a8d8c8" }}>
              ✦ {welcomeMsg}
            </div>
          )}
          <div style={{ fontSize: "1.2rem", fontWeight: 300, marginBottom: "0.3rem" }}>
            {user?.is_anonymous ? "Guest Session" : `Welcome back${user?.email ? `, ${user.email.split("@")[0]}` : ""}`}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#8a879e", marginBottom: "2rem" }}>{user?.email || ""}</div>
          <button
            style={{ ...S.btnPrimary, width: "100%", padding: "1rem", marginBottom: "0.75rem", fontSize: "1rem" }}
            onClick={() => { setStep(0); setForm(EMPTY_FORM); setError(""); setResult(null); setView("quiz"); setWelcomeMsg(""); }}
          >
            ✦ New Session
          </button>
          <button style={{ ...S.btn, width: "100%", padding: "1rem", marginBottom: "0.75rem" }} onClick={() => { setView("sessions"); fetchSessions(); }}>
            My Sessions
          </button>
          <button style={{ ...S.btn, width: "100%", padding: "1rem" }} onClick={() => { setView("account"); fetchSubStatus(); setCancelConfirm(false); }}>
            Account
          </button>
          {!plan && sessionsUsed === 0 && (
            <div style={S.freeTag}>✦ Your first session is free. No card needed.</div>
          )}
          {!plan && sessionsUsed >= 1 && (
            <div style={{ ...S.freeTag, color: "#8a879e", marginTop: "1rem" }}>
              Free session used —{" "}
              <span style={{ color: "#a8d8c8", cursor: "pointer", textDecoration: "underline" }} onClick={() => setView("payment")}>
                upgrade to continue
              </span>
            </div>
          )}
          {plan && (
            <div style={{ ...S.freeTag, color: "#8a879e", marginTop: "1rem", textTransform: "capitalize" }}>
              Plan: <span
                style={{ color: "#a8d8c8", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => { setView("account"); fetchSubStatus(); setCancelConfirm(false); }}
              >{plan}</span>
            </div>
          )}
        </div>
        <button style={S.resetBtn} onClick={() => { setSafetyReturn("home"); setView("safety"); }}>How to use</button>
        <button style={S.resetBtn} onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );

  // ── QUIZ ──
  const current = steps[step];
  const pct = (step / steps.length) * 100;
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
          ) : current.type === "personalization" ? (
            <>
              <OptionList options={current.options} selected={form[current.id]} onSelect={(val) => { updateForm(current.id, val); setError(""); }} />
              {form.personalization === "deep" && (
                <div style={{ marginTop: "1.25rem", display: "grid", gap: "0.6rem" }}>
                  <input style={S.input} type="text" placeholder="What are you afraid of or holding onto?" value={form.fears}
                    onChange={(e) => { updateForm("fears", e.target.value); setError(""); }} />
                  <input style={S.input} type="text" placeholder="What truly motivates you?" value={form.motivation}
                    onChange={(e) => { updateForm("motivation", e.target.value); setError(""); }} />
                  <input style={S.input} type="text" placeholder="Describe your ideal life in one sentence" value={form.idealLife}
                    onChange={(e) => { updateForm("idealLife", e.target.value); setError(""); }} />
                </div>
              )}
            </>
          ) : (
            <OptionList
              options={current.options}
              selected={form[current.id]}
              onSelect={(val) => { updateForm(current.id, val); setError(""); }}
              onLockedSelect={current.lockedAction === "payment" ? () => setView("payment") : undefined}
              onPreview={current.id === "voice" ? previewVoice : undefined}
              previewLoading={previewLoading}
              previewPlaying={previewPlaying}
            />
          )}
          <div style={S.row}>
            <button style={S.btn} onClick={goBack}>← Back</button>
            <button style={S.btnPrimary} onClick={goNext}>
              {step < steps.length - 1 ? "Continue →" : "Generate My Session ✦"}
            </button>
          </div>
        </div>
        {error && <div style={S.errorBox}>⚠ {error}</div>}
      </div>
    </div>
  );
}
