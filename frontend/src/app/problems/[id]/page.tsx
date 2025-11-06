import { notFound } from "next/navigation";
import GeneratePanel from "./GeneratePanel";

type Problem = {
  id: number;
  slug: string;
  title: string;
  description: string;
  constraints: string;
  examples: string;
  difficulty: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function getProblem(id: string): Promise<Problem | null> {
  try {
    const res = await fetch(`${API_BASE}/api/problems/${id}/`, {
      // Cache this for better performance (revalidate every hour)
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = await getProblem(id);
  if (!problem) return { title: "Problem Not Found" };
  return {
    title: `${problem.title} - LeetCode AI Test Case Generator`,
    description: problem.description.substring(0, 160),
  };
}

export default async function ProblemDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = await getProblem(id);

  if (!problem) {
    notFound();
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 16, color: "#000" }}>{problem.title}</h1>
      <div style={{ marginBottom: 8, color: "#000" }}>
        <strong>Slug:</strong> {problem.slug}
      </div>
      <div style={{ marginBottom: 24, color: "#000" }}>
        <strong>Difficulty:</strong>{" "}
        <span
          style={{
            background:
              problem.difficulty === "hard"
                ? "#ffebee"
                : problem.difficulty === "medium"
                  ? "#fff3e0"
                  : "#e8f5e9",
            padding: "2px 8px",
            borderRadius: 4,
            color: "#000",
          }}
        >
          {problem.difficulty}
        </span>
      </div>

      <section style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 24 }}>
        <h2 style={{ marginBottom: 12, color: "#000" }}>Description</h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            color: "#000",
            background: "#fff",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #eee",
          }}
        >
          {problem.description}
        </pre>
      </section>

      {problem.constraints && (
        <section style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 24 }}>
          <h2 style={{ marginBottom: 12, color: "#000" }}>Constraints</h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "#000",
              background: "#fff",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #eee",
            }}
          >
            {problem.constraints}
          </pre>
        </section>
      )}

      {problem.examples && (
        <section style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 24 }}>
          <h2 style={{ marginBottom: 12, color: "#000" }}>Examples</h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "#000",
              background: "#fff",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #eee",
            }}
          >
            {problem.examples}
          </pre>
        </section>
      )}

      {/* Client Component for interactive generation */}
      <GeneratePanel problemId={problem.id} />
    </div>
  );
}
