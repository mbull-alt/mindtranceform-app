import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { TermsPage } from "./TermsPage.jsx";
import { PrivacyPage } from "./PrivacyPage.jsx";
import { CookiesPage } from "./CookiesPage.jsx";
import { PrivacyDataPage } from "./PrivacyDataPage.jsx";

const BACKEND_URL = "https://mindtranceform-backend.onrender.com";
const supabase = createClient(
  "https://rokdnyklcvbzaoodnkbs.supabase.co",
  "sb_publishable_1DNZut5Au5CFFsgwgZT_YA_bB4o2Ohn"
);

// ─── DATA ────────────────────────────────────────────────────────────────────
function getProgramOptions(plan, isAdmin) {
  const isPaid = isAdmin || plan === "premium" || plan === "pro";
  return [
    { value: "Sleep",                icon: "🌙", label: "Sleep",                sub: "Deep rest & nighttime calm" },
    { value: "Stress & Anxiety",     icon: "🌊", label: "Stress & Anxiety",     sub: "Quiet the mind, steady the body" },
    { value: "Abundance",            icon: "✨", label: "Abundance",             sub: "Expand into success & possibility" },
    { value: "Confidence",           icon: "⚡", label: "Confidence",            sub: "Step into your power",              locked: !isPaid, badge: "🔒 Premium" },
    { value: "Focus & Productivity", icon: "🎯", label: "Focus & Productivity",  sub: "Clear mind, sharp execution",       locked: !isPaid, badge: "🔒 Premium" },
    { value: "Quit Smoking",         icon: "🌿", label: "Quit Smoking",          sub: "Break free for good",               locked: !isPaid, badge: "🔒 Premium" },
    { value: "Weight Loss Mindset",  icon: "🦋", label: "Weight Loss Mindset",   sub: "Reshape how you see yourself" },
    { value: "Relationship Healing", icon: "💫", label: "Relationship Healing",  sub: "Open your heart, release the past", locked: !isPaid, badge: "🔒 Premium" },
    { value: "Abundance & Wealth",   icon: "💎", label: "Abundance & Wealth",    sub: "Reprogram your money mindset",      locked: !isPaid, badge: "🔒 Premium" },
  ];
}

const VOICES = [
  { value: "Female Calm",        icon: "◌", label: "Female Calm",        sub: "Warm, nurturing, soft — ideal for daily meditation" },
  { value: "Female Warm",        icon: "◍", label: "Female Warm",        sub: "Bright, soothing, uplifting — great for affirmations" },
  { value: "Female Whisper",     icon: "◦", label: "Female Whisper",     sub: "Very soft and breathy — perfect for sleep sessions" },
  { value: "Female British",     icon: "◉", label: "Female British",     sub: "Calm British accent — clear, composed, reassuring" },
  { value: "Male Calm",          icon: "◎", label: "Male Calm",          sub: "Grounded, steady, assured — neutral and trustworthy" },
  { value: "Male Deep Hypnosis", icon: "●", label: "Male Deep Hypnosis", sub: "Rich, resonant, deeply immersive — ideal for trance" },
  { value: "Male Warm",          icon: "◈", label: "Male Warm",          sub: "Friendly, approachable, clear — great for motivation" },
  { value: "Male British",       icon: "◇", label: "Male British",       sub: "Calm British accent — smooth, measured, authoritative" },
];

const BACKGROUNDS = [
  { value: "432 Hz",      icon: "♫",   label: "432 Hz",      sub: "Healing resonance" },
  { value: "528 Hz",      icon: "♪",   label: "528 Hz",      sub: "Transformation & clarity" },
  { value: "Theta Waves", icon: "〜",  label: "Theta Waves",  sub: "Deep meditation state · Use headphones" },
  { value: "Delta Sleep", icon: "Zzz", label: "Delta Sleep",  sub: "Profound sleep induction · Use headphones" },
  { value: "Rain",        icon: "◦",   label: "Rain",         sub: "Gentle, grounding" },
  { value: "Ocean",       icon: "≈",   label: "Ocean",        sub: "Expansive, soothing" },
];

function getLengthOptions(plan, isAdmin) {
  const rank = isAdmin ? 3 : ({ null: 0, undefined: 0, single: 1, premium: 2, pro: 3 }[plan] ?? 0);
  return [
    { value: "5",  icon: "◦", label: "5 minutes",  sub: "Quick reset",          locked: false },
    { value: "10", icon: "◎", label: "10 minutes", sub: "Full session",          locked: rank < 2, badge: "🔒 Premium" },
    { value: "15", icon: "●", label: "15 minutes", sub: "Deep dive",             locked: rank < 2, badge: "🔒 Premium" },
    { value: "20", icon: "◉", label: "20 minutes", sub: "Extended journey",      locked: rank < 3, badge: "🔒 Pro" },
    { value: "30", icon: "◈", label: "30 minutes", sub: "Complete immersion",    locked: rank < 3, badge: "🔒 Pro" },
  ];
}

