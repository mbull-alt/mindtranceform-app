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
  backBtn: { background: "none", border: "none", color: "#6b21a8", cursor: "pointer", fontFamily: "inherit", fontSize: "0.95em", padding: "0 0 1.5rem", textDecoration: "underline" },
};

export function PrivacyPage({ onBack }) {
  return (
    <div style={T.page}>
      <button style={T.backBtn} onClick={onBack}>← Back</button>

      <h1 style={T.h1}>Mind Tranceform — Privacy Policy</h1>
      <p style={T.meta}>Effective Date: April 23, 2026 &nbsp;|&nbsp; Last Updated: April 23, 2026</p>

      <div style={T.hi}>
        <strong>Your privacy matters.</strong> Mind Tranceform handles sensitive personal wellness data. We are committed to transparency about what we collect, why we collect it, and how you can control it.
      </div>

      <h2 style={T.h2}>1. Who We Are</h2>
      <p style={T.p}>Mind Tranceform ("we," "us," or "our") operates the app at <a style={T.a} href="https://app.mindtranceformapp.com">app.mindtranceformapp.com</a>. For privacy inquiries contact us at <a style={T.a} href="mailto:support@mindtranceformapp.com">support@mindtranceformapp.com</a>.</p>

      <h2 style={T.h2}>2. Information We Collect</h2>
      <p style={T.p}><strong>Account data:</strong> Email address, hashed password (managed by Supabase Auth), account creation timestamp, and age/terms confirmation timestamps.</p>
      <p style={T.p}><strong>Session data:</strong> Your quiz responses (focus area, goals, voice preferences, background sounds), generated session scripts, and AI-generated audio files.</p>
      <p style={T.p}><strong>Payment data:</strong> Subscription status and billing period. Payment card details are processed exclusively by Stripe and never stored on our servers.</p>
      <p style={T.p}><strong>Usage data:</strong> Session playback activity, app view navigation, and error logs (via Sentry) to diagnose technical issues.</p>
      <p style={T.p}><strong>Technical data:</strong> IP address, browser type, operating system, and device type collected automatically when you use the Service.</p>

      <h2 style={T.h2}>3. How We Use Your Information</h2>
      <ul style={T.ul}>
        <li style={T.li}>To generate and deliver your personalized meditation and hypnosis sessions.</li>
        <li style={T.li}>To manage your account, subscription, and billing.</li>
        <li style={T.li}>To improve the Service through aggregated, anonymized analytics.</li>
        <li style={T.li}>To diagnose and fix technical errors.</li>
        <li style={T.li}>To send you service-related communications (account confirmations, billing receipts).</li>
        <li style={T.li}>To comply with legal obligations.</li>
      </ul>
      <p style={T.p}>We do not sell your personal data. We do not use your session content or quiz responses for advertising targeting.</p>

      <h2 style={T.h2}>4. Data Storage and Security</h2>
      <p style={T.p}>Your data is stored in Supabase (PostgreSQL database and object storage) hosted on AWS infrastructure. Audio files are stored in Supabase Storage with access restricted to your authenticated account. We use industry-standard encryption in transit (TLS) and at rest.</p>
      <p style={T.p}>No system is perfectly secure. If we become aware of a data breach affecting your information, we will notify you as required by applicable law.</p>

      <h2 style={T.h2}>5. Data Retention</h2>
      <p style={T.p}>We retain your account data and generated sessions for as long as your account is active. If you delete your account, we delete your sessions, audio files, and personal data within 30 days, except where retention is required by law (e.g., billing records).</p>

      <h2 style={T.h2}>6. Third-Party Services</h2>
      <ul style={T.ul}>
        <li style={T.li}><strong>Supabase</strong> — database, authentication, and file storage.</li>
        <li style={T.li}><strong>Stripe</strong> — payment processing. Subject to <a style={T.a} href="https://stripe.com/privacy" target="_blank" rel="noreferrer">Stripe's Privacy Policy</a>.</li>
        <li style={T.li}><strong>OpenAI</strong> — AI session script generation. Inputs are processed per <a style={T.a} href="https://openai.com/policies/privacy-policy" target="_blank" rel="noreferrer">OpenAI's Privacy Policy</a>.</li>
        <li style={T.li}><strong>ElevenLabs</strong> — voice synthesis for audio generation.</li>
        <li style={T.li}><strong>Sentry</strong> — error monitoring. Error reports may include anonymized technical context.</li>
        <li style={T.li}><strong>Vercel / Render</strong> — hosting and infrastructure.</li>
      </ul>

      <h2 style={T.h2}>7. Your Rights</h2>
      <p style={T.p}>Depending on your jurisdiction, you may have the right to:</p>
      <ul style={T.ul}>
        <li style={T.li}><strong>Access</strong> the personal data we hold about you.</li>
        <li style={T.li}><strong>Correct</strong> inaccurate data.</li>
        <li style={T.li}><strong>Delete</strong> your account and all associated data (via Account Settings → Delete My Account).</li>
        <li style={T.li}><strong>Restrict</strong> or object to certain processing.</li>
        <li style={T.li}><strong>Data portability</strong> — request an export of your data.</li>
        <li style={T.li}><strong>Withdraw consent</strong> at any time where processing is based on consent.</li>
      </ul>
      <p style={T.p}>To exercise any right, email us at <a style={T.a} href="mailto:support@mindtranceformapp.com">support@mindtranceformapp.com</a>. We will respond within 30 days.</p>

      <h2 style={T.h2}>8. Children's Privacy</h2>
      <p style={T.p}>Mind Tranceform is not directed at anyone under 18. We do not knowingly collect personal information from children under 13 (COPPA) or under 18 without age confirmation. If you believe a minor has created an account, contact us and we will delete it immediately.</p>

      <h2 style={T.h2}>9. Cookies and Tracking</h2>
      <p style={T.p}>We use essential cookies and local storage for session authentication and preferences. For full details, see our <a style={T.a} href="/cookies">Cookie Policy</a>.</p>

      <h2 style={T.h2}>10. Changes to This Policy</h2>
      <p style={T.p}>We may update this Privacy Policy from time to time. We will notify you of material changes via email or a prominent in-app notice at least 14 days before they take effect.</p>

      <h2 style={T.h2}>11. Contact</h2>
      <p style={T.p}>
        <strong>Mind Tranceform</strong><br />
        Email: <a style={T.a} href="mailto:support@mindtranceformapp.com">support@mindtranceformapp.com</a><br />
        Website: <a style={T.a} href="https://app.mindtranceformapp.com">app.mindtranceformapp.com</a>
      </p>
    </div>
  );
}
