const T = {
  page:    { fontFamily: "Georgia, serif", maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px", color: "#1a1a1a", lineHeight: 1.7, background: "#fff", minHeight: "100vh" },
  h1:      { fontSize: "2em", borderBottom: "2px solid #07091a", paddingBottom: 12, marginBottom: 0 },
  meta:    { color: "#555", fontSize: "0.9em", marginBottom: "2em", marginTop: "0.5em" },
  h2:      { fontSize: "1.25em", marginTop: "2em", color: "#07091a" },
  p:       { margin: "0.75em 0" },
  ul:      { paddingLeft: "1.4em" },
  li:      { marginBottom: "0.4em" },
  a:       { color: "#6b21a8" },
  table:   { width: "100%", borderCollapse: "collapse", margin: "1.5em 0", fontSize: "0.9em" },
  th:      { background: "#07091a", color: "#fff", padding: "10px 12px", textAlign: "left", fontWeight: 600 },
  td:      { padding: "9px 12px", borderBottom: "1px solid #e5e7eb", verticalAlign: "top" },
  backBtn: { background: "none", border: "none", color: "#6b21a8", cursor: "pointer", fontFamily: "inherit", fontSize: "0.95em", padding: "0 0 1.5rem", textDecoration: "underline" },
};

export function CookiesPage({ onBack }) {
  return (
    <div style={T.page}>
      <button style={T.backBtn} onClick={onBack}>← Back</button>

      <h1 style={T.h1}>Mind Tranceform — Cookie Policy</h1>
      <p style={T.meta}>Effective Date: April 23, 2026 &nbsp;|&nbsp; Last Updated: April 23, 2026</p>

      <p style={T.p}>This Cookie Policy explains how Mind Tranceform uses cookies and similar technologies when you visit <a style={T.a} href="https://app.mindtranceformapp.com">app.mindtranceformapp.com</a>.</p>

      <h2 style={T.h2}>1. What Are Cookies?</h2>
      <p style={T.p}>Cookies are small text files stored on your device by your browser. We also use <strong>localStorage</strong> — a browser storage mechanism that persists data between sessions without an expiry date. Both serve similar purposes: remembering your preferences and keeping you signed in.</p>

      <h2 style={T.h2}>2. Cookies and Storage We Use</h2>
      <table style={T.table}>
        <thead>
          <tr>
            <th style={T.th}>Name / Key</th>
            <th style={T.th}>Type</th>
            <th style={T.th}>Purpose</th>
            <th style={T.th}>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={T.td}><code>sb-*</code></td>
            <td style={T.td}>Cookie</td>
            <td style={T.td}>Supabase authentication session — keeps you signed in</td>
            <td style={T.td}>Session / 1 week</td>
          </tr>
          <tr>
            <td style={T.td}><code>mt_plan</code></td>
            <td style={T.td}>localStorage</td>
            <td style={T.td}>Stores your subscription plan to avoid redundant server calls</td>
            <td style={T.td}>Until account change</td>
          </tr>
          <tr>
            <td style={T.td}><code>mt_sessions_used</code></td>
            <td style={T.td}>localStorage</td>
            <td style={T.td}>Tracks free-tier session count locally</td>
            <td style={T.td}>Until cleared</td>
          </tr>
          <tr>
            <td style={T.td}><code>mt_safety_accepted</code></td>
            <td style={T.td}>localStorage</td>
            <td style={T.td}>Records that you have read and accepted the safety disclaimer</td>
            <td style={T.td}>Until cleared</td>
          </tr>
          <tr>
            <td style={T.td}><code>mt_terms_accepted_at</code></td>
            <td style={T.td}>localStorage</td>
            <td style={T.td}>Timestamp of Terms of Service acceptance (compliance audit trail)</td>
            <td style={T.td}>Until cleared</td>
          </tr>
          <tr>
            <td style={T.td}><code>mt_age_confirmed_at</code></td>
            <td style={T.td}>localStorage</td>
            <td style={T.td}>Timestamp of age confirmation at signup (compliance audit trail)</td>
            <td style={T.td}>Until cleared</td>
          </tr>
          <tr>
            <td style={T.td}><code>mt_session_state</code></td>
            <td style={T.td}>localStorage</td>
            <td style={T.td}>Saves active session state so it can be restored after screen lock or app suspend</td>
            <td style={T.td}>30 minutes max</td>
          </tr>
          <tr>
            <td style={T.td}><code>mt_referral_code</code></td>
            <td style={T.td}>localStorage</td>
            <td style={T.td}>Stores a referral code from the URL to credit after signup</td>
            <td style={T.td}>Until used or cleared</td>
          </tr>
          <tr>
            <td style={T.td}><code>mt_admin_key</code></td>
            <td style={T.td}>localStorage</td>
            <td style={T.td}>Admin authentication key (admin users only)</td>
            <td style={T.td}>Until cleared</td>
          </tr>
        </tbody>
      </table>

      <h2 style={T.h2}>3. Third-Party Cookies</h2>
      <p style={T.p}>Some third-party services we use may set their own cookies:</p>
      <ul style={T.ul}>
        <li style={T.li}><strong>Stripe</strong> — sets cookies on payment pages for fraud prevention and checkout security. See <a style={T.a} href="https://stripe.com/cookie-settings" target="_blank" rel="noreferrer">Stripe's cookie policy</a>.</li>
        <li style={T.li}><strong>Sentry</strong> — may use a session identifier in error reports for deduplication. No advertising tracking.</li>
      </ul>
      <p style={T.p}>We do not use Google Analytics, Meta Pixel, or any advertising or cross-site tracking cookies.</p>

      <h2 style={T.h2}>4. Essential Cookies Only</h2>
      <p style={T.p}>All cookies and localStorage entries listed above are <strong>strictly necessary</strong> for the Service to function. Without the authentication cookie, you cannot sign in. Without localStorage entries, your plan and session state cannot be preserved between page loads.</p>
      <p style={T.p}>Because we use only essential cookies, we do not display a cookie consent banner — no consent is required under ePrivacy rules for strictly necessary cookies. If we add any non-essential cookies in the future, we will update this policy and implement appropriate consent mechanisms.</p>

      <h2 style={T.h2}>5. How to Control Cookies</h2>
      <p style={T.p}>You can control cookies through your browser settings. Note that disabling the authentication cookie will prevent you from signing in. To clear localStorage, you can use your browser's developer tools (Application → Local Storage) or clear your browser's site data for this domain.</p>
      <p style={T.p}>Browser guides for managing cookies:</p>
      <ul style={T.ul}>
        <li style={T.li}><a style={T.a} href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">Google Chrome</a></li>
        <li style={T.li}><a style={T.a} href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noreferrer">Mozilla Firefox</a></li>
        <li style={T.li}><a style={T.a} href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noreferrer">Apple Safari</a></li>
        <li style={T.li}><a style={T.a} href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noreferrer">Microsoft Edge</a></li>
      </ul>

      <h2 style={T.h2}>6. Changes to This Policy</h2>
      <p style={T.p}>We will update this Cookie Policy if we change our cookie practices. We will notify you via email or an in-app notice if changes are material.</p>

      <h2 style={T.h2}>7. Contact</h2>
      <p style={T.p}>Questions about cookies? Email <a style={T.a} href="mailto:support@mindtranceformapp.com">support@mindtranceformapp.com</a>.</p>
    </div>
  );
}
