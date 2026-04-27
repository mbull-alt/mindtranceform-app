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

export function TermsPage({ onBack }) {
  return (
    <div style={T.page}>
      <button style={T.backBtn} onClick={onBack}>← Back</button>

      <h1 style={T.h1}>Mind Tranceform — Terms of Service</h1>
      <p style={T.meta}>Effective Date: April 23, 2026 &nbsp;|&nbsp; Last Updated: April 23, 2026</p>

      <div style={T.warn}>
        <strong>Please read these Terms carefully before using Mind Tranceform.</strong> By creating an account or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
      </div>

      <h2 style={T.h2}>1. About Mind Tranceform</h2>
      <p style={T.p}>Mind Tranceform ("we," "us," or "our") is an AI-powered application that generates personalized guided meditation and hypnosis audio sessions. We are not a medical provider, therapist, or licensed mental health service. Our sessions are for relaxation, wellness, and personal development purposes only.</p>

      <h2 style={T.h2}>2. Eligibility and Age Requirements</h2>
      <div style={T.hi}>
        <strong>You must be at least 18 years old to use Mind Tranceform.</strong> By creating an account, you confirm that you are 18 years of age or older. We do not knowingly collect data from or provide services to anyone under 18. If we discover that a user is under 18, we will terminate their account immediately and delete their data.
      </div>
      <p style={T.p}>If you are between 13 and 17 years old, you may only use the Service with verified parental or guardian consent, and only for non-clinical relaxation purposes. Users under 13 are prohibited under any circumstances (COPPA).</p>

      <h2 style={T.h2}>3. Medical and Clinical Disclaimer</h2>
      <div style={T.warn}>
        <strong>Mind Tranceform is NOT a medical device, therapy service, or substitute for professional mental health care.</strong>
        <ul style={T.ul}>
          <li style={T.li}>Our sessions are not intended to diagnose, treat, cure, or prevent any mental health condition, disorder, or disease.</li>
          <li style={T.li}>Do not use Mind Tranceform as a replacement for professional medical or psychological treatment.</li>
          <li style={T.li}>If you have a history of psychosis, epilepsy, severe depression, PTSD, or any condition that may be affected by altered mental states, consult a licensed healthcare provider before use.</li>
          <li style={T.li}>Do not listen to sessions while driving, operating machinery, or in any situation requiring full alertness.</li>
          <li style={T.li}>Stop using the Service and seek professional help if you experience any adverse psychological effects.</li>
        </ul>
      </div>

      <h2 style={T.h2}>4. Your Account</h2>
      <p style={T.p}>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at <strong>support@mindtranceformapp.com</strong> if you suspect unauthorized access. We reserve the right to terminate accounts that violate these Terms.</p>

      <h2 style={T.h2}>5. Payments and Refund Policy</h2>
      <p style={T.p}>Mind Tranceform offers subscription plans and one-time session purchases processed through Stripe. All prices are in USD and do not include applicable taxes.</p>
      <div style={T.warn}>
        <strong>Refund Policy:</strong>
        <ul style={T.ul}>
          <li style={T.li}><strong>Sessions:</strong> Once an AI audio session has been generated and delivered, no refund will be issued. Session generation consumes substantial AI and voice synthesis resources that are non-recoverable.</li>
          <li style={T.li}><strong>Subscriptions:</strong> Subscription payments are non-refundable for the current billing period. You may cancel at any time, and cancellation takes effect at the end of your current paid period.</li>
          <li style={T.li}><strong>Exceptions:</strong> We will issue refunds in cases of duplicate charges, technical failures that prevented session delivery, or as required by applicable law.</li>
          <li style={T.li}><strong>Disputes:</strong> Contact us at support@mindtranceformapp.com before initiating a payment dispute. We resolve valid billing issues promptly.</li>
        </ul>
      </div>

      <h2 style={T.h2}>6. Acceptable Use</h2>
      <p style={T.p}>You agree not to:</p>
      <ul style={T.ul}>
        <li style={T.li}>Use the Service for any unlawful purpose or in violation of any applicable laws.</li>
        <li style={T.li}>Attempt to reverse-engineer, copy, or redistribute our AI-generated audio content for commercial purposes.</li>
        <li style={T.li}>Share account credentials with others or resell access to the Service.</li>
        <li style={T.li}>Attempt to circumvent any security measures or access controls.</li>
        <li style={T.li}>Use automated tools, bots, or scripts to access or scrape the Service.</li>
        <li style={T.li}>Upload or transmit any harmful, offensive, or malicious content.</li>
      </ul>

      <h2 style={T.h2}>7. Intellectual Property</h2>
      <p style={T.p}>All AI-generated audio sessions you create are licensed to you for personal, non-commercial use only. Mind Tranceform retains rights to the underlying models, technology, and platform. You may download and listen to your sessions but may not redistribute, resell, or publicly broadcast them without our written permission.</p>

      <h2 style={T.h2}>8. Privacy and Data</h2>
      <p style={T.p}>Your use of the Service is also governed by our <a style={T.a} href="/privacy">Privacy Policy</a> and <a style={T.a} href="/cookies">Cookie Policy</a>, incorporated herein by reference. Please review them to understand how we collect, use, and protect your information.</p>

      <h2 style={T.h2}>9. Disclaimers and Limitation of Liability</h2>
      <p style={T.p}>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MIND TRANCEFORM DISCLAIMS ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
      <p style={T.p}>IN NO EVENT SHALL MIND TRANCEFORM BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 90 DAYS PRECEDING THE CLAIM.</p>

      <h2 style={T.h2}>10. Dispute Resolution and Arbitration</h2>
      <div style={T.hi}>
        <strong>PLEASE READ THIS SECTION CAREFULLY — IT AFFECTS YOUR LEGAL RIGHTS.</strong>
        <p style={T.p}><strong>Binding Arbitration:</strong> Any dispute, claim, or controversy arising out of or relating to these Terms or the Service (including claims based on contract, tort, statute, fraud, misrepresentation, or any other legal theory) shall be resolved by binding individual arbitration, not in a court of law. Arbitration will be conducted by the American Arbitration Association (AAA) under its Consumer Arbitration Rules.</p>
        <p style={T.p}><strong>Class Action Waiver:</strong> YOU AND MIND TRANCEFORM AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. No arbitration or claim under these Terms shall be joined with another arbitration or claim without our consent.</p>
        <p style={T.p}><strong>Opt-Out:</strong> You may opt out of arbitration by sending written notice to support@mindtranceformapp.com within 30 days of first creating your account. Your notice must include your name, email address, and a clear statement that you are opting out of the arbitration agreement.</p>
        <p style={T.p}><strong>Exceptions:</strong> Either party may seek emergency injunctive relief in a court of competent jurisdiction to prevent irreparable harm. Small claims court remains available for qualifying disputes.</p>
        <p style={T.p}><strong>Governing Law:</strong> These Terms are governed by the laws of the State of Georgia, without regard to conflict-of-law principles. Any court proceedings permitted under these Terms shall be brought exclusively in Warner Robins (Houston County), Georgia.</p>
      </div>

      <h2 style={T.h2}>11. Termination</h2>
      <p style={T.p}>We may suspend or terminate your access to the Service at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, third parties, or the integrity of the Service. Upon termination, your right to use the Service ceases immediately. Sections 9, 10, and 12 survive termination.</p>

      <h2 style={T.h2}>12. Changes to These Terms</h2>
      <p style={T.p}>We may update these Terms from time to time. We will notify you of material changes via email or a prominent notice in the app at least 14 days before changes take effect. Continued use of the Service after changes take effect constitutes your acceptance of the updated Terms.</p>

      <h2 style={T.h2}>13. Contact</h2>
      <p style={T.p}>Questions about these Terms? Contact us at:<br />
        <strong>Mind Tranceform</strong><br />
        Email: <a style={T.a} href="mailto:support@mindtranceformapp.com">support@mindtranceformapp.com</a><br />
        Website: <a style={T.a} href="https://app.mindtranceformapp.com">app.mindtranceformapp.com</a>
      </p>
    </div>
  );
}
