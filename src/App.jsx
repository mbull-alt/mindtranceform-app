import { useState } from "react";

export default function MindTranceformApp() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    name: "",
    goal: "",
    program: "Sleep",
    voice: "Female Calm",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const generateSession = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://mindtranceform-backend.onrender.com/generate-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setResult(data);
      setStep(5);
    } catch (error) {
      alert("Could not generate session.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", padding: 20 }}>
      <div style={{ maxWidth: 600, margin: "0 auto", background: "#1e293b", padding: 20, borderRadius: 10 }}>
        <h1>Mind Tranceform</h1>

        {step === 1 && (
          <div>
            <h2>Your Name</h2>
            <input
              style={{ width: "100%", padding: 10 }}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            <button onClick={next} style={{ marginTop: 10 }}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2>Your Goal</h2>
            <input
              style={{ width: "100%", padding: 10 }}
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder="Sleep better, reduce stress..."
            />
            <div style={{ marginTop: 10 }}>
              <button onClick={back}>Back</button>
              <button onClick={next} style={{ marginLeft: 10 }}>Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2>Program</h2>
            <select name="program" value={form.program} onChange={handleChange}>
              <option>Sleep</option>
              <option>Stress & Anxiety</option>
              <option>Abundance</option>
            </select>
            <div style={{ marginTop: 10 }}>
              <button onClick={back}>Back</button>
              <button onClick={next} style={{ marginLeft: 10 }}>Next</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2>Voice</h2>
            <select name="voice" value={form.voice} onChange={handleChange}>
              <option>Female Calm</option>
              <option>Male Calm</option>
              <option>Male Deep</option>
            </select>
            <div style={{ marginTop: 10 }}>
              <button onClick={back}>Back</button>
              <button onClick={generateSession} style={{ marginLeft: 10 }}>
                {loading ? "Generating..." : "Generate Session"}
              </button>
            </div>
          </div>
        )}

        {step === 5 && result && (
          <div>
            <h2>Your Personalized Session</h2>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{result.script}</p>
            <audio controls style={{ width: "100%", marginTop: 20 }}>
              <source src={result.audioUrl} type="audio/mpeg" />
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}