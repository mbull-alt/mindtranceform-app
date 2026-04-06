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
      const response = await fetch(
        "https://mindtranceform-backend.onrender.com/generate-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();
      console.log("Backend response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Could not generate session."
        );
      }

      if (!data.script) {
        throw new Error("No script returned from backend.");
      }

      if (!data.audioBase64) {
        throw new Error("No audio returned from backend.");
      }

      const audioUrl = `data:audio/mpeg;base64,${data.audioBase64}`;

      setResult({
        script: data.script,
        audioUrl,
      });

      setStep(5);
    } catch (error) {
      alert(error.message || "Could not generate session.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 650,
          margin: "0 auto",
          background: "#1e293b",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 0 20px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Mind Tranceform</h1>

        {step === 1 && (
          <div>
            <h2>Your Name</h2>
            <input
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "none",
                marginBottom: 12,
              }}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            <button
              onClick={next}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2>Your Goal</h2>
            <input
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "none",
                marginBottom: 12,
              }}
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder="Sleep better, reduce stress, confidence..."
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={back}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                onClick={next}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2>Choose Program</h2>
            <select
              name="program"
              value={form.program}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "none",
                marginBottom: 12,
              }}
            >
              <option>Sleep</option>
              <option>Stress & Anxiety</option>
              <option>Abundance</option>
            </select>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={back}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                onClick={next}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2>Choose Voice</h2>
            <select
              name="voice"
              value={form.voice}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "none",
                marginBottom: 12,
              }}
            >
              <option>Female Calm</option>
              <option>Male Calm</option>
              <option>Male Deep</option>
            </select>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={back}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                onClick={generateSession}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {loading ? "Generating..." : "Generate Session"}
              </button>
            </div>
          </div>
        )}

        {step === 5 && result && (
          <div>
            <h2>Your Personalized Session</h2>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
              {result.script}
            </p>
            <audio controls style={{ width: "100%", marginTop: 20 }}>
              <source src={result.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}