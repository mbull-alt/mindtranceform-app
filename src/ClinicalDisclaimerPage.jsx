const T = {
  page:    { fontFamily: "Georgia, serif", maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px", color: "#1a1a1a", lineHeight: 1.7, background: "#fff", minHeight: "100vh" },
  h1:      { fontSize: "2em", borderBottom: "2px solid #07091a", paddingBottom: 12, marginBottom: 0 },
  meta:    { color: "#555", fontSize: "0.9em", marginBottom: "2em", marginTop: "0.5em" },
  h2:      { fontSize: "1.25em", marginTop: "2em", color: "#07091a" },
  p:       { margin: "0.75em 0" },
  ul:      { paddingLeft: "1.4em" },
  li:      { marginBottom: "0.4em" },
  a:       { color: "#6b21a8" },
  hi:      { background: "#f5f0ff", borderLeft: "4px solid #6b21a8", padding: "14px 18px", margin: "1.5em 0", borderRadius: "0 6px 6px 0" },
  warn:    { background: "#fff7ed", borderLeft: "4px solid #c2410c", padding: "14px 18px", margin: "1.5em 0", borderRadius: "0 6px 6px 0" },
  backBtn: { background: "none", border: "none", color: "#6b21a8", cursor: "pointer", fontFamily: "inherit", fontSize: "0.95em", padding: "0 0 1.5rem", textDecoration: "underline" },
};

export function ClinicalDisclaimerPage({ onBack }) {
  return (
    <div style={T.page}>
      <button style={T.backBtn} onClick={onBack}>← Back</button>

      <h1 style={T.h1}>Mind Tranceform — Clinical Disclaimer</h1>
      <p style={T.meta}>Please read before use</p>

      <div style={T.hi}>
        Mind Tranceform is designed for relaxation, personal development, and general wellness purposes only. It is not a medical device, psychological treatment, or therapeutic service, and is not intended to diagnose, treat, cure, or prevent any condition.
      </div>

      <h2 style={T.h2}>Not a Substitute for Professional Care</h2>
      <p style={T.p}>Mind Tranceform is not a substitute for professional mental health care, medical treatment, or psychological therapy. If you are experiencing a mental health crisis, suicidal thoughts, or severe emotional distress, please contact a qualified professional immediately.</p>
      <div style={T.warn}>
        <strong>US Crisis Line:</strong> call or text 988 (Suicide &amp; Crisis Lifeline), available 24/7.
      </div>

      <h2 style={T.h2}>Contraindications</h2>
      <p style={T.p}>Consult a licensed healthcare provider before use if you have or suspect you may have epilepsy or seizure disorders, psychosis or schizophrenia, dissociative identity disorder, severe depression or suicidal ideation, or any other serious psychiatric condition. Do not use during pregnancy without consulting your doctor.</p>

      <h2 style={T.h2}>Driving &amp; Machinery</h2>
      <p style={T.p}>Never listen while driving, operating machinery, caring for dependents, or in any situation requiring full alertness. Sessions are intended for use while safely seated or lying down with eyes closed.</p>

      <h2 style={T.h2}>User Assumption of Risk</h2>
      <p style={T.p}>By using Mind Tranceform, you acknowledge that you have read and understood this disclaimer and that you use the service at your own risk. Mind Tranceform LLC is not liable for any decisions made based on session content.</p>

      <h2 style={T.h2}>Children</h2>
      <p style={T.p}>Mind Tranceform is not intended for users under 18 years of age.</p>

      <h2 style={T.h2}>Questions?</h2>
      <p style={T.p}>
        Email: <a style={T.a} href="mailto:support@mindtranceformapp.com">support@mindtranceformapp.com</a>
      </p>
    </div>
  );
}
