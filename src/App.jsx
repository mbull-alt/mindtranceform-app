import { useState } from "react";

export default function MindTranceformApp() {
  const [step, setStep] = useState(1);
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

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", padding: 20 }}>
      <div style={{ maxWidth: 500, margin: "0 auto", background: "#1e293b", padding: 20, borderRadius: 10 }}>
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
            </select>
            <div style={{ marginTop: 10 }}>
              <button onClick={back}>Back</button>
              <button onClick={next} style={{ marginLeft: 10 }}>Generate Session</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2>Your Session Is Being Created</h2>
            <p>This will take about 30–60 seconds.</p>
            <audio controls style={{ width: "100%" }}>
              <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}