function getStyleOptions(plan, isAdmin) {
  const isFree = !isAdmin && !plan;
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

const TECHNIQUE_TOOLTIPS = {
  "Progressive muscle relaxation": "Progressive muscle relaxation guides you through tensing and releasing each muscle group in sequence, signaling your nervous system that it's safe to let go. It's particularly effective for physical tension and sleep onset.",
  "Body scan": "A body scan gently moves awareness through each part of the body in sequence, releasing stored tension and bringing you into full presence. It's highly effective for anxiety, grounding, and preparing for sleep.",
  "Guided visualization": "Guided visualization leads you through a vivid mental journey — engaging all your senses to reprogram how you feel about a goal or outcome. It's especially powerful for abundance, confidence, and goal-setting.",
  "Breath-anchored awareness": "Breath-anchored awareness uses your breath as a steady anchor to quiet racing thoughts and activate the parasympathetic nervous system. It's the go-to technique for acute anxiety and panic.",
  "Hypnotic countdown induction": "A hypnotic countdown uses descending numbers paired with deepening suggestions to guide you into a receptive trance state. It's the classic induction used across most hypnotherapy programs.",
  "Positive suggestion loop": "Positive suggestion loops repeat and vary carefully chosen affirmations at the threshold of trance, where the subconscious is most receptive to new beliefs. Ideal for habit change and abundance work.",
  "EMDR-inspired bilateral": "EMDR-inspired bilateral techniques use alternating sensory cues to help process distressing memories and reduce their emotional charge. Adapted here for relaxation and trauma-informed stress reduction.",
  "Loving-kindness (metta)": "Loving-kindness meditation (metta) cultivates feelings of warmth and goodwill — starting inward and expanding outward. It's deeply effective for grief, self-esteem, and relationship healing.",
  "Cognitive defusion": "Cognitive defusion creates distance between you and your thoughts, helping you observe them without being controlled by them. It's the core technique for rumination, intrusive thoughts, and anxiety.",
  "Somatic release": "Somatic release works directly with body sensations to discharge stored stress and trauma that talking alone can't reach. It's particularly effective for physical tension, chronic stress, and PTSD.",
};

// Recommended voice per program — edit here to retune, no code search needed
const VOICE_RECOMMENDATION = {
  "Sleep":                "Female Whisper",
  "Stress & Anxiety":     "Female Calm",
  "Abundance":            "Female Warm",
  "Confidence":           "Male Warm",
  "Focus & Productivity": "Male Calm",
  "Quit Smoking":         "Male Calm",
  "Weight Loss Mindset":  "Female Warm",
  "Relationship Healing": "Female Warm",
};
const DEFAULT_VOICE_RECOMMENDATION = "Female Calm";

const EMPTY_FORM = {
  name: "", goal: "", program: "", voice: "", background: "",
  length: "5", style: "", personalization: "deep",
  fears: "", motivation: "", idealLife: "",
  deepQ1: "", deepQ2: "", deepQ3: "", deepQ4: "",
  affirmationStyle: "You are", backgroundIntensity: "", pace: "slow",
};

function buildSteps(plan, isAdmin) {
  const steps = [
    { id: "name",       question: "What is your name?",                        type: "input",   placeholder: "Your first name..." },
    { id: "goal",       question: "What do you want to let go of or achieve?", type: "input",   placeholder: "e.g. Release anxiety and sleep deeply..." },
    { id: "program",    question: "Choose your program",                        type: "options", options: getProgramOptions(plan, isAdmin), lockedAction: isAdmin ? undefined : "payment" },
    { id: "voice",      question: "Choose your voice",                          type: "options", options: VOICES },
    { id: "pace",       question: "Speaking pace",                              type: "options", options: [
      { value: "slow",   icon: "◦", label: "Slow",   sub: "Deep and relaxed — more space between words" },
      { value: "medium", icon: "◎", label: "Medium", sub: "Calm and clear" },
      { value: "fast",   icon: "●", label: "Fast",   sub: "Focused and present" },
    ]},
    { id: "background", question: "Choose your background sound",               type: "options", options: BACKGROUNDS },
    { id: "length",     question: "How long would you like your session?",      type: "options", options: getLengthOptions(plan, isAdmin), lockedAction: isAdmin ? undefined : "payment" },
    { id: "style",      question: "Choose your session style",                  type: "options", options: getStyleOptions(plan, isAdmin) },
    { id: "personalization", question: "Make it yours", subtitle: "Your session is being written for you — not pulled from a library. Anything you share shapes the script.", type: "personalization" },
    { id: "affirmationStyle", question: "How should affirmations be voiced?", type: "options", options: [
      { value: "You are", icon: "◎", label: "You are...", sub: "Second person — like a trusted guide" },
      { value: "I am",    icon: "◦", label: "I am...",    sub: "First person — your own inner voice" },
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
    overflowX: "hidden", // clip star field horizontally; allow vertical scroll for tall steps
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

const PRIVACY_TEXT = [
  { h: "PRIVACY POLICY" },
  { sub: "Effective Date: April 2026" },
  { p: "Mind Tranceform is operated by Mind Tranceform LLC." },
  { h2: "Information We Collect" },
  { p: "We collect your name, email address, and responses to personalization questions solely to generate your custom audio sessions. We also collect payment information processed securely through Stripe. We do not sell your personal data." },
  { h2: "How We Use Your Information" },
  { p: "We use your information to generate personalized audio sessions, process payments, send session-related emails, and improve the app experience." },
  { h2: "Data Storage" },
  { p: "Your sessions and account information are stored securely using Supabase encrypted cloud storage. Audio files are generated on demand and stored temporarily." },
  { h2: "Your Rights" },
  { p: "You may request deletion of your account and all associated data at any time by emailing support@mindtranceform.com. You may cancel your subscription at any time." },
  { h2: "Children" },
  { p: "Mind Tranceform is not intended for users under 18 years of age." },
  { h2: "Cookies" },
  { p: "We use essential cookies only for authentication and session management." },
  { h2: "Changes" },
  { p: "We may update this policy. Updates will be posted in the app and on our website." },
  { h2: "Contact" },
  { p: "support@mindtranceform.com" },
];

const TERMS_TEXT = [
  { h: "TERMS OF SERVICE" },
  { sub: "Effective Date: April 2026" },
  { p: "By using Mind Tranceform you agree to these terms." },
  { h2: "Service Description" },
  { p: "Mind Tranceform provides personalized AI-generated meditation and hypnosis-style audio sessions for relaxation and personal development purposes only." },
  { h2: "Not Medical Advice" },
  { p: "Mind Tranceform is not medical, psychological, or therapeutic treatment and is not a substitute for professional care. Do not use as a replacement for prescribed treatment or medication. If you have a medical or mental health condition consult your doctor before use." },
  { h2: "Safety" },
  { p: "Do not listen while driving, operating machinery, caring for dependents, or in any situation requiring full alertness." },
  { h2: "User Responsibilities" },
  { p: "You agree to provide accurate information, not to misuse the service, not to resell or commercially distribute generated audio, and not to share account access." },
  { h2: "Payments and Subscriptions" },
  { p: "Subscriptions renew automatically unless cancelled. You may cancel at any time through the app. Payments are processed by Stripe. No refunds for partially used billing periods unless required by law. Single session purchases are non-refundable once the session has been generated." },
  { h2: "Intellectual Property" },
  { p: "Generated audio sessions are licensed to you for personal use only. You may not distribute, sell, or commercially exploit session content." },
  { h2: "Account Termination" },
  { p: "We may suspend accounts that abuse the platform, attempt to reverse engineer the service, or violate these terms." },
  { h2: "Limitation of Liability" },
  { p: "Mind Tranceform is not liable for decisions made based on session content, misuse of the app, or temporary service interruptions." },
  { h2: "Governing Law" },
  { p: "These terms are governed by the laws of the state of Georgia, United States." },
  { h2: "Contact" },
  { p: "support@mindtranceform.com" },
];

const DISCLAIMER_TEXT = [
  { h: "CLINICAL DISCLAIMER" },
  { sub: "Please read before use" },
  { p: "Mind Tranceform is designed for relaxation, personal development, and general wellness purposes only. It is not a medical device, psychological treatment, or therapeutic service, and is not intended to diagnose, treat, cure, or prevent any condition." },
  { h2: "Not a Substitute for Professional Care" },
  { p: "Mind Tranceform is not a substitute for professional mental health care, medical treatment, or psychological therapy. If you are experiencing a mental health crisis, suicidal thoughts, or severe emotional distress, please contact a qualified professional immediately." },
  { p: "US Crisis Line: call or text 988 (Suicide & Crisis Lifeline), available 24/7." },
  { h2: "Contraindications" },
  { p: "Consult a licensed healthcare provider before use if you have or suspect you may have epilepsy or seizure disorders, psychosis or schizophrenia, dissociative identity disorder, severe depression or suicidal ideation, or any other serious psychiatric condition. Do not use during pregnancy without consulting your doctor." },
  { h2: "Driving & Machinery" },
  { p: "Never listen while driving, operating machinery, caring for dependents, or in any situation requiring full alertness. The sessions are intended for use while safely seated or lying down with eyes closed." },
  { h2: "User Assumption of Risk" },
  { p: "By using Mind Tranceform, you acknowledge that you have read and understood this disclaimer and that you use the service at your own risk. Mind Tranceform LLC is not liable for any decisions made based on session content." },
  { h2: "Children" },
  { p: "Mind Tranceform is not intended for users under 18 years of age." },
  { h2: "Questions?" },
  { p: "support@mindtranceformapp.com" },
];

function LegalModal({ type, onClose }) {
  const blocks = type === "privacy" ? PRIVACY_TEXT : type === "disclaimer" ? DISCLAIMER_TEXT : TERMS_TEXT;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "1.5rem 1rem", overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0d1030", border: "0.5px solid rgba(255,255,255,0.12)",
          borderRadius: 20, padding: "2rem 1.75rem", maxWidth: 540, width: "100%",
          position: "relative", margin: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "none", border: "none", color: "#8a879e",
            cursor: "pointer", fontSize: "1.1rem", fontFamily: "inherit",
            lineHeight: 1, padding: "0.25rem 0.5rem",
          }}
        >✕</button>
        <div style={{ maxHeight: "75vh", overflowY: "auto", paddingRight: "0.5rem" }}>
          {blocks.map((b, i) => {
            if (b.h)   return <div key={i} style={{ fontSize: "1.1rem", fontWeight: 400, color: "#e8e6f0", letterSpacing: "0.08em", marginBottom: "0.5rem", marginTop: i > 0 ? "1rem" : 0 }}>{b.h}</div>;
            if (b.sub) return <div key={i} style={{ fontSize: "0.72rem", color: "#8a879e", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem" }}>{b.sub}</div>;
            if (b.h2)  return <div key={i} style={{ fontSize: "0.78rem", fontWeight: 500, color: "#a8d8c8", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "1.25rem", marginBottom: "0.4rem" }}>{b.h2}</div>;
            if (b.p)   return <div key={i} style={{ fontSize: "0.85rem", color: "#c8c5d8", lineHeight: 1.75, marginBottom: "0.5rem" }}>{b.p}</div>;
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

function Footer({ onOpenModal, onHowToUse, onNav }) {
  const linkStyle = { background: "none", border: "none", color: "#8a879e", fontSize: "0.68rem", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", letterSpacing: "0.05em", opacity: 0.7, margin: "0 0.5rem" };
  const emailStyle = { color: "#8a879e", fontSize: "0.68rem", textDecoration: "underline", letterSpacing: "0.05em", opacity: 0.7, margin: "0 0.5rem" };
  const nav = (page) => onNav ? onNav(page) : onOpenModal(page);
  return (
    <div style={{ textAlign: "center", padding: "1.75rem 0 0.5rem" }}>
      <a href="mailto:support@mindtranceformapp.com" style={emailStyle}>support@mindtranceformapp.com</a>
      <span style={{ color: "#8a879e", opacity: 0.4, fontSize: "0.68rem" }}>·</span>
      <button style={linkStyle} onClick={() => nav("terms")}>Terms</button>
      <span style={{ color: "#8a879e", opacity: 0.4, fontSize: "0.68rem" }}>·</span>
      <button style={linkStyle} onClick={() => nav("privacy")}>Privacy</button>
      <span style={{ color: "#8a879e", opacity: 0.4, fontSize: "0.68rem" }}>·</span>
      <button style={linkStyle} onClick={() => nav("cookies")}>Cookies</button>
      <span style={{ color: "#8a879e", opacity: 0.4, fontSize: "0.68rem" }}>·</span>
      <button style={linkStyle} onClick={() => nav("privacyData")}>Data handling</button>
      <span style={{ color: "#8a879e", opacity: 0.4, fontSize: "0.68rem" }}>·</span>
      <button style={linkStyle} onClick={() => onOpenModal("disclaimer")}>Clinical Disclaimer</button>
      {onHowToUse && <><span style={{ color: "#8a879e", opacity: 0.4, fontSize: "0.68rem" }}>·</span><button style={linkStyle} onClick={onHowToUse}>How to use</button></>}
    </div>
  );
}

// ─── BACKGROUND AUDIO ────────────────────────────────────────────────────────
// scheduleRandom: fires fn after a random delay between minMs and maxMs, then
// reschedules. Returns { stop() } to cancel. Used for thunder and seagulls.
function scheduleRandom(fn, minMs, maxMs) {
  let stopped = false;
  let timer;
  function schedule() {
    if (stopped) return;
    const delay = minMs + Math.random() * (maxMs - minMs);
    timer = setTimeout(() => { if (!stopped) { fn(); schedule(); } }, delay);
  }
  schedule();
  return { stop() { stopped = true; clearTimeout(timer); } };
}

// makePinkNoise: fills a 2-channel AudioBuffer with pink noise using the
// Paul Kellet algorithm. scale controls overall amplitude.
function makePinkNoise(ctx, seconds, scale) {
  const sr = ctx.sampleRate;
  const buf = ctx.createBuffer(2, sr * seconds, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
      b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
      b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
      d[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362) * scale;
      b6 = w * 0.115926;
    }
  }
  return buf;
}

function buildBackgroundNodes(ctx, type, dest) {
  const nodes = [];
  try {
    const now = ctx.currentTime;

    if (type === "432 Hz" || type === "528 Hz") {
      const fundamental = type === "432 Hz" ? 432 : 528;

      // Fade-in master gain over 3 s
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(1, now + 3);
      masterGain.connect(dest);

      // Fundamental (65%), octave harmonic (20%), undertone (15%)
      [[fundamental, 0.65], [fundamental * 2, 0.20], [fundamental / 2, 0.15]].forEach(([freq, amp]) => {
        const osc = ctx.createOscillator();
        osc.type = "sine"; osc.frequency.value = freq;
        const g = ctx.createGain(); g.gain.value = amp;
        osc.connect(g); g.connect(masterGain); osc.start(); nodes.push(osc);
      });

      // Slow tremolo LFO — subtle ±7% AM at 0.1 Hz (432) or 0.15 Hz (528)
      const tremoloLfo = ctx.createOscillator();
      const tremoloGain = ctx.createGain();
      tremoloLfo.type = "sine";
      tremoloLfo.frequency.value = type === "432 Hz" ? 0.1 : 0.15;
      tremoloGain.gain.value = 0.07;
      tremoloLfo.connect(tremoloGain); tremoloGain.connect(masterGain.gain);
      tremoloLfo.start(); nodes.push(tremoloLfo);

    } else if (type === "Theta Waves" || type === "Delta Sleep") {
      // Delta uses 180 Hz carrier (lower, more hypnotic); Theta uses 200 Hz
      const carrier = type === "Theta Waves" ? 200 : 180;
      const beat    = type === "Theta Waves" ? 6   : 2;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(1, now + 3);
      masterGain.connect(dest);

      // Binaural oscillators — hard-panned L/R
      [carrier, carrier + beat].forEach((freq, idx) => {
        const osc = ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = freq;
        const panner = ctx.createStereoPanner(); panner.pan.value = idx === 0 ? -1 : 1;
        const g = ctx.createGain(); g.gain.value = 0.55;
        osc.connect(g); g.connect(panner); panner.connect(masterGain); osc.start(); nodes.push(osc);
      });

      // Low-volume pink noise pad for texture (filtered below 300 Hz)
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = makePinkNoise(ctx, 8, 0.04);
      noiseSrc.loop = true;
      const noiseLP = ctx.createBiquadFilter(); noiseLP.type = "lowpass"; noiseLP.frequency.value = 300;
      noiseSrc.connect(noiseLP); noiseLP.connect(masterGain);
      noiseSrc.start(); nodes.push(noiseSrc);

      // Slow breathing LFO — 0.05 Hz Theta (20 s cycle), 0.03 Hz Delta (33 s cycle)
      const breathLfo = ctx.createOscillator();
      const breathGain = ctx.createGain();
      breathLfo.type = "sine";
      breathLfo.frequency.value = type === "Theta Waves" ? 0.05 : 0.03;
      breathGain.gain.value = 0.06;
      breathLfo.connect(breathGain); breathGain.connect(masterGain.gain);
      breathLfo.start(); nodes.push(breathLfo);

      // Delta only: 40 Hz sub-bass rumble
      if (type === "Delta Sleep") {
        const rumble = ctx.createOscillator();
        rumble.type = "sine"; rumble.frequency.value = 40;
        const rg = ctx.createGain(); rg.gain.value = 0.06;
        rumble.connect(rg); rg.connect(masterGain); rumble.start(); nodes.push(rumble);
      }

    } else if (type === "Rain") {
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(1, now + 2);
      masterGain.connect(dest);

      // Pink noise → bandpass at 1 kHz (mid-frequency sibilance of rain)
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = makePinkNoise(ctx, 8, 0.22);
      noiseSrc.loop = true;
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1000; bp.Q.value = 0.4;
      noiseSrc.connect(bp); bp.connect(masterGain);
      noiseSrc.start(); nodes.push(noiseSrc);

      // 2 Hz raindrop LFO — gentle patter rhythm
      const dropLfo = ctx.createOscillator();
      const dropGain = ctx.createGain();
      dropLfo.type = "sine"; dropLfo.frequency.value = 2;
      dropGain.gain.value = 0.1;
      dropLfo.connect(dropGain); dropGain.connect(masterGain.gain);
      dropLfo.start(); nodes.push(dropLfo);

      // Random distant thunder every 15–30 s: low-pass noise burst with decay
      const thunderHandle = scheduleRandom(() => {
        try {
          const sr = ctx.sampleRate;
          const tBuf = ctx.createBuffer(1, sr * 2, sr);
          const td = tBuf.getChannelData(0);
          for (let i = 0; i < td.length; i++) td[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / td.length, 1.5);
          const tSrc = ctx.createBufferSource(); tSrc.buffer = tBuf;
          const tLP = ctx.createBiquadFilter(); tLP.type = "lowpass"; tLP.frequency.value = 90;
          const tGain = ctx.createGain(); tGain.gain.value = 0.5;
          tSrc.connect(tLP); tLP.connect(tGain); tGain.connect(dest);
          tSrc.start();
        } catch {}
      }, 15000, 30000);
      nodes.push({ stop: () => thunderHandle.stop() });

    } else if (type === "Ocean") {
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.3, now);
      masterGain.gain.linearRampToValueAtTime(0.65, now + 3);
      masterGain.connect(dest);

      // Pink noise → low-pass at 600 Hz for deep ocean rumble
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = makePinkNoise(ctx, 8, 0.30);
      noiseSrc.loop = true;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 600; lp.Q.value = 0.7;
      noiseSrc.connect(lp); lp.connect(masterGain);
      noiseSrc.start(); nodes.push(noiseSrc);

      // Slow wave LFO — 0.08 Hz (≈12 s wave period), ±35% gain modulation
      const waveLfo = ctx.createOscillator();
      const waveGain = ctx.createGain();
      waveLfo.type = "sine"; waveLfo.frequency.value = 0.08;
      waveGain.gain.value = 0.35;
      waveLfo.connect(waveGain); waveGain.connect(masterGain.gain);
      waveLfo.start(); nodes.push(waveLfo);

      // Random seagull cry every 20–40 s: quick FM sweep 800 → 1200 → 900 Hz
      const seagullHandle = scheduleRandom(() => {
        try {
          const sg = ctx.createOscillator(); sg.type = "sine";
          const t0 = ctx.currentTime;
          sg.frequency.setValueAtTime(800, t0);
          sg.frequency.linearRampToValueAtTime(1200, t0 + 0.3);
          sg.frequency.linearRampToValueAtTime(900, t0 + 0.65);
          const sgGain = ctx.createGain();
          sgGain.gain.setValueAtTime(0, t0);
          sgGain.gain.linearRampToValueAtTime(0.07, t0 + 0.1);
          sgGain.gain.linearRampToValueAtTime(0, t0 + 0.75);
          sg.connect(sgGain); sgGain.connect(dest);
          sg.start(); sg.stop(t0 + 0.85);
        } catch {}
      }, 20000, 40000);
      nodes.push({ stop: () => seagullHandle.stop() });
    }
  } catch (e) {
    console.error("Background audio error:", e);
  }
  return nodes;
}

function BackgroundPlayer({ background, intensity }) {
  const ctxRef   = useRef(null);
  const nodesRef = useRef([]);
  const gainRef  = useRef(null);

  const BG_VOLUME  = { Subtle: 10, Balanced: 15, Immersive: 20 }; // max 0.20 to stay below voice track
  const defaultVol = BG_VOLUME[intensity] ?? 15;
  const [vol, setVol]       = useState(defaultVol);
  const [playing, setPlaying] = useState(false);

  // Clean up AudioContext when component unmounts or background changes
  useEffect(() => () => stopBg(), []); // eslint-disable-line react-hooks/exhaustive-deps

  // Resume AudioContext after screen lock / tab switch; restart generators if they died.
  useEffect(() => {
    let hiddenAt = 0;
    function onHide()    { if (document.visibilityState === "hidden") hiddenAt = Date.now(); }
    function onVisible() {
      if (document.visibilityState !== "visible" || !ctxRef.current) return;
      const wasGoneLong = Date.now() - hiddenAt > 2000;
      if (ctxRef.current.state === "suspended") {
        ctxRef.current.resume().then(() => {
          if (wasGoneLong) { stopBg(); startBg(); }
        }).catch(() => {});
      }
    }
    document.addEventListener("visibilitychange", onHide);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!background || !window.AudioContext && !window.webkitAudioContext) return null;

  function startBg() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = vol / 100;
    gain.connect(ctx.destination);
    gainRef.current = gain;
    nodesRef.current = buildBackgroundNodes(ctx, background, gain);
    setPlaying(true);
  }

  function stopBg() {
    nodesRef.current.forEach(n => { try { n.stop(); } catch {} });
    nodesRef.current = [];
    if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; }
    gainRef.current = null;
    setPlaying(false);
  }

  function handleVol(v) {
    setVol(v);
    if (gainRef.current) gainRef.current.gain.value = v / 100;
  }

  const isBinaural = background === "Theta Waves" || background === "Delta Sleep";

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: playing ? "0.65rem" : 0 }}>
        <button
          style={{
            flex: 1, padding: "0.55rem 0.75rem", borderRadius: 10, fontFamily: "inherit",
            border: playing ? "0.5px solid #a8d8c8" : "0.5px solid rgba(255,255,255,0.15)",
            background: playing ? "rgba(168,216,200,0.08)" : "transparent",
            color: playing ? "#a8d8c8" : "#8a879e", fontSize: "0.82rem", cursor: "pointer",
            transition: "all 0.2s",
          }}
          onClick={playing ? stopBg : startBg}
        >
          {playing ? `■  ${background}` : `▷  ${background}`}
        </button>
      </div>
      {playing && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.68rem", color: "#8a879e", flexShrink: 0 }}>Vol</span>
          <input
            type="range" min="0" max="100" value={vol}
            onChange={e => handleVol(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#a8d8c8", cursor: "pointer", height: 3 }}
          />
          <span style={{ fontSize: "0.68rem", color: "#8a879e", flexShrink: 0, minWidth: 26, textAlign: "right" }}>{vol}%</span>
        </div>
      )}
      {isBinaural && (
        <div style={{ fontSize: "0.7rem", color: "#8a879e", marginTop: "0.4rem", opacity: 0.7 }}>
          ◦ Use headphones for binaural effect
        </div>
      )}
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
                  borderRadius: 6, color: "#a8d8c8", fontSize: "0.72rem",
                  padding: "0.2rem 0.55rem", cursor: "pointer", flexShrink: 0,
                  marginRight: "0.5rem", fontFamily: "inherit",
                  transition: "background 0.18s", letterSpacing: "0.03em",
                }}
              >
                {isLoadingPreview ? "···" : isPlayingPreview ? "■ Stop" : "▷ Preview"}
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

function Logo({ sub = false, brand = null }) {
  if (brand) {
    return (
      <div style={S.logo}>
        {brand.brand_logo_url
          ? <img src={brand.brand_logo_url} alt={brand.brand_name}
              style={{ maxHeight: 56, maxWidth: 220, marginBottom: "0.35rem", display: "block", margin: "0 auto 0.35rem" }} />
          : <h1 style={{ ...S.h1, color: brand.brand_color || "#a8d8c8" }}>{brand.brand_name}</h1>
        }
        {sub && <p style={S.logoSub}>Powered by Mind Tranceform</p>}
      </div>
    );
  }
  return (
    <div style={S.logo}>
      <h1 style={S.h1}>Mind <span style={S.h1span}>Tranceform</span></h1>
      {sub && <p style={S.logoSub}>Personalized Meditation &amp; Hypnosis</p>}
    </div>
  );
}

// Custom audio player with scrub bar and ±15 s skip controls.
function SessionAudioPlayer({ src, onPlay, onPause, onError, noteText }) {
  const ref            = useRef(null);
  const scrubRef       = useRef(null);
  const timeRef        = useRef(null);
  const hasRestoredRef = useRef(false);
  const durationRef    = useRef(0);
  const scrubbingRef   = useRef(false);
  // Store src in a ref and set it imperatively so React re-renders never touch the audio src.
  const srcRef         = useRef(null);
  const wakeLockRef    = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (src && src !== srcRef.current) {
      srcRef.current = src;
      if (ref.current) ref.current.src = src;
    }
  }, [src]);

  // Mount/unmount diagnostic — confirms the audio element is stable during interaction.
  useEffect(() => {
    console.log("[AUDIO MOUNT] element created, src=", ref.current?.src || "(not yet set)");
    return () => { console.log("[AUDIO UNMOUNT]"); releaseWakeLock(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Screen Wake Lock — keeps display on (dimmed) while audio plays.
  // Re-acquired on unlock because the OS releases it automatically on screen-off.
  async function acquireWakeLock() {
    if (!("wakeLock" in navigator) || wakeLockRef.current) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
      wakeLockRef.current.addEventListener("release", () => { wakeLockRef.current = null; });
    } catch {}
  }
  function releaseWakeLock() {
    try { wakeLockRef.current?.release(); } catch {}
    wakeLockRef.current = null;
  }
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible" && playing) acquireWakeLock();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [playing]); // eslint-disable-line react-hooks/exhaustive-deps

  function fmt(s) {
    if (!isFinite(s) || s < 0) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  }
  function skip(delta) {
    const a = ref.current;
    if (!a) return;
    a.currentTime += delta;
  }
  function commitScrub(val) {
    if (ref.current) ref.current.currentTime = val;
    scrubbingRef.current = false;
  }

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("seekforward",  () => { if (ref.current) ref.current.currentTime += 15; });
    navigator.mediaSession.setActionHandler("seekbackward", () => { if (ref.current) ref.current.currentTime -= 15; });
    navigator.mediaSession.setActionHandler("seekto", (d) => { if (ref.current && d.seekTime != null) ref.current.currentTime = d.seekTime; });
    navigator.mediaSession.setActionHandler("play",  () => { ref.current?.play(); });
    navigator.mediaSession.setActionHandler("pause", () => { ref.current?.pause(); });
    return () => {
      navigator.mediaSession.setActionHandler("seekforward",  null);
      navigator.mediaSession.setActionHandler("seekbackward", null);
      navigator.mediaSession.setActionHandler("seekto", null);
      navigator.mediaSession.setActionHandler("play",  null);
      navigator.mediaSession.setActionHandler("pause", null);
    };
  }, []);

  const ring = { background: "rgba(168,216,200,0.08)", border: "0.5px solid rgba(168,216,200,0.25)", borderRadius: 8, color: "#a8d8c8", cursor: "pointer", fontSize: "0.82rem", padding: "0.45rem 0.75rem", lineHeight: 1 };

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <audio
        ref={ref}
        playsInline
        preload="auto"
        style={{ display: "none" }}
        onTimeUpdate={() => {
          const t = ref.current?.currentTime || 0;
          if (!scrubbingRef.current && scrubRef.current) scrubRef.current.value = t;
          if (timeRef.current) timeRef.current.textContent = fmt(t);
          if (t > 0) localStorage.setItem("mt_audio_position", t);
        }}
        onLoadedMetadata={() => {
          durationRef.current = ref.current?.duration || 0;
          if (scrubRef.current) scrubRef.current.max = durationRef.current;
          if (!hasRestoredRef.current) {
            hasRestoredRef.current = true;
            const saved = parseFloat(localStorage.getItem("mt_audio_position") || "0");
            if (saved > 5 && ref.current) ref.current.currentTime = saved;
          }
        }}
        onPlay={() => {
          setPlaying(true); onPlay?.();
          acquireWakeLock();
          if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "playing";
        }}
        onPause={() => {
          setPlaying(false); onPause?.();
          releaseWakeLock();
          if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "paused";
        }}
        onEnded={() => {
          setPlaying(false); localStorage.removeItem("mt_audio_position");
          releaseWakeLock();
          if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "none";
        }}
        onError={onError}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <button style={ring} onClick={() => skip(-15)} title="Back 15 seconds">↺ 15s</button>
        <button
          style={{ ...ring, flex: 1, fontSize: "1rem", padding: "0.5rem", background: "rgba(168,216,200,0.14)" }}
          onClick={() => playing ? ref.current?.pause() : ref.current?.play()}
        >{playing ? "⏸ Pause" : "▶ Play"}</button>
        <button style={ring} onClick={() => skip(15)} title="Forward 15 seconds">15s ↻</button>
      </div>
      <input
        ref={scrubRef}
        type="range" min={0} max={durationRef.current || 0} step={0.5} defaultValue={0}
        onChange={e => {
          scrubbingRef.current = true;
          if (timeRef.current) timeRef.current.textContent = fmt(parseFloat(e.target.value));
        }}
        onMouseUp={e => commitScrub(parseFloat(e.target.value))}
        onTouchEnd={e => commitScrub(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#a8d8c8", cursor: "pointer", marginBottom: "0.25rem" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#8a879e" }}>
        <span ref={timeRef}>0:00</span>
        <span>{durationRef.current > 0 ? fmt(durationRef.current) : "--:--"}</span>
      </div>
      {noteText && <div style={{ fontSize: "0.73rem", color: "#8a879e", textAlign: "center", marginTop: "0.35rem" }}>{noteText}</div>}
    </div>
  );
}

// Renders a session script with proper paragraph breaks and no raw SSML markup.
function renderScript(script) {
  if (!script) return null;
  const stripped = script.replace(/<[^>]*>/g, "");
  const paras = stripped.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  if (paras.length <= 1) return stripped.trim();
  return paras.map((p, i) => <p key={i} style={{ margin: "0 0 1em 0" }}>{p}</p>);
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function MindTranceformApp() {
  const [user, setUser]           = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [view, setView]           = useState("auth");
  const [pendingResume, setPendingResume] = useState(null);

  // Plan & usage (localStorage)
  const [plan, setPlan]               = useState(() => localStorage.getItem("mt_plan"));
  const [sessionsUsed, setSessionsUsed] = useState(() => parseInt(localStorage.getItem("mt_sessions_used") || "0"));

  // Auth form
  const [authMode, setAuthMode]               = useState("login");
  const [authEmail, setAuthEmail]             = useState("");
  const [authPassword, setAuthPassword]       = useState("");
  const [authError, setAuthError]             = useState("");
  const [authBusy, setAuthBusy]               = useState(false);
  const [authForgot, setAuthForgot]           = useState(false);
  const [signupConfirmSent, setSignupConfirmSent] = useState(false);
  const [resendStatus, setResendStatus]       = useState("");

  // Safety
  const [safetyAccepted, setSafetyAccepted] = useState(() => !!localStorage.getItem("mt_safety_accepted"));
  const [safetyChecked, setSafetyChecked]   = useState(false);
  const [safetyReturn, setSafetyReturn]     = useState("home"); // "generate" | "home"

  // Quiz
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [fastEntryText, setFastEntryText] = useState("");
  const [techniqueTooltipOpen, setTechniqueTooltipOpen] = useState(false);
  const [error, setError]   = useState("");
  const [generating, setGenerating] = useState(false);
  const [topicBlocked, setTopicBlocked] = useState(false);
  const [result, setResult] = useState(null);
  const [genStep, setGenStep] = useState(0);
  const [sseChunk, setSseChunk] = useState(0);
  const [sseTotalChunks, setSseTotalChunks] = useState(0);
  const [sseMessage, setSseMessage] = useState("");
  const [audioPulse, setAudioPulse] = useState(false);

  // Voice preview
  const previewAudioRef                         = useRef(null);
  const ratingTimerRef                          = useRef(null);
  const [previewLoading, setPreviewLoading]     = useState(null);
  const [previewPlaying, setPreviewPlaying]     = useState(null);

  // Background sound preview
  const bgPreviewCtxRef   = useRef(null);
  const bgPreviewAudioRef = useRef(null);
  const bgPreviewTimerRef = useRef(null);
  const sessionStateRef   = useRef({});
  const [bgPreviewPlaying, setBgPreviewPlaying] = useState(null);
  const [bgPreviewLoading, setBgPreviewLoading] = useState(null);

  // Background listening instructions
  const [bgInstructionsChecked, setBgInstructionsChecked] = useState(false);

  // Sessions
  const [sessions, setSessions]                         = useState([]);
  const [sessionsLoading, setSessionsLoading]           = useState(false);
  const [selectedSession, setSelectedSession]           = useState(null);
  const [sessionDetailLoading, setSessionDetailLoading] = useState(false);
  const [sessionDetailError, setSessionDetailError]     = useState("");
  const [deleteConfirmId, setDeleteConfirmId]           = useState(null);

  // Account / subscription
  const [welcomeMsg, setWelcomeMsg]       = useState("");
  const [subStatus, setSubStatus]         = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelling, setCancelling]       = useState(false);

  // White label
  const [whiteLabel, setWhiteLabel]   = useState(null);

  // WL signup form (view="whitelabel")
  const [wlForm, setWlForm]           = useState({ brand_name: "", email: "", plan: "", brand_color: "#a8d8c8", custom_domain: "", brand_logo_url: "" });
  const [wlBusy, setWlBusy]           = useState(false);
  const [wlError, setWlError]         = useState("");

  // WL admin (view="wladmin")
  const [wlAdmin, setWlAdmin]         = useState(null);
  const [wlAdminEdit, setWlAdminEdit] = useState({ brand_name: "", brand_color: "", brand_logo_url: "", custom_domain: "" });
  const [wlAdminBusy, setWlAdminBusy] = useState(false);
  const [wlAdminMsg, setWlAdminMsg]   = useState("");

  // Corporate inquiry form (view="corporate")
  const [corpForm, setCorpForm]       = useState({ name: "", email: "", company: "", role: "", teamSize: "", useCase: "", timeline: "", message: "" });
  const [corpBusy, setCorpBusy]       = useState(false);
  const [corpDone, setCorpDone]       = useState(false);
  const [corpError, setCorpError]     = useState("");

  // WL plan selection (must be at top level — used inside view="whitelabel")
  const [wlSelectedPlan, setWlSelectedPlan] = useState("");

  // Referral system
  const [referralCode, setReferralCode]   = useState(null);
  const [referralStats, setReferralStats] = useState({ total: 0, joined: 0, monthsEarned: 0 });

  // Testimonial rating prompt
  const [ratingState, setRatingState]       = useState(null); // null | "prompt" | "message" | "done"
  const [ratingVal, setRatingVal]           = useState(0);
  const [ratingMsg, setRatingMsg]           = useState("");
  const [ratedSessionId, setRatedSessionId] = useState(null);


  // Legal modals
  const [legalModal, setLegalModal] = useState(null); // null | "privacy" | "terms"
  const [termsChecked, setTermsChecked] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showAllVoices, setShowAllVoices] = useState(false);

  // Delete account
  const [deleteAcctConfirm, setDeleteAcctConfirm] = useState(false);
  const [deleteAcctBusy, setDeleteAcctBusy]       = useState(false);
  const [deleteAcctError, setDeleteAcctError]     = useState("");

  // PWA install prompt
  const [deferredInstall, setDeferredInstall] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Blog
  const [blogPosts, setBlogPosts]         = useState([]);
  const [blogPost, setBlogPost]           = useState(null);
  const [blogLoading, setBlogLoading]     = useState(false);

  // Content calendar (admin)
  const [contentItems, setContentItems]   = useState([]);
  const [contentFilter, setContentFilter] = useState({ type: "", status: "draft" });
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError]   = useState("");
  const [contentAdminKey, setContentAdminKey] = useState(() => localStorage.getItem("mt_admin_key") || "");
  const [adminKeyPrompt, setAdminKeyPrompt]   = useState("");
  const [blogAdminPosts, setBlogAdminPosts]   = useState([]);
  const [contentCopied, setContentCopied]    = useState(null);

  // Public testimonials
  const [testimonials, setTestimonials] = useState([]);

  // Admin flag — owner account always gets full pro access
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  // Dynamic steps based on plan (admin sees everything unlocked)
  const steps = buildSteps(plan, isAdmin);

  // Capture PWA install prompt
  useEffect(() => {
    const handler = e => { e.preventDefault(); setDeferredInstall(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Fetch public testimonials on first load
  useEffect(() => { fetchTestimonials(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject keyframe animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes twinkle { 0%{opacity:0.1} 100%{opacity:0.6} }
      @keyframes pulseRing { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.12);opacity:1} }
      @keyframes dotPop { 0%,60%,100%{transform:scale(1);opacity:0.4} 30%{transform:scale(1.4);opacity:1} }
      @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Reset progress state when generation finishes.
  useEffect(() => {
    if (!generating) { setGenStep(0); setSseChunk(0); setSseTotalChunks(0); setSseMessage(""); }
  }, [generating]);


  // Auto-load WL admin data when navigating to that view
  useEffect(() => {
    if (view === "wladmin" && user) loadWlAdmin();
  }, [view]);

  // Keep sessionStateRef current so the pagehide/visibilitychange handler always sees
  // the latest state without needing to re-register the listeners.
  useEffect(() => {
    sessionStateRef.current = { view, result, selectedSession, form, user };
  }, [view, result, selectedSession, form, user]);

  // Persist the active session to localStorage whenever the app goes to background
  // (screen lock, tab switch, PWA suspend) and restore it on resume so the session
  // is not lost — equivalent to AppState + AsyncStorage in React Native.
  useEffect(() => {
    const RESTORABLE = new Set(["result", "sessionDetail", "home", "sessions", "generate", "account"]);
    function saveSessionState() {
      const { view: v, result: r, selectedSession: ss, form: f, user: u } = sessionStateRef.current;
      if (!u || !RESTORABLE.has(v)) return;
      try {
        localStorage.setItem("mt_session_state", JSON.stringify({
          view: v, result: r, selectedSession: ss, form: f, savedAt: Date.now(),
        }));
      } catch {}
    }
    const onVisibilityChange = () => { if (document.visibilityState === "hidden") saveSessionState(); };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", saveSessionState);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", saveSessionState);
    };
  }, []); // Restore view when user returns to the app from lock screen (already logged in).
// The auth-callback restore only runs on cold start; this handles warm resume.
useEffect(() => {
  if (!authReady) return;
  const RESTORE_TTL_MS = 30 * 60 * 1000;

  function tryRestore() {
    try {
      const raw = localStorage.getItem("mt_session_state");
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved.savedAt || Date.now() - saved.savedAt >= RESTORE_TTL_MS) {
        localStorage.removeItem("mt_session_state");
        return;
      }
      const restorable = new Set(["sessionDetail", "result"]);
      if (!restorable.has(saved.view)) return;

      // If we're already on the correct view with a session loaded, skip the restore —
      // this prevents the scrubber's visibilitychange from reloading the audio src.
      const current = sessionStateRef.current;
      if (current.view === saved.view && (current.result || current.selectedSession)) return;

      localStorage.removeItem("mt_session_state");
      if (saved.result)          setResult(saved.result);
      if (saved.selectedSession) setSelectedSession(saved.selectedSession);
      if (saved.form)            setForm(saved.form);
      setView(saved.view);
    } catch {}
  }

  // Run immediately when authReady fires — catches tablet/phone login-to-unlock
  // where auth event fires after visibilitychange, resetting view to home first.
  tryRestore();

  function onVisibilityChange() {
    if (document.visibilityState === "visible") tryRestore();
  }

  document.addEventListener("visibilitychange", onVisibilityChange);
  return () => document.removeEventListener("visibilitychange", onVisibilityChange);
}, [authReady]); // authReady only — removing view prevents stale closure capturing wrong view

  // Register MediaSession metadata so the OS shows lock-screen audio controls and
  // keeps playback alive when the screen locks (consistent with other meditation apps).
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const s = result || selectedSession;
    if (!s) { navigator.mediaSession.metadata = null; return; }
    navigator.mediaSession.metadata = new MediaMetadata({
      title: s.program || s.title || "Meditation Session",
      artist: "Mind Tranceform",
      album: s.voice || "",
    });
  }, [result, selectedSession]);

  // Clear rating timer on view change away from result
  useEffect(() => {
    if (view !== "result") {
      clearTimeout(ratingTimerRef.current);
    }
  }, [view]);

  // Auth state + Stripe return handling
  useEffect(() => {
    // Store referral code from URL
    const refCode = new URLSearchParams(window.location.search).get("ref");
    if (refCode) localStorage.setItem("mt_referral_code", refCode);

    // Detect white label branding (domain or ?wl= param)
    async function detectWhiteLabel() {
      const params = new URLSearchParams(window.location.search);
      const wlId = params.get("wl");
      if (wlId) {
        try {
          const res = await fetch(`${BACKEND_URL}/whitelabel/${wlId}`);
          const data = await res.json();
          if (data.success && data.account.active) setWhiteLabel(data.account);
        } catch {}
        return;
      }
      const hostname = window.location.hostname;
      const ownHosts = ["mindtranceform.com", "app.mindtranceform.com", "app.mindtranceformapp.com", "localhost", "127.0.0.1"];
      if (!ownHosts.includes(hostname)) {
        try {
          const res = await fetch(`${BACKEND_URL}/whitelabel/domain/${encodeURIComponent(hostname)}`);
          const data = await res.json();
          if (data.success) setWhiteLabel(data.account);
        } catch {}
      }
    }
    detectWhiteLabel();

    // Path-based routing for WL pages (before auth check)
    const path = window.location.pathname;
    if (path === "/whitelabel" || path.startsWith("/whitelabel")) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("registered") === "true") {
        setWlAdminMsg("Payment successful! Your white label account is now active.");
      }
      setView("whitelabel");
    } else if (path === "/admin") {
      setView("wladmin");
    } else if (path === "/admin/content") {
      setView("adminContent");
      setAuthReady(true);
    } else if (path === "/corporate") {
      setView("corporate");
    } else if (path === "/blog" || path === "/blog/") {
      setView("blog");
      setAuthReady(true);
    } else if (path.startsWith("/blog/")) {
      const slug = path.replace("/blog/", "").replace(/\/$/, "");
      setBlogPost({ slug, loading: true });
      setView("blogPost");
      setAuthReady(true);
    } else if (path === "/terms") {
      setView("terms");
      setAuthReady(true);
    } else if (path === "/privacy") {
      setView("privacy");
      setAuthReady(true);
    } else if (path === "/cookies") {
      setView("cookies");
      setAuthReady(true);
    } else if (path === "/privacy-data") {
      setView("privacyData");
      setAuthReady(true);
    }

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
      // Sync plan from backend (admin forced to pro, others fetched from Supabase)
      if (session?.user) fetchAndSetPlan(session.access_token, session.user.email);
      // After payment, show safety screen if not yet accepted
      if (isPaymentSuccess && session?.user && !localStorage.getItem("mt_safety_accepted")) {
        setSafetyReturn("home");
        setView("safety");
      } else {
        const currentPath = window.location.pathname;
        const isRootPath = currentPath === "/" || currentPath === "";
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        if (currentPath === "/admin/content") {
          setView(session?.user?.email === adminEmail ? "adminContent" : (session?.user ? "home" : "landing"));
        } else if (session?.user) {
          // On cold start, show home + "Resume" prompt rather than silently navigating.
          // This prevents the SIGNED_IN race: getSession would consume mt_session_state,
          // then SIGNED_IN fires, finds nothing, and resets the view to home.
          const RESTORE_TTL_MS = 30 * 60 * 1000;
          try {
            const raw = localStorage.getItem("mt_session_state");
            if (raw) {
              const saved = JSON.parse(raw);
              localStorage.removeItem("mt_session_state");
              const restorable = new Set(["sessionDetail", "result"]);
              if (saved.savedAt && Date.now() - saved.savedAt < RESTORE_TTL_MS && restorable.has(saved.view)) {
                setPendingResume(saved);
              }
            }
          } catch {}
          setView("home");
        } else {
          setView(isRootPath ? "landing" : "auth");
        }
      }
      setAuthReady(true);
      if (isPaymentSuccess && session?.user) {
        fetch(`${BACKEND_URL}/user/subscribe`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
        }).catch(() => {});
        // Process referral reward if this user was referred
        fetch(`${BACKEND_URL}/referral/reward`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
        }).catch(() => {});
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      // TOKEN_REFRESHED fires silently on app resume — it must NOT reset the view
      // because the session state may have just been restored from localStorage.
      // INITIAL_SESSION is handled by getSession() above.
      // Only SIGNED_IN and SIGNED_OUT should drive a view transition.
      if (event === "SIGNED_IN") {
        const currentPath = window.location.pathname;
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        if (currentPath === "/admin/content" && u?.email === adminEmail) {
          setView("adminContent");
        } else {
          // On SIGNED_IN (cold start or re-auth), check for a saved session.
          // Show home + Resume prompt rather than silently navigating — avoids the
          // race where getSession already consumed mt_session_state and SIGNED_IN
          // would see nothing and unconditionally reset the view to home.
          const RESTORE_TTL_MS = 30 * 60 * 1000;
          let resumed = false;
          try {
            const raw = localStorage.getItem("mt_session_state");
            if (raw) {
              const saved = JSON.parse(raw);
              const restorable = new Set(["sessionDetail", "result"]);
              if (saved.savedAt && Date.now() - saved.savedAt < RESTORE_TTL_MS && restorable.has(saved.view)) {
                localStorage.removeItem("mt_session_state");
                setPendingResume(saved);
                resumed = true;
              }
            }
          } catch {}
          if (!resumed) setView("home");
        }
      } else if (event === "SIGNED_OUT") {
        localStorage.removeItem("mt_plan");
        localStorage.removeItem("mt_sessions_used");
        setPlan(null);
        setSessionsUsed(0);
        setPendingResume(null);
        setView("landing");
      }
      if (u) {
        localStorage.setItem("mt_user_id", u.id);
        if (u.email) localStorage.setItem("mt_user_email", u.email);
        // Only register / sync plan on actual sign-in — not token refreshes
        if (u.email && event === "SIGNED_IN") {
          const termsAcceptedAt = localStorage.getItem("mt_terms_accepted_at");
          fetch(`${BACKEND_URL}/user/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
            body: JSON.stringify({ terms_accepted_at: termsAcceptedAt || null }),
          }).catch(() => {});
          fetchAndSetPlan(session.access_token, u.email);
        } else if (event === "SIGNED_IN" && !u.email) {
          // Anonymous sign-in — clear any stale paid plan from a previous session
          localStorage.removeItem("mt_plan");
          setPlan(null);
          // Assign persistent guest_id for server-side session count enforcement
          if (!localStorage.getItem("mt_guest_id")) {
            localStorage.setItem("mt_guest_id", crypto.randomUUID());
          }
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

  // Fetch the user's plan from the backend and sync to state + localStorage.
  // Admin email always gets "pro" without a backend call.
  async function fetchAndSetPlan(token, userEmail) {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (userEmail === adminEmail) {
      localStorage.setItem("mt_plan", "pro");
      setPlan("pro");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/auth/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.plan) {
        localStorage.setItem("mt_plan", data.plan);
        setPlan(data.plan);
      } else if (data.success) {
        // Backend says no plan — clear any stale value from a previous session
        localStorage.removeItem("mt_plan");
        setPlan(null);
      }
    } catch {}
  }

  async function handleAuth(e) {
    e.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    let error;
    if (authMode === "signup") {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
      error = signUpErr;
      if (!error) {
        setSignupConfirmSent(true);
        // Record terms and age acceptance timestamps for audit trail
        localStorage.setItem("mt_terms_accepted_at", new Date().toISOString());
        localStorage.setItem("mt_age_confirmed_at", new Date().toISOString());
        // Track referral if present
        const refCode = localStorage.getItem("mt_referral_code");
        if (refCode && signUpData?.session?.access_token) {
          fetch(`${BACKEND_URL}/referral/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${signUpData.session.access_token}` },
            body: JSON.stringify({ referral_code: refCode }),
          }).then(() => localStorage.removeItem("mt_referral_code")).catch(() => {});
        }
      }
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

  async function handleResendConfirmation() {
    setResendStatus("sending");
    const { error } = await supabase.auth.resend({ type: "signup", email: authEmail });
    setResendStatus(error ? "error" : "sent");
  }

  async function handleGuestLogin() {
    setAuthBusy(true);
    setAuthError("");
    const { error } = await supabase.auth.signInAnonymously();
    if (error) setAuthError("Guest access unavailable — please create a free account.");
    setAuthBusy(false);
  }

  async function handleDeleteAccount() {
    setDeleteAcctBusy(true);
    setDeleteAcctError("");
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Deletion failed");
    } catch (err) {
      setDeleteAcctError(err.message || "Something went wrong. Email support@mindtranceformapp.com.");
      setDeleteAcctBusy(false);
      return;
    }
    await supabase.auth.signOut();
    ["mt_plan","mt_sessions_used","mt_safety_accepted","mt_terms_accepted_at","mt_age_confirmed_at","mt_session_state","mt_referral_code"].forEach(k => localStorage.removeItem(k));
    setView("landing");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem("mt_user_id");
    localStorage.removeItem("mt_user_email");
    localStorage.removeItem("mt_plan");
    localStorage.removeItem("mt_sessions_used");
    setPlan(null);
    setSessionsUsed(0);
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
    else if (safetyReturn === "fastEntry") generateFastEntry(fastEntryText);
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
      console.log("Loading sessions for:", user?.email);
      const res = await fetch(`${BACKEND_URL}/sessions`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      console.log("Sessions response:", data);
      if (!data.success) console.error("[sessions] Fetch error:", data.error);
      setSessions(data.sessions || []);
    } catch (e) {
      console.error("[sessions] Network error:", e.message);
    }
    setSessionsLoading(false);
  }

  async function openSession(id) {
    console.log(`[openSession] Loading session_id=${id}`);
    setSessionDetailLoading(true);
    setSessionDetailError("");
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/sessions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const errText = await res.text();
        console.error(`[openSession] HTTP ${res.status} for session_id=${id}: ${errText}`);
        setSessionDetailError("Could not load this session. Please try again.");
        return;
      }
      const data = await res.json();
      console.log(`[openSession] session_id=${id} — success=${data.success}, error="${data.error}", session keys=${data.session ? Object.keys(data.session).join(",") : "none"}`);
      if (data.session) {
        const s = data.session;
        const missing = ["id", "title", "script"].filter(f => !s[f]);
        if (missing.length > 0) {
          console.error(`[openSession] session_id=${id} missing required fields: ${missing.join(", ")}; received:`, JSON.stringify(s));
          setSessionDetailError("Could not load this session. Please try again.");
          return;
        }
        // Audio is streamed directly from the dedicated endpoint — no base64 parsing needed.
        // The token is passed as a query param so the <audio> element can use the URL as-is.
        const audioUrl = `${BACKEND_URL}/sessions/${id}/audio?token=${encodeURIComponent(token)}`;
        setSelectedSession({ ...s, audioUrl, audioError: false });
        setView("sessionDetail");
      } else {
        console.error(`[openSession] No session in response for session_id=${id} — error="${data.error}", full response:`, JSON.stringify(data));
        setSessionDetailError("Could not load this session. Please try again.");
      }
    } catch (e) {
      console.error(`[openSession] Exception for session_id=${id}:`, e.message, e);
      setSessionDetailError("Network error loading session. Please try again.");
    } finally {
      setSessionDetailLoading(false);
    }
  }

  async function deleteSession(id) {
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/sessions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setSessions(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      console.error("[deleteSession] Error:", e.message);
    }
    setDeleteConfirmId(null);
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

  function stopBgPreview() {
    clearTimeout(bgPreviewTimerRef.current);
    if (bgPreviewAudioRef.current) {
      bgPreviewAudioRef.current.pause();
      bgPreviewAudioRef.current.onended = null;
      bgPreviewAudioRef.current = null;
    }
    if (bgPreviewCtxRef.current) {
      bgPreviewCtxRef.current.close().catch(() => {});
      bgPreviewCtxRef.current = null;
    }
    setBgPreviewPlaying(null);
    setBgPreviewLoading(null);
  }

  function previewBackground(bgName) {
    if (bgPreviewPlaying === bgName) { stopBgPreview(); return; }
    stopBgPreview();

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      const ctx = new AudioCtx();
      bgPreviewCtxRef.current = ctx;
      const now = ctx.currentTime;

      // Master output gain — previews use the same audio graph as the real player
      // but delegate to buildBackgroundNodes so both stay in sync automatically.
      const gain = ctx.createGain();
      gain.gain.value = 0.18;
      gain.connect(ctx.destination);

      // Reuse the exact same graph-building logic used during real sessions
      buildBackgroundNodes(ctx, bgName, gain);

      setBgPreviewPlaying(bgName);
      // Fade out over last 2 s of the 15-second preview
      gain.gain.setValueAtTime(gain.gain.value, now + 13);
      gain.gain.linearRampToValueAtTime(0, now + 15);
      bgPreviewTimerRef.current = setTimeout(() => stopBgPreview(), 15000);
    } catch (e) {
      console.error("Background preview error:", e);
    }
  }

  async function generate(bodyOverrides = null) {
    // Admin always has unlimited access — skip all payment checks
    const adminUser = user?.email === import.meta.env.VITE_ADMIN_EMAIL;
    // Anonymous users never have a paid plan regardless of localStorage
    const effectivePlan = user?.is_anonymous ? null : plan;
    // Free session limit: 1 session lifetime for guest / unsubscribed users
    if (!adminUser && !effectivePlan && sessionsUsed >= 1) {
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
    setGenStep(0);
    setSseChunk(0);
    setSseTotalChunks(0);
    setSseMessage("");
    try {
      const token = await getToken();
      const body = JSON.stringify({
        name: form.name, goal: form.goal, program: form.program, voice: form.voice,
        background: form.background, length: form.length, style: form.style,
        personalization: form.personalization, fears: form.fears, motivation: form.motivation,
        idealLife: form.idealLife, deepQ1: form.deepQ1, deepQ2: form.deepQ2,
        deepQ3: form.deepQ3, deepQ4: form.deepQ4,
        affirmationStyle: form.affirmationStyle, backgroundIntensity: form.backgroundIntensity,
        pace: form.pace || "slow",
        guestId: user?.is_anonymous ? localStorage.getItem("mt_guest_id") : undefined,
        ...(bodyOverrides || {}),
      });
      const response = await fetch(`${BACKEND_URL}/generate-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "text/event-stream" },
        body,
      });

      const isSSE = response.headers.get("content-type")?.includes("text/event-stream");

      if (isSSE && response.ok) {
        // SSE streaming path — drive the progress UI from real backend events.
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let done = false;

        while (!done) {
          const { done: streamDone, value } = await reader.read();
          if (streamDone) break;
          buf += decoder.decode(value, { stream: true });
          const parts = buf.split("\n\n");
          buf = parts.pop() ?? "";

          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data: ")) continue;
            let ev;
            try { ev = JSON.parse(line.slice(6)); } catch { continue; }

            if (ev.message) setSseMessage(ev.message);

            if (ev.stage === "script_generating" || ev.stage === "script_expanding") {
              setGenStep(0);
            } else if (ev.stage === "synthesizing") {
              setGenStep(1);
              setSseChunk(ev.chunk || 0);
              setSseTotalChunks(ev.totalChunks || 0);
            } else if (ev.stage === "remuxing" || ev.stage === "saving") {
              setGenStep(2);
            } else if (ev.stage === "complete") {
              const newUsed = sessionsUsed + 1;
              localStorage.setItem("mt_sessions_used", String(newUsed));
              setSessionsUsed(newUsed);
              const audioUrl = ev.sessionId && !ev.audioUnavailable
                ? (ev.audioUrl || `${BACKEND_URL}/sessions/${ev.sessionId}/audio?token=${encodeURIComponent(token)}`)
                : null;
              console.log("[generate/sse] sessionId:", ev.sessionId, "audioUnavailable:", ev.audioUnavailable, "audioUrl set:", !!audioUrl, "storage:", !!ev.audioUrl);
              setResult({ script: ev.script, audioUrl, audioUnavailable: ev.audioUnavailable || !ev.sessionId, inferred_program: ev.inferred_program || null, technique: ev.technique || null });
              if (ev.inferred_program) {
                setForm(f => ({ ...f, program: ev.inferred_program, voice: VOICE_RECOMMENDATION[ev.inferred_program] || DEFAULT_VOICE_RECOMMENDATION }));
              }
              if (audioUrl) setAudioPulse(true);
              setView("result");
              if (newUsed === 1) setShowInstallBanner(true);
              done = true;
              break;
            } else if (ev.stage === "error") {
              if (ev.error === "topic_blocked") { setTopicBlocked(true); done = true; break; }
              throw new Error(ev.message || "Generation failed. Please try again.");
            }
          }
        }

        if (!done) throw new Error("Session generation was interrupted. Please try again.");
        return;
      }

      // JSON fallback path (non-SSE response or non-ok status).
      const data = await response.json();
      if (data.script) {
        const newUsed = sessionsUsed + 1;
        localStorage.setItem("mt_sessions_used", String(newUsed));
        setSessionsUsed(newUsed);
        const audioUrl = data.sessionId && !data.audioUnavailable
          ? (data.audioUrl || `${BACKEND_URL}/sessions/${data.sessionId}/audio?token=${encodeURIComponent(token)}`)
          : null;
        console.log("[generate] sessionId:", data.sessionId, "audioUnavailable:", data.audioUnavailable, "audioUrl set:", !!audioUrl, "storage:", !!data.audioUrl);
        setResult({ script: data.script, audioUrl, audioUnavailable: data.audioUnavailable || !data.sessionId });
        if (audioUrl) setAudioPulse(true);
        setView("result");
        if (newUsed === 1) setShowInstallBanner(true);
        return;
      }
      if (data.error === "topic_blocked") { setTopicBlocked(true); return; }
      if (data.error === "guest_limit") { setView("payment"); return; }
      throw new Error(typeof data.error === "string" ? data.error : "Generation failed. Please try again.");
    } catch (e) {
      const isNetwork = e instanceof TypeError && e.message.toLowerCase().includes("fetch");
      setError(isNetwork
        ? "Could not reach the server. Check your connection and try again."
        : (e.message || "Something went wrong. Please try again."));
      setView("genError");
    } finally {
      setGenerating(false);
    }
  }

  function generateFastEntry(text) {
    generate({
      name: form.name.trim() || undefined,
      free_text_intent: text,
      goal: text,
      program: "Stress & Anxiety",
      voice: "Female Calm",
      background: "432 Hz",
      length: "10",
      style: "Gentle Meditation",
      pace: "slow",
      affirmationStyle: "You are",
      backgroundIntensity: "Subtle",
      personalization: "",
      fears: "", motivation: "", idealLife: "",
      deepQ1: "", deepQ2: "", deepQ3: "", deepQ4: "",
    });
  }

  function goNext() {
    const s = steps[step];
    if (s.type === "input") {
      if (!form[s.id].trim()) { setError("Please fill this in to continue."); return; }
    } else if (s.type === "personalization") {
      // All fields optional — always allow proceeding
    } else {
      if (!form[s.id]) { setError("Please choose an option."); return; }
    }
    setError("");
    stopBgPreview();
    // Show listening instructions after background selection (once per user)
    if (s.id === "background" && !localStorage.getItem("mt_headphones_reminder")) {
      setBgInstructionsChecked(false);
      setView("bgInstructions");
      return;
    }
    if (step < steps.length - 1) setStep((p) => p + 1);
    else generate();
  }

  function goBack() {
    setError("");
    stopBgPreview();
    if (step === 0) setView("home");
    else setStep((p) => p - 1);
  }

  // ── WL ADMIN FUNCTIONS (component-level to avoid hook violations) ────────────
  async function loadWlAdmin() {
    if (!user) { setView("auth"); return; }
    setWlAdminBusy(true); setWlAdminMsg("");
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/whitelabel/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setWlAdmin(data);
        setWlAdminEdit({
          brand_name:     data.account.brand_name     || "",
          brand_color:    data.account.brand_color    || "#a8d8c8",
          brand_logo_url: data.account.brand_logo_url || "",
          custom_domain:  data.account.custom_domain  || "",
        });
      } else {
        setWlAdminMsg(data.error || "No white label account found.");
      }
    } catch { setWlAdminMsg("Failed to load account."); }
    setWlAdminBusy(false);
  }

  async function saveWlAdmin(e) {
    e.preventDefault();
    if (!wlAdmin) return;
    setWlAdminBusy(true); setWlAdminMsg("");
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/whitelabel/${wlAdmin.account.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(wlAdminEdit),
      });
      const data = await res.json();
      if (data.success) {
        setWlAdmin((prev) => ({ ...prev, account: data.account }));
        setWlAdminMsg("Saved successfully.");
      } else {
        setWlAdminMsg(data.error || "Save failed.");
      }
    } catch { setWlAdminMsg("Save failed."); }
    setWlAdminBusy(false);
  }

  // ── TESTIMONIAL FUNCTIONS ─────────────────────────────────────────────────
  async function fetchTestimonials() {
    try {
      const res = await fetch(`${BACKEND_URL}/testimonials`);
      const data = await res.json();
      if (data.success && data.testimonials.length > 0) setTestimonials(data.testimonials);
    } catch {}
  }

  // ── REFERRAL FUNCTIONS ────────────────────────────────────────────────────
  async function fetchReferralStats() {
    if (!user) return;
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/referral/code/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setReferralCode(data.code);
        setReferralStats({ total: data.total, joined: data.joined, monthsEarned: data.monthsEarned });
      }
    } catch {}
  }

  async function fetchBlogPosts() {
    setBlogLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/blog/posts`);
      const data = await res.json();
      if (data.success) setBlogPosts(data.posts || []);
    } catch {}
    setBlogLoading(false);
  }

  async function fetchBlogPost(slug) {
    setBlogLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/blog/posts/${encodeURIComponent(slug)}`);
      const data = await res.json();
      if (data.success) setBlogPost(data.post);
    } catch {}
    setBlogLoading(false);
  }

  async function fetchContentItems() {
    setContentLoading(true);
    setContentError("");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const token = await getToken();
      const params = new URLSearchParams({ limit: "150" });
      if (contentFilter.type)   params.set("type", contentFilter.type);
      if (contentFilter.status) params.set("status", contentFilter.status);
      const res = await fetch(`${BACKEND_URL}/admin/content?${params}`, {
        headers: { "Authorization": `Bearer ${token}` },
        signal: controller.signal,
      });
      const data = await res.json();
      if (data.success) {
        setContentItems(data.items || []);
      } else {
        console.error("[admin/content] fetch error response:", data);
        setContentError(data.error || `HTTP ${res.status}`);
      }
    } catch (err) {
      console.error("[admin/content] fetch exception:", err.message);
      setContentError(err.name === "AbortError" ? "Request timed out — backend may be down" : err.message);
    } finally {
      clearTimeout(timer);
      setContentLoading(false);
    }
  }

  async function fetchBlogAdminPosts() {
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/admin/blog`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setBlogAdminPosts(data.posts || []);
    } catch {}
  }

  async function updateContentStatus(id, status) {
    const token = await getToken();
    await fetch(`${BACKEND_URL}/admin/content/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setContentItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  }

  async function publishBlogPost(id) {
    const token = await getToken();
    await fetch(`${BACKEND_URL}/admin/blog/${id}/publish`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` },
    });
    setBlogAdminPosts(prev => prev.map(p => p.id === id ? { ...p, status: "published" } : p));
  }

  function submitRating() {
    if (!ratingVal) return;
    setRatingState("done");
    clearTimeout(ratingTimerRef.current);
  }

  if (!authReady) return null;

  const modal = legalModal ? <LegalModal type={legalModal} onClose={() => setLegalModal(null)} /> : null;
  const footer = <Footer onOpenModal={setLegalModal} onNav={setView} onHowToUse={() => { setSafetyReturn("home"); setView("safety"); }} />;

  const topicBlockedModal = topicBlocked ? (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
      onClick={() => { setTopicBlocked(false); setView("home"); }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#0d1030", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "2rem 1.75rem", maxWidth: 480, width: "100%" }}
      >
        <div style={{ fontSize: "1.1rem", fontWeight: 300, color: "#e8e6f0", marginBottom: "0.75rem", letterSpacing: "0.04em" }}>
          This topic is outside our scope
        </div>
        <div style={{ fontSize: "0.87rem", color: "#a8a5b8", lineHeight: 1.75, marginBottom: "0.5rem" }}>
          Mind Tranceform focuses on relaxation, personal growth, and general wellness. For the topic you entered, we'd recommend speaking with a licensed therapist or counselor who can provide the right level of support.
        </div>
        <div style={{ fontSize: "0.87rem", color: "#a8a5b8", lineHeight: 1.75, marginBottom: "1.75rem" }}>
          You're welcome to try a different focus — things like sleep, stress relief, confidence, or abundance work beautifully here.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          <button
            style={{ ...S.btnPrimary, width: "100%" }}
            onClick={() => { setTopicBlocked(false); setView("home"); setStep(0); }}
          >
            Try a different topic ✦
          </button>
          <a
            href="https://www.psychologytoday.com/us/therapists"
            target="_blank"
            rel="noreferrer"
            style={{ ...S.btn, display: "block", textAlign: "center", textDecoration: "none", width: "100%", boxSizing: "border-box" }}
          >
            Find a therapist (Psychology Today)
          </a>
        </div>
        <div style={{ marginTop: "1.25rem", fontSize: "0.76rem", color: "#8a879e", textAlign: "center" }}>
          Need help? <a href="mailto:support@mindtranceformapp.com" style={{ color: "#a8d8c8", textDecoration: "underline" }}>support@mindtranceformapp.com</a>
        </div>
      </div>
    </div>
  ) : null;

  // ── LEGAL PAGES ──
  if (view === "terms")       return <TermsPage       onBack={() => window.history.length > 1 ? window.history.back() : setView("landing")} />;
  if (view === "privacy")     return <PrivacyPage     onBack={() => window.history.length > 1 ? window.history.back() : setView("landing")} />;
  if (view === "cookies")     return <CookiesPage     onBack={() => window.history.length > 1 ? window.history.back() : setView("landing")} />;
  if (view === "privacyData") return <PrivacyDataPage onBack={() => window.history.length > 1 ? window.history.back() : setView("home")} />;

  // ── LANDING ──
  if (view === "landing") {
    const PROGRAMS = [
      { icon: "🌙", label: "Sleep",               sub: "Deep rest & nighttime calm" },
      { icon: "🌊", label: "Stress & Anxiety",    sub: "Quiet the mind, steady the body" },
      { icon: "✨", label: "Abundance",            sub: "Expand into success & possibility" },
      { icon: "⚡", label: "Confidence",           sub: "Step into your power" },
      { icon: "🎯", label: "Focus",                sub: "Clear mind, sharp execution" },
      { icon: "🦋", label: "Weight Loss Mindset",  sub: "Reshape how you see yourself" },
    ];
    const STEPS = [
      { n: "1", title: "Tell us your goal",      body: "Answer a few quick questions — your name, what you want to release or achieve, your preferred voice and background sound." },
      { n: "2", title: "AI creates your session", body: "We write a personalized script using your name and goal, voice it with AI, and layer in your chosen healing frequency or nature sound." },
      { n: "3", title: "Listen and transform",   body: "Your session is ready in under 60 seconds. Listen in the app, download the MP3, and replay anytime." },
    ];
    const PLANS = [
      { label: "Free",    price: "$0",      period: "",    sub: "1 personalized session · 5 min",        accent: "#8a879e" },
      { label: "Single",  price: "$14.99",  period: "",    sub: "1 premium session · 5 min",             accent: "#8a879e" },
      { label: "Premium", price: "$19.99",  period: "/mo", sub: "Unlimited sessions · up to 15 min",     accent: "#a8d8c8" },
      { label: "Pro",     price: "$29.99",  period: "/mo", sub: "Unlimited sessions · up to 30 min",     accent: "#c9a8d8" },
    ];
    const PLACEHOLDERS = [
      { user_name: "Sarah",   program: "Sleep",            rating: 5, message: "Hearing my name in the meditation changed everything. It felt like it was made just for me." },
      { user_name: "James",   program: "Stress & Anxiety", rating: 5, message: "I've tried every meditation app. This is the first one that actually feels personal." },
      { user_name: "Maria",   program: "Sleep",            rating: 5, message: "I listen every night before bed. My sleep has completely changed in 3 weeks." },
    ];
    const reviews = PLACEHOLDERS;
    const lbl = (text) => (
      <div style={{ fontSize: "0.65rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#8a879e", marginBottom: "1.25rem", marginTop: "0.25rem" }}>{text}</div>
    );
    return (
      <div style={S.root}>
        <StarField />
        <div style={S.wrap}>
          {/* ── Hero ── */}
          <Logo sub brand={whiteLabel} />
          <div style={{ textAlign: "center", padding: "0.5rem 0 2.5rem" }}>
            <div style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: 300, lineHeight: 1.35, color: "#e8e6f0", marginBottom: "1rem", letterSpacing: "0.02em" }}>
              Your name. Your goal.<br />Your session.
            </div>
            <div style={{ fontSize: "0.92rem", color: "#8a879e", lineHeight: 1.75, marginBottom: "2rem", maxWidth: 400, margin: "0 auto 2rem" }}>
              Personalized AI meditation and hypnosis — written for you, voiced by AI, ready in under 60 seconds.
            </div>
            <button
              style={{ ...S.btnPrimary, padding: "0.9rem 2rem", fontSize: "1rem", letterSpacing: "0.06em", display: "inline-block", width: "auto", minWidth: 220 }}
              onClick={() => { setAuthMode("signup"); setView("auth"); }}
            >
              Start Free Session ✦
            </button>
            <div style={{ fontSize: "0.7rem", color: "#8a879e", marginTop: "0.7rem", letterSpacing: "0.06em" }}>
              No credit card needed · First session free
            </div>
          </div>

          {/* ── How it works ── */}
          <div style={S.card}>
            {lbl("How it works")}
            {STEPS.map((s) => (
              <div key={s.n} style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: "0.5px solid rgba(168,216,200,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", color: "#a8d8c8", flexShrink: 0, marginTop: 2 }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: "0.92rem", color: "#e8e6f0", marginBottom: "0.25rem" }}>{s.title}</div>
                  <div style={{ fontSize: "0.82rem", color: "#8a879e", lineHeight: 1.65 }}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── What it helps with ── */}
          {lbl("What it helps with")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "2rem" }}>
            {PROGRAMS.map((p) => (
              <div key={p.label} style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "0.85rem 1rem", display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <span style={{ fontSize: 18 }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "#e8e6f0" }}>{p.label}</div>
                  <div style={{ fontSize: "0.72rem", color: "#8a879e", marginTop: 1 }}>{p.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Pricing ── */}
          {lbl("Pricing")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "2rem" }}>
            {PLANS.map((p) => (
              <div key={p.label} style={{ background: "rgba(255,255,255,0.04)", border: `0.5px solid ${p.accent === "#8a879e" ? "rgba(255,255,255,0.08)" : p.accent}`, borderRadius: 12, padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: p.accent, marginBottom: "0.4rem" }}>{p.label}</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 300, color: "#e8e6f0" }}>{p.price}<span style={{ fontSize: "0.72rem", color: "#8a879e" }}>{p.period}</span></div>
                <div style={{ fontSize: "0.72rem", color: "#8a879e", lineHeight: 1.5, marginTop: "0.4rem" }}>{p.sub}</div>
              </div>
            ))}
          </div>
          <button
            style={{ ...S.btnPrimary, width: "100%", marginBottom: "2rem" }}
            onClick={() => { setAuthMode("signup"); setView("auth"); }}
          >
            Start Free — No Card Needed ✦
          </button>

          {/* ── Testimonials ── */}
          {lbl("What people are saying")}
          <div style={{ display: "grid", gap: "0.65rem", marginBottom: "2rem" }}>
            {reviews.map((t, i) => (
              <div key={i} style={{ ...S.card, padding: "1rem 1.1rem", margin: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <div style={{ display: "flex", gap: 1 }}>
                    {[1,2,3,4,5].map((n) => <span key={n} style={{ color: n <= t.rating ? "#d4b896" : "rgba(255,255,255,0.15)", fontSize: "0.7rem" }}>★</span>)}
                  </div>
                  <span style={{ fontSize: "0.68rem", color: "#8a879e", letterSpacing: "0.08em" }}>{t.user_name} · {t.program}</span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#c8c5d8", lineHeight: 1.65, fontStyle: "italic" }}>"{t.message}"</div>
              </div>
            ))}
          </div>

          {/* ── Sign in link ── */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <button style={S.resetBtn} onClick={() => { setAuthMode("login"); setView("auth"); }}>
              Already have an account? Sign in
            </button>
          </div>

          {footer}
        </div>
        {modal}
      </div>
    );
  }

  // ── AUTH ──
  if (view === "auth") return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo sub brand={whiteLabel} />
        <div style={S.card}>
          {signupConfirmSent ? (
            <>
              {/* ── Confirmation sent screen ── */}
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "rgba(168,216,200,0.15)", border: "1.5px solid rgba(168,216,200,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", margin: "0 auto 1rem",
                }}>✓</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 300, color: "#e8e6f0", marginBottom: "0.5rem" }}>
                  Check your email
                </div>
                <div style={{ fontSize: "0.85rem", color: "#8a879e", lineHeight: 1.6 }}>
                  We sent a confirmation link to
                </div>
                <div style={{ fontSize: "0.9rem", color: "#a8d8c8", marginTop: "0.3rem", wordBreak: "break-all" }}>
                  {authEmail}
                </div>
                <div style={{ fontSize: "0.82rem", color: "#8a879e", marginTop: "0.75rem", lineHeight: 1.6 }}>
                  Click the link to activate your account,<br />then come back here to sign in.
                </div>
              </div>
              {resendStatus === "sent" && (
                <div style={{ ...S.infoBox, marginBottom: "0.75rem" }}>Confirmation email resent ✓</div>
              )}
              {resendStatus === "error" && (
                <div style={{ ...S.errorBox, marginBottom: "0.75rem" }}>Failed to resend — try again in a moment.</div>
              )}
              <button
                style={{ ...S.btnPrimary, width: "100%", marginBottom: "0.75rem", opacity: resendStatus === "sending" ? 0.5 : 1 }}
                onClick={handleResendConfirmation}
                disabled={resendStatus === "sending"}
              >
                {resendStatus === "sending" ? "Sending..." : "Resend confirmation email"}
              </button>
              <div style={{ textAlign: "center" }}>
                <button style={S.resetBtn} onClick={() => {
                  setSignupConfirmSent(false);
                  setAuthMode("login");
                  setAuthError("");
                  setResendStatus("");
                }}>
                  ← Back to Sign In
                </button>
              </div>
            </>
          ) : authForgot ? (
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
              {authMode === "login" ? (
                <>
                  <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "1.5rem", textAlign: "center" }}>
                    Welcome back
                  </div>
                  {authError && (
                    <div style={authError.includes("Check your email") ? S.infoBox : S.errorBox}>{authError}</div>
                  )}
                  <form onSubmit={handleAuth}>
                    <input style={{ ...S.input, marginBottom: "0.75rem" }} type="email" placeholder="Email"
                      value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required autoFocus />
                    <input style={{ ...S.input, marginBottom: "0.4rem" }}
                      type="password" placeholder="Password (min 6 characters)"
                      value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
                    <div style={{ textAlign: "right", marginBottom: "1.25rem" }}>
                      <button type="button" style={{ ...S.resetBtn, fontSize: "0.78rem" }}
                        onClick={() => { setAuthForgot(true); setAuthError(""); }}>
                        Forgot password?
                      </button>
                    </div>
                    <button style={{ ...S.btnPrimary, width: "100%" }} type="submit" disabled={authBusy}>
                      {authBusy ? "..." : "Sign In"}
                    </button>
                  </form>
                  <div style={S.freeTag}>✦ Your first session is free. No card needed.</div>
                  <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
                    <button style={S.resetBtn} onClick={() => { setAuthMode("signup"); setAuthError(""); }}>
                      No account? Sign up free
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
              ) : (
                <>
                  {/* ── Signup: guest-first hierarchy ── */}
                  <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "1.5rem", textAlign: "center" }}>
                    Start your free session
                  </div>
                  {authError && (
                    <div style={authError.includes("Check your email") ? S.infoBox : S.errorBox}>{authError}</div>
                  )}
                  {/* Primary CTA — guest path */}
                  <button
                    style={{ ...S.btnPrimary, width: "100%" }}
                    onClick={handleGuestLogin}
                    disabled={authBusy}
                  >
                    {authBusy ? "..." : "Start Free Session →"}
                  </button>
                  <div style={{ fontSize: "0.78rem", color: "#8a879e", textAlign: "center", marginTop: "0.6rem", marginBottom: "1.5rem" }}>
                    No card needed · No account required
                  </div>
                  <div style={{ height: "0.5px", background: "rgba(255,255,255,0.07)", margin: "0 0 1.25rem 0" }} />
                  {/* Secondary — sign in */}
                  <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
                    <button style={S.resetBtn} onClick={() => { setAuthMode("login"); setAuthError(""); }}>
                      Already have an account? Sign in
                    </button>
                  </div>
                  {/* Tertiary — create account (collapsible) */}
                  <div style={{ textAlign: "center" }}>
                    <button
                      style={{ ...S.resetBtn, fontSize: "0.78rem", color: "#8a879e" }}
                      onClick={() => setShowCreateAccount((v) => !v)}
                    >
                      {showCreateAccount ? "▲ Hide" : "Want to save your sessions? Create an account →"}
                    </button>
                  </div>
                  {showCreateAccount && (
                    <form onSubmit={handleAuth} style={{ marginTop: "1rem" }}>
                      <input style={{ ...S.input, marginBottom: "0.75rem" }} type="email" placeholder="Email"
                        value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required autoFocus />
                      <input style={{ ...S.input, marginBottom: "1rem" }}
                        type="password" placeholder="Password (min 6 characters)"
                        value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
                      <div
                        style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", marginBottom: "0.85rem" }}
                        onClick={() => setTermsChecked((v) => !v)}
                      >
                        <div style={{
                          width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2,
                          border: termsChecked ? "none" : "1.5px solid rgba(168,216,200,0.4)",
                          background: termsChecked ? "#a8d8c8" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, color: "#07091a", transition: "all 0.2s",
                        }}>
                          {termsChecked ? "✓" : ""}
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "#8a879e", lineHeight: 1.55 }}>
                          I agree to the{" "}
                          <span style={{ color: "#a8d8c8", textDecoration: "underline", cursor: "pointer" }}
                            onClick={(e) => { e.stopPropagation(); setLegalModal("terms"); }}>Terms of Service</span>
                          {", "}
                          <span style={{ color: "#a8d8c8", textDecoration: "underline", cursor: "pointer" }}
                            onClick={(e) => { e.stopPropagation(); setLegalModal("privacy"); }}>Privacy Policy</span>
                          {", and "}
                          <span style={{ color: "#a8d8c8", textDecoration: "underline", cursor: "pointer" }}
                            onClick={(e) => { e.stopPropagation(); setLegalModal("disclaimer"); }}>Clinical Disclaimer</span>
                        </span>
                      </div>
                      <div
                        style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", marginBottom: "1.25rem" }}
                        onClick={() => setAgeConfirmed((v) => !v)}
                      >
                        <div style={{
                          width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2,
                          border: ageConfirmed ? "none" : "1.5px solid rgba(168,216,200,0.4)",
                          background: ageConfirmed ? "#a8d8c8" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, color: "#07091a", transition: "all 0.2s",
                        }}>
                          {ageConfirmed ? "✓" : ""}
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "#8a879e", lineHeight: 1.55 }}>
                          I confirm I am <strong style={{ color: "#e8e6f0" }}>18 years of age or older</strong>
                        </span>
                      </div>
                      <button
                        style={{ ...S.btnPrimary, width: "100%", opacity: (!termsChecked || !ageConfirmed) ? 0.4 : 1, cursor: (!termsChecked || !ageConfirmed) ? "not-allowed" : "pointer" }}
                        type="submit"
                        disabled={authBusy || !termsChecked || !ageConfirmed}
                      >
                        {authBusy ? "..." : "Create Account"}
                      </button>
                    </form>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Testimonials */}

        {(() => {
          const PLACEHOLDERS = [
            { user_name: "Sarah",   program: "Sleep",            rating: 5, message: "Hearing my name in the meditation changed everything. It felt like it was made just for me." },
            { user_name: "James",   program: "Stress & Anxiety", rating: 5, message: "I've tried every meditation app. This is the first one that actually feels personal." },
            { user_name: "Maria",   program: "Sleep",            rating: 5, message: "I listen every night before bed. My sleep has completely changed in 3 weeks." },
            { user_name: "David",   program: "Abundance",        rating: 4, message: "The abundance session is powerful. I listen every morning before work." },
            { user_name: "Lisa",    program: "Stress & Anxiety", rating: 5, message: "I was skeptical about hypnosis but this is genuinely relaxing and effective." },
            { user_name: "Michael", program: "Stress & Anxiety", rating: 5, message: "My therapist recommended trying this alongside our sessions. Best decision." },
          ];
          const items = testimonials.length > 0 ? testimonials : PLACEHOLDERS;
          return (
            <div style={{ marginTop: "2rem", paddingBottom: "1rem" }}>
              <div style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#8a879e", textAlign: "center", marginBottom: "1rem" }}>
                What people are saying
              </div>
              <div style={{ display: "grid", gap: "0.65rem" }}>
                {items.slice(0, 6).map((t, i) => (
                  <div key={i} style={{ ...S.card, padding: "1rem 1.1rem", margin: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                      <div style={{ display: "flex", gap: 1 }}>
                        {[1,2,3,4,5].map((n) => (
                          <span key={n} style={{ color: n <= t.rating ? "#d4b896" : "rgba(255,255,255,0.15)", fontSize: "0.7rem" }}>★</span>
                        ))}
                      </div>
                      <span style={{ fontSize: "0.68rem", color: "#8a879e", letterSpacing: "0.08em" }}>
                        {t.user_name} · {t.program}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#c8c5d8", lineHeight: 1.65, fontStyle: "italic" }}>
                      "{t.message}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
        {footer}
      </div>
      {modal}
      {topicBlockedModal}
    </div>
  );

  // ── GENERATING ──
  const GEN_STEPS = ["Writing your script...", "Creating your voice...", "Mixing your audio..."];
  if (generating) return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo brand={whiteLabel} />
        <div style={S.card}>
          <div style={S.genWrap}>
            <PulseRing />
            <div style={S.genTitle}>Creating your session</div>
            <div style={S.genSub}>Personalizing for {form.name || "you"}</div>
            <div style={{ marginTop: "2rem", textAlign: "left", display: "inline-block", width: "100%", maxWidth: 280 }}>
              {GEN_STEPS.map((label, i) => (
                <div key={i} style={{ marginBottom: "0.9rem", opacity: i <= genStep ? 1 : 0.25, transition: "opacity 0.5s ease" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
                  {i === 1 && genStep === 1 && sseTotalChunks > 0 && (
                    <div style={{ marginLeft: 32, marginTop: 6 }}>
                      <div style={{ height: 4, background: "rgba(168,216,200,0.15)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.round((sseChunk / sseTotalChunks) * 100)}%`, background: "#a8d8c8", borderRadius: 2, transition: "width 0.4s ease" }} />
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#8a879e", marginTop: 3 }}>{sseChunk} of {sseTotalChunks} voice segments</div>
                    </div>
                  )}
                  {i === genStep && sseMessage && (
                    <div style={{ marginLeft: 32, marginTop: 4, fontSize: "0.72rem", color: "#8a879e" }}>{sseMessage}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {footer}
      </div>
      {modal}
    </div>
  );

  // ── RESULT ──
  if (view === "result" && result) {
    const tags = [form.program, form.voice, form.background].filter(Boolean);
    return (
      <div style={S.root}>
        <style>{`
          @keyframes audioGlow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(168,216,200,0); }
            50% { box-shadow: 0 0 14px 5px rgba(168,216,200,0.35); }
          }
          .audio-pulse { animation: audioGlow 1.2s ease-in-out 3; border-radius: 12px; }
        `}</style>
        <StarField />
        <div style={S.wrap}>
          <Logo brand={whiteLabel} />
          <div style={S.card}>
            <div style={{ fontSize: "1.5rem", fontWeight: 300, marginBottom: "0.4rem" }}>
              Your session is ready{form.name ? `, ${form.name}` : ""}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#8a879e", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Personalized {form.program} · {form.voice}
            </div>
            <div style={S.tagRow}>{tags.map((t) => <div key={t} style={S.tag}>{t}</div>)}</div>
            {result.inferred_program && (
              <div style={{ fontSize: "0.82rem", color: "#8a879e", textAlign: "center", marginBottom: "1rem", lineHeight: 1.6 }}>
                We built you a <strong style={{ color: "#e8e6f0" }}>{result.inferred_program.toLowerCase()}</strong> session.{" "}
                <button
                  style={{ background: "none", border: "none", color: "#a8d8c8", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontSize: "inherit", padding: 0 }}
                  onClick={() => { setStep(0); setForm(EMPTY_FORM); setError(""); setResult(null); setView("quiz"); }}
                >
                  Set up my profile for better sessions →
                </button>
              </div>
            )}
            {result.technique && (
              <div style={{ marginBottom: "1rem", position: "relative" }}>
                <button
                  onClick={() => setTechniqueTooltipOpen(v => !v)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    background: "rgba(201,168,216,0.08)", border: "0.5px solid rgba(201,168,216,0.3)",
                    borderRadius: 20, padding: "0.3rem 0.75rem",
                    color: "#c9a8d8", fontSize: "0.75rem", cursor: "pointer",
                    fontFamily: "inherit", letterSpacing: "0.03em",
                  }}
                >
                  {result.technique}
                </button>
                {techniqueTooltipOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 0.5rem)", left: 0, right: 0,
                    background: "rgba(15,17,35,0.97)", border: "0.5px solid rgba(201,168,216,0.25)",
                    borderRadius: 10, padding: "0.85rem 1rem",
                    fontSize: "0.78rem", color: "#c8c5d8", lineHeight: 1.65, zIndex: 10,
                  }}>
                    {TECHNIQUE_TOOLTIPS[result.technique] || result.technique}
                    <button
                      onClick={() => setTechniqueTooltipOpen(false)}
                      style={{ display: "block", marginTop: "0.5rem", background: "none", border: "none", color: "#8a879e", cursor: "pointer", fontSize: "0.72rem", fontFamily: "inherit", padding: 0 }}
                    >
                      ✕ Close
                    </button>
                  </div>
                )}
              </div>
            )}
            {result.audioUrl && (
              <div style={{
                background: "rgba(168,216,200,0.06)",
                border: "0.5px solid rgba(168,216,200,0.3)",
                borderRadius: 12,
                padding: "1rem 1.25rem",
                marginBottom: "1.25rem",
                textAlign: "center",
                boxShadow: "0 0 24px rgba(168,216,200,0.07)",
              }}>
                <div style={{ fontSize: "0.92rem", color: "#a8d8c8", marginBottom: "0.35rem", letterSpacing: "0.02em" }}>
                  Press the play button below to begin your session.
                </div>
                <div style={{ fontSize: "0.78rem", color: "#8a879e", lineHeight: 1.65 }}>
                  For the best experience, use headphones and find a quiet, comfortable place to relax.
                </div>
              </div>
            )}
            {result.audioUrl
              ? <SessionAudioPlayer
                  src={result.audioUrl}
                  noteText="Your personalized audio session"
                  onPlay={() => {
                    setAudioPulse(false);
                    if (ratedSessionId === result.audioUrl) return;
                    clearTimeout(ratingTimerRef.current);
                    ratingTimerRef.current = setTimeout(() => {
                      setRatingState("prompt");
                      setRatingVal(0); setRatingMsg("");
                    }, 60000);
                  }}
                  onPause={() => clearTimeout(ratingTimerRef.current)}
                />
              : <div style={S.infoBox}>{result.audioUnavailable ? "Audio is temporarily unavailable — your personalized script is ready below." : "Your personalized script is ready below."}</div>
            }
            {form.background && (
              <BackgroundPlayer background={form.background} intensity={form.backgroundIntensity} />
            )}
            {["432 Hz", "528 Hz", "Theta Waves", "Delta Sleep"].includes(form.background) &&
              !localStorage.getItem("mt_headphones_reminder") && (
              <div style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                background: "rgba(168,216,200,0.06)", border: "0.5px solid rgba(168,216,200,0.2)",
                borderRadius: 10, padding: "0.7rem 1rem", marginBottom: "1rem",
                fontSize: "0.8rem", color: "#8a879e",
              }}>
                <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>🎧</span>
                <span>For best results, use headphones — especially for <strong style={{ color: "#a8d8c8" }}>{form.background}</strong></span>
              </div>
            )}
            <div style={S.scriptBox}>{renderScript(result.script)}</div>
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

            {/* ── Rating Prompt ── */}
            {ratingState === "prompt" && (
              <div style={{ ...S.infoBox, marginTop: "1.25rem", borderColor: "rgba(201,168,216,0.25)" }}>
                <div style={{ fontSize: "0.92rem", color: "#e8e6f0", marginBottom: "0.75rem" }}>How did your session feel?</div>
                <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginBottom: "0.75rem" }}>
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} onClick={() => setRatingVal(n)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.6rem",
                        color: n <= ratingVal ? "#d4b896" : "#8a879e", transition: "color 0.15s" }}>★</button>
                  ))}
                </div>
                <div style={S.row}>
                  <button style={S.btn} onClick={() => {
                    setRatingState("done");
                    setRatedSessionId(result?.audioUrl);
                    clearTimeout(ratingTimerRef.current);
                  }}>Skip</button>
                  <button style={{ ...S.btnPrimary, borderColor: "#c9a8d8", color: "#c9a8d8" }}
                    disabled={!ratingVal}
                    onClick={() => {
                      if (ratingVal >= 4) { setRatingState("message"); }
                      else { submitRating(); setRatedSessionId(result?.audioUrl); }
                    }}>
                    {ratingVal >= 4 || !ratingVal ? "Next →" : "Submit"}
                  </button>
                </div>
              </div>
            )}
            {ratingState === "message" && (
              <div style={{ ...S.infoBox, marginTop: "1.25rem", borderColor: "rgba(201,168,216,0.25)" }}>
                <div style={{ fontSize: "0.88rem", color: "#e8e6f0", marginBottom: "0.5rem" }}>Tell us about your experience</div>
                <div style={{ fontSize: "0.75rem", color: "#8a879e", marginBottom: "0.75rem" }}>
                  We may feature it on our site — first name only, anonymous.
                </div>
                <textarea style={{ ...S.input, minHeight: 72, resize: "vertical", marginBottom: "0.75rem" }}
                  placeholder="Your experience..."
                  value={ratingMsg}
                  onChange={(e) => setRatingMsg(e.target.value)} />
                <div style={S.row}>
                  <button style={S.btn} onClick={() => {
                    submitRating(); setRatedSessionId(result?.audioUrl);
                  }}>Skip</button>
                  <button style={{ ...S.btnPrimary, borderColor: "#c9a8d8", color: "#c9a8d8" }}
                    onClick={() => { submitRating(); setRatedSessionId(result?.audioUrl); }}>
                    Submit ✦
                  </button>
                </div>
              </div>
            )}
            {ratingState === "done" && (
              <div style={{ ...S.infoBox, marginTop: "1.25rem", borderColor: "rgba(168,216,200,0.2)", textAlign: "center" }}>
                <span style={{ color: "#a8d8c8", fontSize: "0.88rem" }}>✦ Thank you for your feedback</span>
              </div>
            )}
          </div>
          {footer}
        </div>
        {modal}
      </div>
    );
  }

  // ── PAYMENT / UPGRADE ──
  if (view === "payment") return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo brand={whiteLabel} />
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
        {footer}
      </div>
      {modal}
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
          <Logo brand={whiteLabel} />
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
              <div style={{ marginTop: "0.75rem", fontSize: "0.82rem", color: "#8a879e" }}>
                If you are struggling with your mental health, please reach out to a qualified professional.{" "}
                <span style={{ color: "#a8d8c8" }}>US Crisis Line: call or text <strong>988</strong></span> (Suicide &amp; Crisis Lifeline), available 24/7.
              </div>
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
          {footer}
        </div>
        {modal}
      </div>
    );
  }

  // ── SESSIONS LIST ──
  if (view === "sessions") return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo brand={whiteLabel} />
        <div style={S.card}>
          <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "1.25rem" }}>My Sessions</div>
          {sessionsLoading && (
            <div style={{ color: "#8a879e", textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: "1.4rem", animation: "spin 1s linear infinite", display: "inline-block" }}>◌</div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>Loading your sessions…</div>
            </div>
          )}
          {sessionDetailLoading && (
            <div style={{ color: "#a8d8c8", textAlign: "center", padding: "0.75rem 0", fontSize: "0.85rem" }}>
              Opening session…
            </div>
          )}
          {sessionDetailError && (
            <>
              <div style={S.errorBox}>{sessionDetailError}</div>
              <div style={{ fontSize: "0.76rem", color: "#8a879e", textAlign: "center", marginTop: "0.5rem" }}>
                Need help? <a href="mailto:support@mindtranceformapp.com" style={{ color: "#a8d8c8", textDecoration: "underline" }}>support@mindtranceformapp.com</a>
              </div>
            </>
          )}
          {!sessionsLoading && sessions.length === 0 && (
            <div style={{ color: "#8a879e", textAlign: "center", padding: "2rem 0" }}>No sessions yet. Generate your first one!</div>
          )}
          {sessions.map((s) => (
            <div key={s.id} style={{ ...S.sessionItem, opacity: sessionDetailLoading ? 0.5 : 1, pointerEvents: sessionDetailLoading ? "none" : "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer" }} onClick={() => openSession(s.id)}>
                <div>
                  <div style={{ fontSize: "0.92rem", color: "#e8e6f0" }}>{s.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "#8a879e", marginTop: 3 }}>{s.program} · {s.voice}</div>
                </div>
                <button
                  style={{ background: "none", border: "none", color: "#8a879e", cursor: "pointer", fontSize: "0.85rem", padding: "0 0 0 0.75rem", lineHeight: 1, flexShrink: 0 }}
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(s.id); }}
                  title="Delete session"
                >✕</button>
              </div>
              {deleteConfirmId === s.id && (
                <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "0.5px solid rgba(255,255,255,0.08)" }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ fontSize: "0.82rem", color: "#e8e6f0", marginBottom: "0.6rem" }}>Are you sure? This cannot be undone.</div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button style={{ ...S.btn, flex: 1, padding: "0.4rem", fontSize: "0.82rem", background: "rgba(232,135,100,0.12)", borderColor: "rgba(232,135,100,0.4)", color: "#e88764" }} onClick={() => deleteSession(s.id)}>Delete</button>
                    <button style={{ ...S.btn, flex: 1, padding: "0.4rem", fontSize: "0.82rem" }} onClick={() => setDeleteConfirmId(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button style={S.resetBtn} onClick={() => setView("home")}>← Back to home</button>
        {footer}
      </div>
      {modal}
    </div>
  );

  // ── SESSION DETAIL ──
  if (view === "sessionDetail" && selectedSession) return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo brand={whiteLabel} />
        <div style={S.card}>
          <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "0.3rem" }}>{selectedSession.title}</div>
          <div style={{ fontSize: "0.75rem", color: "#8a879e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
            {selectedSession.program} · {selectedSession.voice}
          </div>
          {selectedSession.audioError
            ? <div style={{ fontSize: "0.82rem", color: "#8a879e", textAlign: "center", padding: "0.75rem 0 0.25rem", marginBottom: "0.5rem" }}>
                Audio not available for this session — generate a new session to get audio playback.
              </div>
            : <SessionAudioPlayer
                src={selectedSession.audioUrl}
                noteText="Your personalized audio session"
                onError={() => setSelectedSession(s => ({ ...s, audioError: true }))}
              />
          }
          {selectedSession.background && (
            <BackgroundPlayer background={selectedSession.background} intensity={selectedSession.backgroundIntensity} />
          )}
          <div style={S.scriptBox}>{renderScript(selectedSession.script)}</div>
          {!selectedSession.audioError && (
            !plan ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginBottom: "0.5rem", fontSize: "0.82rem", color: "#8a879e" }}>
                <span>🔒</span><span>Upgrade to Premium to download your sessions</span>
              </div>
            ) : (
              <div style={{ ...S.row, marginBottom: "0.5rem" }}>
                <button style={S.btn} onClick={async () => {
                  try {
                    const resp = await fetch(selectedSession.audioUrl);
                    const blob = await resp.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                    const d = new Date();
                    const a = document.createElement("a");
                    a.href = blobUrl;
                    a.download = `MindTranceform-${selectedSession.program || "Session"}-${months[d.getMonth()]}-${d.getDate()}-${d.getFullYear()}.mp3`;
                    a.click();
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
                  } catch {}
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
        {footer}
      </div>
      {modal}
    </div>
  );

  // ── WHITE LABEL PRICING ──
  if (view === "whitelabel") {
    const WL_PLANS = [  // eslint-disable-line no-unused-vars
      { id: "basic",        label: "Basic",        price: "$49",  period: "/mo", accent: "#8a879e",
        features: ["Up to 100 client sessions/mo", "Custom brand name & color", "Shareable session link", "Email support"] },
      { id: "professional", label: "Professional", price: "$99",  period: "/mo", accent: "#a8d8c8",
        features: ["Unlimited client sessions", "Custom logo", "Custom domain support", "Priority support", "Session analytics"] },
      { id: "enterprise",   label: "Enterprise",   price: "$199", period: "/mo", accent: "#c9a8d8",
        features: ["Everything in Professional", "White-glove onboarding", "Dedicated account manager", "Custom integrations", "SLA guarantee"] },
      { id: "corporate",    label: "Corporate",    price: "Custom", period: "", accent: "#d4b896",
        features: ["Team of 10+ coaches/therapists", "Custom contract & invoicing", "On-site or virtual training", "Full API access", "Contact us to discuss"] },
    ];

    async function handleWlSignup(e) {
      e.preventDefault();
      if (!wlForm.brand_name.trim() || !wlForm.email.trim() || !wlSelectedPlan) {
        setWlError("Please fill in all fields and choose a plan."); return;
      }
      if (wlSelectedPlan === "corporate") { setView("corporate"); return; }
      setWlBusy(true); setWlError("");
      try {
        const res = await fetch(`${BACKEND_URL}/whitelabel/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...wlForm, plan: wlSelectedPlan }),
        });
        const data = await res.json();
        if (data.checkoutUrl) { window.location.href = data.checkoutUrl; return; }
        setWlError(data.error || "Something went wrong.");
      } catch { setWlError("Something went wrong. Please try again."); }
      setWlBusy(false);
    }

    return (
      <div style={S.root}>
        <StarField />
        <div style={S.wrap}>
          <Logo sub brand={whiteLabel} />
          <div style={S.card}>
            <div style={{ fontSize: "1.5rem", fontWeight: 300, marginBottom: "0.35rem" }}>White Label Mind Tranceform</div>
            <div style={{ fontSize: "0.85rem", color: "#8a879e", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              Offer personalized AI meditation and hypnosis sessions under your own brand. Your clients never see our name.
            </div>
            {WL_PLANS.map((p) => (
              <div key={p.id}
                style={{
                  ...S.sessionItem,
                  padding: "1.1rem 1.25rem",
                  marginBottom: "0.75rem",
                  border: wlSelectedPlan === p.id ? `0.5px solid ${p.accent}` : "0.5px solid rgba(255,255,255,0.08)",
                  background: wlSelectedPlan === p.id ? `rgba(${p.accent === "#a8d8c8" ? "168,216,200" : p.accent === "#c9a8d8" ? "201,168,216" : "212,184,150"},0.06)` : "rgba(255,255,255,0.04)",
                  cursor: "pointer",
                }}
                onClick={() => setWlSelectedPlan(p.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                  <div style={{ fontSize: "1rem", color: "#e8e6f0" }}>{p.label}</div>
                  <div style={{ fontSize: "1.05rem", color: p.accent }}>
                    {p.price}<span style={{ fontSize: "0.72rem", color: "#8a879e" }}>{p.period}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem 1rem", marginBottom: "0.4rem" }}>
                  {p.features.map((f) => (
                    <div key={f} style={{ fontSize: "0.75rem", color: "#8a879e", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <span style={{ color: p.accent, fontSize: "0.6rem" }}>◦</span>{f}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    border: wlSelectedPlan === p.id ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                    background: wlSelectedPlan === p.id ? p.accent : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: "#07091a",
                  }}>{wlSelectedPlan === p.id ? "✓" : ""}</div>
                </div>
              </div>
            ))}
            <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", margin: "1.5rem 0 1.25rem" }} />
            <form onSubmit={handleWlSignup}>
              <input style={{ ...S.input, marginBottom: "0.75rem" }} type="text" placeholder="Brand name"
                value={wlForm.brand_name} onChange={(e) => setWlForm((f) => ({ ...f, brand_name: e.target.value }))} />
              <input style={{ ...S.input, marginBottom: "0.75rem" }} type="email" placeholder="Your email"
                value={wlForm.email} onChange={(e) => setWlForm((f) => ({ ...f, email: e.target.value }))} />
              {wlError && <div style={S.errorBox}>{wlError}</div>}
              <button style={{ ...S.btnPrimary, width: "100%" }} type="submit" disabled={wlBusy}>
                {wlBusy ? "..." : wlSelectedPlan === "corporate" ? "Contact Sales →" : "Get Started →"}
              </button>
            </form>
          </div>
          <button style={S.resetBtn} onClick={() => setView(user ? "home" : "auth")}>← Back</button>
          {footer}
        </div>
        {modal}
      </div>
    );
  }

  // ── CORPORATE INQUIRY ──
  if (view === "corporate") {
    async function handleCorpSubmit(e) {
      e.preventDefault();
      if (!corpForm.name.trim() || !corpForm.email.trim() || !corpForm.company.trim()) {
        setCorpError("Name, email, and company are required."); return;
      }
      setCorpBusy(true); setCorpError("");
      try {
        const res = await fetch(`${BACKEND_URL}/corporate-inquiry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(corpForm),
        });
        const data = await res.json();
        if (data.success) { setCorpDone(true); return; }
        setCorpError(data.error || "Something went wrong.");
      } catch { setCorpError("Something went wrong. Please try again."); }
      setCorpBusy(false);
    }
    const cf = (key, placeholder, type = "text") => (
      <input style={{ ...S.input, marginBottom: "0.75rem" }} type={type} placeholder={placeholder}
        value={corpForm[key]} onChange={(e) => setCorpForm((f) => ({ ...f, [key]: e.target.value }))} />
    );
    return (
      <div style={S.root}>
        <StarField />
        <div style={S.wrap}>
          <Logo sub brand={whiteLabel} />
          <div style={S.card}>
            {corpDone ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✦</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "0.75rem" }}>Message received</div>
                <div style={{ fontSize: "0.88rem", color: "#8a879e", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  We'll be in touch at {corpForm.email} within 24 hours.
                </div>
                <button style={{ ...S.btnPrimary, padding: "0.7rem 2rem" }} onClick={() => setView(user ? "home" : "auth")}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: "1.5rem", fontWeight: 300, marginBottom: "0.35rem" }}>Corporate Inquiry</div>
                <div style={{ fontSize: "0.85rem", color: "#8a879e", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  For teams of 10+ coaches, therapists, or wellness brands. We'll build a plan around your needs.
                </div>
                {corpError && <div style={S.errorBox}>{corpError}</div>}
                <form onSubmit={handleCorpSubmit}>
                  {cf("name", "Your name *")}
                  {cf("email", "Work email *", "email")}
                  {cf("company", "Company / organization *")}
                  {cf("role", "Your role")}
                  {cf("teamSize", "Team size (approx.)")}
                  {cf("useCase", "Intended use case")}
                  {cf("timeline", "Timeline / urgency")}
                  <textarea style={{ ...S.input, marginBottom: "0.75rem", minHeight: 90, resize: "vertical" }}
                    placeholder="Anything else we should know?"
                    value={corpForm.message}
                    onChange={(e) => setCorpForm((f) => ({ ...f, message: e.target.value }))} />
                  <button style={{ ...S.btnPrimary, width: "100%" }} type="submit" disabled={corpBusy}>
                    {corpBusy ? "Sending..." : "Send Inquiry →"}
                  </button>
                </form>
              </>
            )}
          </div>
          <button style={S.resetBtn} onClick={() => setView("whitelabel")}>← Back to plans</button>
          {footer}
        </div>
        {modal}
      </div>
    );
  }

  // ── GENERATION ERROR ──
  if (view === "genError") return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo brand={whiteLabel} />
        <div style={S.card}>
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "0.75rem" }}>Something went wrong</div>
            <div style={{ fontSize: "0.85rem", color: "#8a879e", lineHeight: 1.7, marginBottom: "1.5rem" }}>{error}</div>
            <div style={S.row}>
              <button style={S.btn} onClick={() => setView("home")}>Home</button>
              <button style={S.btnPrimary} onClick={generate}>Try Again ✦</button>
            </div>
            <div style={{ marginTop: "1rem", fontSize: "0.78rem", color: "#8a879e" }}>
              Need help? <a href="mailto:support@mindtranceformapp.com" style={{ color: "#a8d8c8", textDecoration: "underline" }}>support@mindtranceformapp.com</a>
            </div>
          </div>
        </div>
        {footer}
      </div>
      {modal}
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
          <Logo brand={whiteLabel} />
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
                Payment failed — please update your payment method.{" "}
                <a href="mailto:support@mindtranceformapp.com" style={{ color: "#e87c7c", textDecoration: "underline" }}>Need help?</a>
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

          {/* ── Delete Account ── */}
          {user?.email && (
            <div style={{ ...S.card, marginTop: "0.75rem" }}>
              <div style={{ fontSize: "1rem", fontWeight: 300, marginBottom: "0.4rem", color: "#e8e6f0" }}>Account Data</div>
              <div style={{ fontSize: "0.8rem", color: "#8a879e", lineHeight: 1.65, marginBottom: "1rem" }}>
                Permanently delete your account and all associated data — sessions, audio files, and personal information. This cannot be undone.
              </div>
              {deleteAcctError && <div style={{ ...S.infoBox, borderColor: "rgba(232,124,124,0.3)", color: "#e87c7c", marginBottom: "0.75rem", fontSize: "0.82rem" }}>{deleteAcctError}</div>}
              {!deleteAcctConfirm ? (
                <button
                  style={{ ...S.btn, width: "100%", color: "#e87c7c", borderColor: "rgba(232,124,124,0.3)" }}
                  onClick={() => { setDeleteAcctConfirm(true); setDeleteAcctError(""); }}
                >
                  Delete My Account and Data
                </button>
              ) : (
                <div style={{ ...S.infoBox, borderColor: "rgba(232,135,100,0.3)" }}>
                  <div style={{ fontSize: "0.88rem", color: "#e8e6f0", marginBottom: "1rem", lineHeight: 1.6 }}>
                    Are you absolutely sure? All your sessions and data will be permanently deleted.
                  </div>
                  <div style={S.row}>
                    <button style={S.btn} onClick={() => { setDeleteAcctConfirm(false); setDeleteAcctError(""); }}>Cancel</button>
                    <button
                      style={{ ...S.btn, color: "#e87c7c", borderColor: "rgba(232,124,124,0.35)" }}
                      onClick={handleDeleteAccount}
                      disabled={deleteAcctBusy}
                    >
                      {deleteAcctBusy ? "Deleting..." : "Yes, Delete Everything"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Referral Section ── */}
          {user?.email && (
            <div style={{ ...S.card, marginTop: "0.75rem" }}>
              <div style={{ fontSize: "1rem", fontWeight: 300, marginBottom: "0.4rem", color: "#e8e6f0" }}>Refer a Friend ✦</div>
              <div style={{ fontSize: "0.8rem", color: "#8a879e", lineHeight: 1.65, marginBottom: "1rem" }}>
                Give a friend their first session free. When they subscribe, you get 1 free month of Premium.
              </div>

              {/* Stats */}
              {referralCode && (
                <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem" }}>
                  {[
                    { label: "Referred",  value: referralStats.total },
                    { label: "Joined",    value: referralStats.joined },
                    { label: "Mo. Earned", value: referralStats.monthsEarned },
                  ].map((s) => (
                    <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "0.6rem", textAlign: "center", border: "0.5px solid rgba(255,255,255,0.07)" }}>
                      <div style={{ fontSize: "1.15rem", fontWeight: 400, color: "#a8d8c8" }}>{s.value}</div>
                      <div style={{ fontSize: "0.62rem", color: "#8a879e", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Link */}
              {!referralCode && (
                <button style={{ ...S.btnPrimary, width: "100%", marginBottom: "0.75rem" }} onClick={fetchReferralStats}>
                  Get My Referral Link
                </button>
              )}
              {referralCode && (() => {
                const refLink = `https://app.mindtranceformapp.com?ref=${referralCode}`;
                const refText = `I've been using Mind Tranceform for personalized AI meditations — try it free: ${refLink}`;
                return (
                  <>
                    <div style={{ ...S.input, marginBottom: "0.75rem", fontSize: "0.75rem", color: "#8a879e", wordBreak: "break-all" }}>
                      {refLink}
                    </div>
                    <button style={{ ...S.btnPrimary, width: "100%", marginBottom: "0.6rem" }}
                      onClick={() => { navigator.clipboard.writeText(refLink); }}>
                      Copy Link
                    </button>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                      <a href={`https://wa.me/?text=${encodeURIComponent(refText)}`} target="_blank" rel="noreferrer"
                        style={{ ...S.btn, textAlign: "center", textDecoration: "none", display: "block", padding: "0.6rem 0", fontSize: "0.78rem" }}>
                        WhatsApp
                      </a>
                      <a href={`sms:?body=${encodeURIComponent(refText)}`}
                        style={{ ...S.btn, textAlign: "center", textDecoration: "none", display: "block", padding: "0.6rem 0", fontSize: "0.78rem" }}>
                        iMessage
                      </a>
                      <a href={`mailto:?subject=Try Mind Tranceform&body=${encodeURIComponent(refText)}`}
                        style={{ ...S.btn, textAlign: "center", textDecoration: "none", display: "block", padding: "0.6rem 0", fontSize: "0.78rem" }}>
                        Email
                      </a>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          <button style={S.resetBtn} onClick={() => setView("home")}>← Back to home</button>
          {footer}
        </div>
        {modal}
      </div>
    );
  }

  // ── WL ADMIN ──
  if (view === "wladmin") {
    const shareLink = wlAdmin ? `${window.location.origin}?wl=${wlAdmin.account.id}` : "";

    return (
      <div style={S.root}>
        <StarField />
        <div style={S.wrap}>
          <Logo sub brand={whiteLabel} />
          <div style={S.card}>
            <div style={{ fontSize: "1.4rem", fontWeight: 300, marginBottom: "1.5rem" }}>White Label Dashboard</div>
            {wlAdminBusy && !wlAdmin && <div style={{ color: "#8a879e", textAlign: "center", padding: "2rem 0" }}>Loading...</div>}
            {wlAdminMsg && !wlAdmin && <div style={S.infoBox}>{wlAdminMsg}</div>}
            {!wlAdmin && !wlAdminBusy && (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{ fontSize: "0.88rem", color: "#8a879e", marginBottom: "1.25rem" }}>No white label account found for this email.</div>
                <button style={S.btnPrimary} onClick={() => setView("whitelabel")}>Sign Up →</button>
              </div>
            )}
            {wlAdmin && (
              <>
                {/* Stats */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                  {[
                    { label: "Status",    value: wlAdmin.account.active ? "Active" : "Inactive",    color: wlAdmin.account.active ? "#a8d8c8" : "#e87c7c" },
                    { label: "Plan",      value: wlAdmin.account.plan   || "—",                     color: "#c9a8d8" },
                    { label: "Sessions",  value: String(wlAdmin.session_count ?? 0),                color: "#e8e6f0" },
                  ].map((s) => (
                    <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "0.85rem", textAlign: "center", border: "0.5px solid rgba(255,255,255,0.08)" }}>
                      <div style={{ fontSize: "1.1rem", fontWeight: 400, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: "0.68rem", color: "#8a879e", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Share link */}
                <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8a879e", marginBottom: "0.4rem" }}>Client link</div>
                <div style={{ ...S.input, marginBottom: "1.25rem", fontSize: "0.78rem", color: "#8a879e", cursor: "text", wordBreak: "break-all" }}>{shareLink}</div>
                <button style={{ ...S.btn, width: "100%", marginBottom: "1.5rem" }}
                  onClick={() => { navigator.clipboard.writeText(shareLink); setWlAdminMsg("Link copied!"); }}>
                  Copy Client Link
                </button>

                <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", margin: "0 0 1.25rem" }} />
                <div style={{ fontSize: "1rem", fontWeight: 300, marginBottom: "1rem", color: "#e8e6f0" }}>Brand Settings</div>

                {wlAdminMsg && <div style={S.infoBox}>{wlAdminMsg}</div>}
                <form onSubmit={saveWlAdmin}>
                  {[
                    { key: "brand_name",     placeholder: "Brand name" },
                    { key: "brand_color",    placeholder: "Brand color (hex, e.g. #a8d8c8)" },
                    { key: "brand_logo_url", placeholder: "Logo URL (optional)" },
                    { key: "custom_domain",  placeholder: "Custom domain (e.g. app.yourbrand.com)" },
                  ].map((f) => (
                    <input key={f.key} style={{ ...S.input, marginBottom: "0.75rem" }} type="text"
                      placeholder={f.placeholder} value={wlAdminEdit[f.key]}
                      onChange={(e) => setWlAdminEdit((prev) => ({ ...prev, [f.key]: e.target.value }))} />
                  ))}
                  <button style={{ ...S.btnPrimary, width: "100%" }} type="submit" disabled={wlAdminBusy}>
                    {wlAdminBusy ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </>
            )}
          </div>
          <button style={S.resetBtn} onClick={() => setView(user ? "home" : "auth")}>← Back</button>
          {footer}
        </div>
        {modal}
      </div>
    );
  }

  // ── HOME ──
  if (view === "home") return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo sub brand={whiteLabel} />
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
          {pendingResume && (
            <div style={{ ...S.infoBox, marginBottom: "1.25rem", textAlign: "center", borderColor: "rgba(168,216,200,0.35)" }}>
              <div style={{ fontSize: "0.87rem", color: "#a8d8c8", marginBottom: "0.65rem" }}>You have an in-progress session</div>
              <button
                style={{ ...S.btnPrimary, width: "100%", padding: "0.65rem", marginBottom: "0.45rem", fontSize: "0.9rem" }}
                onClick={() => {
                  if (pendingResume.result)          setResult(pendingResume.result);
                  if (pendingResume.selectedSession) setSelectedSession(pendingResume.selectedSession);
                  if (pendingResume.form)            setForm(pendingResume.form);
                  setView(pendingResume.view);
                  setPendingResume(null);
                }}
              >▶ Resume your session</button>
              <button
                style={{ fontSize: "0.74rem", color: "#8a879e", background: "none", border: "none", cursor: "pointer", padding: "0.15rem" }}
                onClick={() => setPendingResume(null)}
              >Dismiss</button>
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
            onClick={() => { setStep(0); setForm(EMPTY_FORM); setError(""); setResult(null); setPendingResume(null); setView("quiz"); setWelcomeMsg(""); }}
          >
            ✦ New Session
          </button>
          <button style={{ ...S.btn, width: "100%", padding: "1rem", marginBottom: "0.75rem" }} onClick={() => { setView("sessions"); fetchSessions(); }}>
            My Sessions
          </button>
          {user?.email === import.meta.env.VITE_ADMIN_EMAIL && (
            <button style={{ ...S.btn, width: "100%", padding: "1rem", marginBottom: "0.75rem" }} onClick={() => { window.history.pushState({}, "", "/admin/content"); setView("adminContent"); }}>
              Admin Dashboard
            </button>
          )}
          <button style={{ ...S.btn, width: "100%", padding: "1rem" }} onClick={() => { setView("account"); fetchSubStatus(); fetchReferralStats(); setCancelConfirm(false); }}>
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
        <button style={S.resetBtn} onClick={() => { setWlAdmin(null); setWlAdminMsg(""); setView("wladmin"); }}>White Label Dashboard</button>
        <button style={S.resetBtn} onClick={handleLogout}>Log out</button>
        {footer}
      </div>
      {modal}
    </div>
  );

  // ── BACKGROUND LISTENING INSTRUCTIONS ──
  if (view === "bgInstructions") {
    const bg = form.background;
    const isHz = bg === "432 Hz" || bg === "528 Hz";
    const isBinaural = bg === "Theta Waves" || bg === "Delta Sleep";
    const tip = (icon, text) => (
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.45rem", alignItems: "flex-start" }}>
        <span style={{ color: "#a8d8c8", flexShrink: 0, marginTop: "0.05rem" }}>{icon}</span>
        <span style={{ fontSize: "0.86rem", color: "#c8c5d8", lineHeight: 1.6 }}>{text}</span>
      </div>
    );
    const sec = (title) => (
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8a879e", marginBottom: "0.6rem", marginTop: "1.25rem" }}>{title}</div>
    );
    return (
      <div style={S.root}>
        <StarField />
        <div style={S.wrap}>
          <Logo sub brand={whiteLabel} />
          <div style={S.card}>
            <div style={{ fontSize: "1.45rem", fontWeight: 300, marginBottom: "0.3rem" }}>
              How to get the most from your session
            </div>
            <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", margin: "1rem 0 1.25rem" }} />

            {sec("For background sounds")}
            {tip("◦", "Use headphones for the best experience — especially for Hz frequencies and binaural beats")}
            {tip("◦", "Set your volume to a comfortable level before starting")}
            {tip("◦", "The background sound will play throughout your session")}

            {isHz && (<>
              {sec(`About ${bg}`)}
              {bg === "432 Hz" && tip("◦", "432 Hz promotes relaxation and natural harmony")}
              {bg === "528 Hz" && tip("◦", "528 Hz is associated with transformation and clarity")}
              {tip("◦", "This is a gentle tone — it should be barely noticeable under the voice")}
            </>)}

            {isBinaural && (<>
              {sec("About binaural beats")}
              {bg === "Theta Waves" && tip("◦", "Theta waves (4–8 Hz) are ideal for deep meditation")}
              {bg === "Delta Sleep" && tip("◦", "Delta waves (0.5–4 Hz) are ideal for deep sleep")}
              {tip("◦", <span><strong style={{ color: "#e8e6f0" }}>You must use headphones</strong> — binaural beats only work when each ear hears a different frequency</span>)}
            </>)}

            {!isHz && !isBinaural && (<>
              {sec(`About ${bg} sounds`)}
              {bg === "Rain" && tip("◦", "Gentle rainfall creates a grounding, peaceful atmosphere for your session")}
              {bg === "Ocean" && tip("◦", "Ocean waves help establish a slow, expansive rhythm to guide your breath")}
            </>)}

            <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", margin: "1.5rem 0 1.25rem" }} />

            {/* Optional headphones checkbox */}
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", marginBottom: "1.5rem" }}
              onClick={() => setBgInstructionsChecked((v) => !v)}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 2,
                border: bgInstructionsChecked ? "none" : "1.5px solid rgba(168,216,200,0.4)",
                background: bgInstructionsChecked ? "#a8d8c8" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: "#07091a", transition: "all 0.2s",
              }}>
                {bgInstructionsChecked ? "✓" : ""}
              </div>
              <span style={{ fontSize: "0.85rem", color: "#c8c5d8", lineHeight: 1.6 }}>
                🎧 I understand — I will use headphones for the best experience
              </span>
            </div>

            <div style={S.row}>
              <button style={S.btn} onClick={() => { stopBgPreview(); setView("quiz"); }}>← Back</button>
              <button
                style={S.btnPrimary}
                onClick={() => {
                  if (bgInstructionsChecked) localStorage.setItem("mt_headphones_reminder", "1");
                  setView("quiz");
                  setStep((p) => p + 1);
                }}
              >
                Continue →
              </button>
            </div>
          </div>
          {footer}
        </div>
        {modal}
      </div>
    );
  }

  // ── BLOG LIST ──
  if (view === "blog") {
    if (!blogPosts.length && !blogLoading) fetchBlogPosts();
    const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";
    return (
      <div style={S.root}>
        <StarField />
        <div style={{ ...S.wrap, maxWidth: 680 }}>
          <div style={{ textAlign: "center", padding: "2.5rem 0 1.5rem" }}>
            <h1 style={{ ...S.h1, fontSize: "1.8rem" }}>Mind <span style={S.h1span}>Tranceform</span> Blog</h1>
            <p style={{ fontSize: "0.82rem", color: "#8a879e", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.4rem" }}>Sleep · Meditation · Hypnosis · Wellness</p>
          </div>
          {blogLoading && <div style={{ textAlign: "center", color: "#8a879e", padding: "2rem" }}>Loading posts...</div>}
          {!blogLoading && !blogPosts.length && (
            <div style={{ textAlign: "center", color: "#8a879e", padding: "2rem" }}>No posts published yet.</div>
          )}
          {blogPosts.map(post => (
            <div key={post.id} style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "1.5rem", marginBottom: "1rem", cursor: "pointer" }}
              onClick={() => {
                window.history.pushState({}, "", `/blog/${post.slug}`);
                setBlogPost(post);
                setView("blogPost");
              }}>
              <div style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#a8d8c8", marginBottom: "0.5rem" }}>{post.topic} · {fmt(post.published_at)}</div>
              <div style={{ fontSize: "1.15rem", fontWeight: 300, color: "#e8e6f0", marginBottom: "0.6rem", lineHeight: 1.4 }}>{post.title}</div>
              <div style={{ fontSize: "0.84rem", color: "#8a879e", lineHeight: 1.7 }}>{(post.excerpt || "").slice(0, 180)}{post.excerpt?.length > 180 ? "…" : ""}</div>
              <div style={{ marginTop: "0.85rem", fontSize: "0.78rem", color: "#a8d8c8" }}>Read more →</div>
            </div>
          ))}
          <div style={{ textAlign: "center", padding: "1.5rem 0 2rem" }}>
            <button style={{ ...S.btn, fontSize: "0.82rem" }} onClick={() => { window.history.pushState({}, "", "/"); setView(user ? "home" : "landing"); }}>← Back to App</button>
          </div>
        </div>
      </div>
    );
  }

  // ── BLOG POST ──
  if (view === "blogPost") {
    const post = blogPost;
    if (post?.slug && (post.loading || !post.content) && !blogLoading) fetchBlogPost(post.slug);
    const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

    function renderBlogContent(md) {
      if (!md) return null;
      return md.split("\n").map((line, i) => {
        if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: "1.15rem", fontWeight: 400, color: "#e8e6f0", margin: "1.5rem 0 0.6rem", letterSpacing: "0.02em" }}>{line.replace("## ", "")}</h2>;
        if (line.startsWith("# "))  return null;
        if (!line.trim()) return <div key={i} style={{ height: "0.75rem" }} />;
        return <p key={i} style={{ fontSize: "0.9rem", color: "#c8c5d8", lineHeight: 1.8, margin: "0 0 0.5rem" }}>{line}</p>;
      });
    }

    return (
      <div style={S.root}>
        <StarField />
        <div style={{ ...S.wrap, maxWidth: 680 }}>
          <div style={{ padding: "2rem 0 1rem" }}>
            <button style={{ background: "none", border: "none", color: "#8a879e", cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem", padding: 0, marginBottom: "1.5rem" }}
              onClick={() => { window.history.pushState({}, "", "/blog"); setBlogPost(null); setView("blog"); }}>← All posts</button>
            {blogLoading && <div style={{ color: "#8a879e", padding: "2rem 0" }}>Loading...</div>}
            {!blogLoading && post && !post.loading && (
              <div style={{ ...S.card }}>
                <div style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#a8d8c8", marginBottom: "0.6rem" }}>{post.topic} · {fmt(post.published_at)}</div>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 300, color: "#e8e6f0", marginBottom: "1.25rem", lineHeight: 1.35 }}>{post.title}</h1>
                <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", marginBottom: "1.25rem" }} />
                <div>{renderBlogContent(post.content)}</div>
                <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", margin: "1.5rem 0 1.25rem" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.85rem", color: "#8a879e", marginBottom: "0.75rem" }}>Experience personalized meditation for yourself</div>
                  <button style={S.btnPrimary} onClick={() => { window.history.pushState({}, "", "/"); setView(user ? "home" : "landing"); }}>Try Mind Tranceform Free ✦</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── ADMIN CONTENT CALENDAR ──
  if (view === "adminContent") {
    const TYPES   = ["", "tiktok", "twitter", "reddit", "email", "reddit_reply", "twitter_reply"];
    const STATUSES = ["", "draft", "approved", "posted"];
    const TYPE_LABELS = { tiktok: "TikTok", twitter: "Twitter", reddit: "Reddit Post", email: "Email Subjects", reddit_reply: "Reddit Reply", twitter_reply: "Twitter Reply", "": "All Types" };
    const statusColor = { draft: "#8a879e", approved: "#a8d8c8", posted: "#c9a8d8" };

    const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

    if (!contentItems.length && !contentLoading && !contentError) { fetchContentItems(); fetchBlogAdminPosts(); }

    return (
      <div style={S.root}>
        <StarField />
        <div style={{ ...S.wrap, maxWidth: 820 }}>
          <div style={{ padding: "1.5rem 0 0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: 300, color: "#e8e6f0" }}>Content Calendar</div>
              <div style={{ fontSize: "0.72rem", color: "#8a879e", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.2rem" }}>{contentItems.length} items</div>
            </div>
            <button style={{ ...S.btnPrimary, fontSize: "0.78rem", padding: "0.45rem 1rem" }} onClick={fetchContentItems}>↻ Refresh</button>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => { setContentFilter(f => ({ ...f, type: t })); }}
                style={{ background: contentFilter.type === t ? "rgba(168,216,200,0.15)" : "rgba(255,255,255,0.04)", border: `0.5px solid ${contentFilter.type === t ? "#a8d8c8" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, color: contentFilter.type === t ? "#a8d8c8" : "#8a879e", fontSize: "0.72rem", padding: "0.3rem 0.7rem", cursor: "pointer", fontFamily: "inherit" }}>
                {TYPE_LABELS[t] || t || "All Types"}
              </button>
            ))}
            {STATUSES.filter(Boolean).map(s => (
              <button key={s} onClick={() => setContentFilter(f => ({ ...f, status: f.status === s ? "" : s }))}
                style={{ background: contentFilter.status === s ? "rgba(168,216,200,0.1)" : "transparent", border: `0.5px solid ${statusColor[s] || "rgba(255,255,255,0.1)"}`, borderRadius: 8, color: statusColor[s] || "#8a879e", fontSize: "0.72rem", padding: "0.3rem 0.7rem", cursor: "pointer", fontFamily: "inherit" }}>
                {s}
              </button>
            ))}
          </div>

          {contentLoading && <div style={{ color: "#8a879e", padding: "1rem 0" }}>Loading...</div>}
          {!contentLoading && contentError && (
            <div style={{ color: "#e8a8a8", background: "rgba(232,168,168,0.07)", border: "0.5px solid rgba(232,168,168,0.2)", borderRadius: 10, padding: "0.85rem 1rem", fontSize: "0.82rem", marginBottom: "1rem" }}>
              Error: {contentError}
            </div>
          )}

          {contentItems.filter(item => (!contentFilter.type || item.type === contentFilter.type) && (!contentFilter.status || item.status === contentFilter.status)).map(item => (
            <div key={item.id} style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1rem", marginBottom: "0.65rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8d8c8", background: "rgba(168,216,200,0.08)", borderRadius: 5, padding: "0.15rem 0.45rem" }}>{item.type}</span>
                  {item.topic && <span style={{ fontSize: "0.65rem", color: "#8a879e" }}>{item.topic}</span>}
                  <span style={{ fontSize: "0.65rem", color: statusColor[item.status] || "#8a879e" }}>● {item.status}</span>
                </div>
                <span style={{ fontSize: "0.68rem", color: "#8a879e" }}>{fmt(item.generated_at || item.created_at)}</span>
              </div>
              <div style={{ fontSize: "0.83rem", color: "#c8c5d8", lineHeight: 1.65, whiteSpace: "pre-wrap", maxHeight: 160, overflow: "hidden", WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)" }}>
                {item.content}
              </div>
              {item.metadata?.post_url && <div style={{ fontSize: "0.72rem", color: "#8a879e", marginTop: "0.5rem" }}>Source: <a href={item.metadata.post_url} target="_blank" rel="noopener noreferrer" style={{ color: "#a8d8c8" }}>{item.metadata.post_url}</a></div>}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                <button onClick={() => { navigator.clipboard.writeText(item.content); setContentCopied(item.id); setTimeout(() => setContentCopied(null), 2000); }}
                  style={{ background: contentCopied === item.id ? "rgba(168,216,200,0.15)" : "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 7, color: "#a8d8c8", fontSize: "0.72rem", padding: "0.3rem 0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                  {contentCopied === item.id ? "Copied!" : "Copy"}
                </button>
                {item.status === "draft" && <button onClick={() => updateContentStatus(item.id, "approved")}
                  style={{ background: "rgba(168,216,200,0.08)", border: "0.5px solid rgba(168,216,200,0.3)", borderRadius: 7, color: "#a8d8c8", fontSize: "0.72rem", padding: "0.3rem 0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                  Approve
                </button>}
                {item.status === "approved" && <button onClick={() => updateContentStatus(item.id, "posted")}
                  style={{ background: "rgba(201,168,216,0.08)", border: "0.5px solid rgba(201,168,216,0.3)", borderRadius: 7, color: "#c9a8d8", fontSize: "0.72rem", padding: "0.3rem 0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                  Mark Posted
                </button>}
              </div>
            </div>
          ))}

          {/* Blog posts section */}
          {blogAdminPosts.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <div style={{ fontSize: "1rem", fontWeight: 300, color: "#e8e6f0", marginBottom: "0.75rem" }}>Blog Posts</div>
              {blogAdminPosts.map(post => (
                <div key={post.id} style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1rem", marginBottom: "0.65rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "0.88rem", color: "#e8e6f0", marginBottom: "0.2rem" }}>{post.title}</div>
                    <div style={{ fontSize: "0.7rem", color: "#8a879e" }}>{post.topic} · {post.status} · {fmt(post.created_at)}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {post.status === "draft" && <button onClick={() => publishBlogPost(post.id)}
                      style={{ background: "rgba(168,216,200,0.08)", border: "0.5px solid rgba(168,216,200,0.3)", borderRadius: 7, color: "#a8d8c8", fontSize: "0.72rem", padding: "0.3rem 0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                      Publish
                    </button>}
                    {post.status === "published" && <span style={{ fontSize: "0.7rem", color: "#a8d8c8" }}>● Live at /blog/{post.slug}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", padding: "1.5rem 0 2rem" }}>
            <button style={{ ...S.btn, fontSize: "0.8rem" }} onClick={() => { window.history.pushState({}, "", "/"); setView(user ? "home" : "landing"); }}>← Back to App</button>
          </div>
        </div>
      </div>
    );
  }

  // ── FAST ENTRY ──
  if (view === "fastEntry") {
    return (
      <div style={S.root}>
        <StarField />
        <div style={S.wrap}>
          <Logo brand={whiteLabel} />
          <div style={S.card}>
            <div style={S.stepQ}>What's going on right now?</div>
            <div style={{ fontSize: "0.82rem", color: "#8a879e", lineHeight: 1.65, marginBottom: "1.25rem", marginTop: "-0.5rem" }}>
              One sentence is enough. We'll handle the rest.
            </div>
            {!form.name.trim() && (
              <input
                style={{ ...S.input, marginBottom: "0.75rem" }}
                type="text"
                placeholder="Your name (optional)"
                value={form.name}
                onChange={(e) => { updateForm("name", e.target.value); }}
              />
            )}
            <textarea
              style={{ ...S.input, minHeight: 100, resize: "vertical", lineHeight: 1.55, overflow: "auto" }}
              placeholder="e.g. I can't stop thinking about tomorrow. I just need to wind down."
              maxLength={280}
              value={fastEntryText}
              autoFocus
              onChange={(e) => setFastEntryText(e.target.value)}
            />
            <div style={{ fontSize: "0.72rem", color: "#8a879e", textAlign: "right", marginTop: "0.3rem", marginBottom: "0.5rem" }}>
              {fastEntryText.length}/280
            </div>
            <div style={{ fontSize: "0.72rem", color: "#8a879e", textAlign: "center", marginBottom: "0.75rem" }}>
              Your answers are used only to personalize this session.{" "}
              <a href="/privacy-data" style={{ color: "#8a879e" }}>How we use your data →</a>
            </div>
            <div style={S.row}>
              <button style={S.btn} onClick={() => setView("quiz")}>← Set it up myself</button>
              <button
                style={{ ...S.btnPrimary, opacity: fastEntryText.trim().length < 10 ? 0.5 : 1 }}
                disabled={fastEntryText.trim().length < 10}
                onClick={() => {
                  if (!safetyAccepted) { setSafetyReturn("fastEntry"); setView("safety"); return; }
                  generateFastEntry(fastEntryText);
                }}
              >
                Build my session →
              </button>
            </div>
          </div>
          {error && <div style={S.errorBox}>⚠ {error}</div>}
          {footer}
        </div>
      </div>
    );
  }

  // ── QUIZ ──
  const current = steps[step];
  const pct = (step / steps.length) * 100;
  return (
    <div style={S.root}>
      <StarField />
      <div style={S.wrap}>
        <Logo sub brand={whiteLabel} />
        <div style={S.card}>
          <div style={S.progressBar}><div style={{ ...S.progressFill, width: `${pct}%` }} /></div>
          <div style={S.stepLabel}>Step {current.label}</div>
          <div style={S.stepQ}>{current.question}</div>
          {current.subtitle && (
            <div style={{ fontSize: "0.82rem", color: "#8a879e", lineHeight: 1.65, marginBottom: "1.25rem", marginTop: "-0.5rem" }}>
              {current.subtitle}
            </div>
          )}
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
              <textarea
                style={{ ...S.input, minHeight: 80, resize: "vertical", lineHeight: 1.55, overflow: "auto", marginBottom: "0.75rem" }}
                placeholder="e.g. Anything turning over in your head — work, a relationship, sleep, something heavier..."
                value={form.fears}
                autoFocus
                onChange={(e) => { updateForm("fears", e.target.value); setError(""); }}
              />
              <div style={{ fontSize: "0.78rem", color: "#8a879e", marginBottom: "0.75rem", marginTop: "-0.35rem", letterSpacing: "0.02em" }}>
                What's weighing on you right now? <span style={{ opacity: 0.6 }}>(optional)</span>
              </div>
              <textarea
                style={{ ...S.input, minHeight: 80, resize: "vertical", lineHeight: 1.55, overflow: "auto", marginBottom: "0.5rem" }}
                placeholder="e.g. If this worked, what would be different tomorrow?"
                value={form.idealLife}
                onChange={(e) => { updateForm("idealLife", e.target.value); setError(""); }}
              />
              <div style={{ fontSize: "0.78rem", color: "#8a879e", marginBottom: "0.5rem", marginTop: "-0.35rem", letterSpacing: "0.02em" }}>
                What does the change look like? <span style={{ opacity: 0.6 }}>(optional)</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "#8a879e", textAlign: "center", opacity: 0.7, marginTop: "0.25rem" }}>
                Skip if nothing comes to mind — even one line shapes the session.
              </div>
              <div style={{ fontSize: "0.72rem", color: "#8a879e", textAlign: "center", marginTop: "0.5rem" }}>
                Your answers are used only to personalize this session.{" "}
                <button style={{ background: "none", border: "none", color: "#8a879e", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontSize: "inherit", padding: 0 }} onClick={() => setView("privacyData")}>How is this used?</button>
              </div>
            </>
          ) : current.id === "voice" ? (
            (() => {
              const recValue = VOICE_RECOMMENDATION[form.program] || DEFAULT_VOICE_RECOMMENDATION;
              const recVoice = VOICES.find(v => v.value === recValue) || VOICES[0];
              const otherVoices = VOICES.filter(v => v.value !== recVoice.value);
              return (
                <>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#a8d8c8", marginBottom: "0.6rem" }}>
                    Recommended for you
                  </div>
                  <OptionList
                    options={[recVoice]}
                    selected={form.voice}
                    onSelect={(val) => { updateForm("voice", val); setError(""); }}
                    onPreview={previewVoice}
                    previewLoading={previewLoading}
                    previewPlaying={previewPlaying}
                  />
                  <button
                    style={{ ...S.resetBtn, fontSize: "0.82rem", display: "block", margin: "0.85rem auto 0" }}
                    onClick={() => setShowAllVoices(v => !v)}
                  >
                    {showAllVoices ? "▲ Fewer voices" : "More voices ↓"}
                  </button>
                  {showAllVoices && (
                    <div style={{ marginTop: "0.75rem" }}>
                      <OptionList
                        options={otherVoices}
                        selected={form.voice}
                        onSelect={(val) => { updateForm("voice", val); setError(""); }}
                        onPreview={previewVoice}
                        previewLoading={previewLoading}
                        previewPlaying={previewPlaying}
                      />
                    </div>
                  )}
                </>
              );
            })()
          ) : (
            <OptionList
              options={current.options}
              selected={form[current.id]}
              onSelect={(val) => {
                if (current.id === "program") {
                  const rec = VOICE_RECOMMENDATION[val] || DEFAULT_VOICE_RECOMMENDATION;
                  setForm(f => ({ ...f, program: val, voice: rec }));
                  setShowAllVoices(false);
                } else {
                  updateForm(current.id, val);
                }
                setError("");
              }}
              onLockedSelect={current.lockedAction === "payment" ? () => setView("payment") : undefined}
              onPreview={
                current.id === "background" ? previewBackground : undefined
              }
              previewLoading={current.id === "background" ? bgPreviewLoading : previewLoading}
              previewPlaying={current.id === "background" ? bgPreviewPlaying : previewPlaying}
            />
          )}
          <div style={S.row}>
            <button style={S.btn} onClick={goBack}>← Back</button>
            <button style={S.btnPrimary} onClick={goNext}>
              {step < steps.length - 1 ? "Continue →" : "Generate My Session ✦"}
            </button>
          </div>
          {step === 0 && (
            <button style={{ ...S.resetBtn, marginTop: "0.75rem" }} onClick={() => { setFastEntryText(""); setView("fastEntry"); }}>
              Skip setup — just tell us what's going on →
            </button>
          )}
        </div>
        {error && <div style={S.errorBox}>⚠ {error}</div>}
        {footer}
      </div>
      {modal}
    </div>
  );
}
