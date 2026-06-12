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
  tbl:     { overflowX: "auto", marginTop: "0.5em", marginBottom: "1em" },
  table:   { width: "100%", borderCollapse: "collapse", fontSize: "0.92em", minWidth: 480 },
  th:      { textAlign: "left", padding: "0.5em 0.75em", borderBottom: "2px solid #07091a", fontWeight: 600, whiteSpace: "nowrap" },
  td:      { padding: "0.55em 0.75em", borderBottom: "1px solid #ddd", verticalAlign: "top" },
};

export function PrivacyDataPage({ onBack }) {
  return (
    <div style={T.page}>
      <button style={T.backBtn} onClick={onBack}>← Back</button>

      <h1 style={T.h1}>How Mind Tranceform uses your data</h1>
      <p style={T.meta}>Last updated: June 12, 2026</p>

      <div style={T.hi}>
        Mind Tranceform generates personalized hypnosis sessions from what you share with us. This page explains exactly what we store, what we don't, and why.
      </div>

      <h2 style={T.h2}>What we store</h2>
      <div style={T.tbl}>
        <table style={T.table}>
          <thead>
            <tr>
              <th style={T.th}>What</th>
              <th style={T.th}>How long</th>
              <th style={T.th}>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={T.td}>Your name (if you enter one)</td>
              <td style={T.td}>Until you delete your account</td>
              <td style={T.td}>Included in your session script to make it personal</td>
            </tr>
            <tr>
              <td style={T.td}>Your session preferences (program, voice, background, duration, style)</td>
              <td style={T.td}>Stored per session; only your 10 most recent sessions are kept</td>
              <td style={T.td}>Session history and to improve future recommendations</td>
            </tr>
            <tr>
              <td style={T.td}>The text of your generated session script</td>
              <td style={T.td}>Until your account is deleted or the session is pushed out of your 10-session history</td>
              <td style={T.td}>Lets you re-read your session and review what was generated</td>
            </tr>
            <tr>
              <td style={T.td}>Your session audio</td>
              <td style={T.td}>Until your account is deleted or session is replaced</td>
              <td style={T.td}>Saved to your session history so you can replay it</td>
            </tr>
            <tr>
              <td style={T.td}>Your email address (if you create an account)</td>
              <td style={T.td}>Until you delete your account</td>
              <td style={T.td}>Account access and subscription management</td>
            </tr>
            <tr>
              <td style={T.td}>Payment information</td>
              <td style={T.td}>Never stored by us — handled by Stripe</td>
              <td style={T.td}>Subscription processing</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 style={T.h2}>What we don't store</h2>
      <ul style={T.ul}>
        <li style={T.li}>Your payment card details — Stripe processes these; we never see them</li>
        <li style={T.li}>The personal context you add in "Make it yours" (step 8 answers) — these are sent to the AI only to generate your session and are not saved to our database</li>
        <li style={T.li}>Device location</li>
        <li style={T.li}>Browsing history outside the app</li>
      </ul>

      <h2 style={T.h2}>Your AI session</h2>
      <p style={T.p}>When you generate a session, we send the following to our AI provider (OpenAI):</p>
      <ul style={T.ul}>
        <li style={T.li}>Your name (if entered)</li>
        <li style={T.li}>The program you chose (e.g., Sleep, Stress & Anxiety)</li>
        <li style={T.li}>Your session preferences (duration, voice, style)</li>
        <li style={T.li}>Any personal context you added in "Make it yours" (not saved to our database)</li>
      </ul>
      <p style={T.p}>
        Per OpenAI's API usage policy, inputs submitted via the API are not used to train AI models.
        See <a style={T.a} href="https://openai.com/policies/privacy-policy" target="_blank" rel="noreferrer">OpenAI's Privacy Policy</a> for full details.
      </p>

      <h2 style={T.h2}>Audio storage</h2>
      <p style={T.p}>
        Your session audio is stored in Supabase's secure cloud storage. Each audio file is accessible only via a unique URL tied to your session — URLs are long, randomized identifiers that are not publicly listed or searchable.
        Anyone who has the direct URL can access the file, but we do not publish or share these URLs, and they are not indexed by search engines.
      </p>

      <h2 style={T.h2}>Third-party services</h2>
      <div style={T.tbl}>
        <table style={T.table}>
          <thead>
            <tr>
              <th style={T.th}>Service</th>
              <th style={T.th}>What we share</th>
              <th style={T.th}>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={T.td}>ElevenLabs</td>
              <td style={T.td}>Your session script text</td>
              <td style={T.td}>To generate the audio voice</td>
            </tr>
            <tr>
              <td style={T.td}>OpenAI</td>
              <td style={T.td}>Your preferences and any personal context you added</td>
              <td style={T.td}>To write your session script</td>
            </tr>
            <tr>
              <td style={T.td}>Stripe</td>
              <td style={T.td}>Your email and subscription status</td>
              <td style={T.td}>Payments</td>
            </tr>
            <tr>
              <td style={T.td}>Sentry</td>
              <td style={T.td}>Error logs (no personal session content)</td>
              <td style={T.td}>App stability monitoring</td>
            </tr>
            <tr>
              <td style={T.td}>PostHog</td>
              <td style={T.td}>Payment conversion events (e.g., account upgrades)</td>
              <td style={T.td}>Tracking subscription growth — not used for session behavior</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 style={T.h2}>Deleting your data</h2>
      <p style={T.p}>
        You can delete your account from the Account screen inside the app. This deletes your session history, audio files, and personal data.
        If you need help, email <a style={T.a} href="mailto:support@mindtranceformapp.com">support@mindtranceformapp.com</a> with the subject "Delete my account" — we'll confirm deletion within 5 business days.
      </p>

      <h2 style={T.h2}>Questions</h2>
      <p style={T.p}>
        Email: <a style={T.a} href="mailto:support@mindtranceformapp.com">support@mindtranceformapp.com</a>
      </p>
      <p style={T.p}>
        See also: <a style={T.a} href="/privacy">Full Privacy Policy</a>
      </p>
    </div>
  );
}
