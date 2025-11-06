"use client";

import { useState } from "react";
import TestCaseVisualizer from "../../components/TestCaseVisualizer";

type GeneratePanelProps = {
  problemId: number;
};

export default function GeneratePanel({ problemId }: GeneratePanelProps) {
  const [numCases, setNumCases] = useState(5);
  const [complexity, setComplexity] = useState<"low" | "medium" | "high">("medium");
  const [temperature, setTemperature] = useState(0.7);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  async function onGenerate() {
    setGenerating(true);
    setError(null);
    setResult(null);
    try {
      // Call the Next.js Route Handler
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_id: problemId,
          num_cases: numCases,
          complexity,
          temperature,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Generation failed");
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <>
      <section style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 24 }}>
        <h2 style={{ marginBottom: 12, color: "#000" }}>Generation Settings</h2>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 500, color: "#000", marginBottom: 8 }}>
            Number of cases: {numCases}
          </label>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={numCases}
            onChange={(e) => setNumCases(parseInt(e.target.value, 10))}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 500, color: "#000", marginBottom: 8 }}>
            Complexity
          </label>
          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value as any)}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 500, color: "#000", marginBottom: 8 }}>
            Temperature: {temperature.toFixed(2)}
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <button
          disabled={generating}
          onClick={onGenerate}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 6,
            border: "1px solid #0a66c2",
            background: generating ? "#9cc9f2" : "#0a66c2",
            color: "#fff",
            cursor: generating ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {generating ? "Generating…" : "Generate Test Cases"}
        </button>

        {error && <div style={{ marginTop: 12, color: "#b00020" }}>{error}</div>}
      </section>

      <section style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
        <h2 style={{ marginBottom: 12, color: "#000" }}>Results</h2>
        {!result ? (
          <div style={{ color: "#000" }}>No results yet.</div>
        ) : (
          <>
            <TestCaseVisualizer testCases={result.test_cases || []} />
            <div style={{ marginTop: 24, paddingTop: 12, borderTop: "1px solid #eee" }}>
              <details>
                <summary style={{ cursor: "pointer", fontWeight: 600, color: "#0a66c2" }}>
                  Show Raw JSON
                </summary>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    background: "#fff",
                    color: "#000",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #eee",
                    marginTop: 12,
                    fontSize: 11,
                  }}
                >
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          </>
        )}
      </section>
    </>
  );
}
