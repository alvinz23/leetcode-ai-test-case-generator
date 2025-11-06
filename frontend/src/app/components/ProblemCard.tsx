"use client";

import Link from "next/link";

type Problem = {
  id: number;
  slug: string;
  title: string;
  description: string;
  constraints: string;
  examples: string;
  difficulty: string;
};

type ProblemCardProps = {
  problem: Problem;
};

export default function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <li>
      <Link href={`/problems/${problem.id}`}>
        <div
          style={{
            border: "1px solid #ddd",
            background: "#fff",
            padding: 12,
            borderRadius: 6,
            cursor: "pointer",
            transition: "all 0.2s",
            color: "#000",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#f0f8ff";
            (e.currentTarget as HTMLElement).style.borderColor = "#0a66c2";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#fff";
            (e.currentTarget as HTMLElement).style.borderColor = "#ddd";
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 600, color: "#000" }}>{problem.title}</span>
            <span
              style={{
                fontSize: 12,
                textTransform: "capitalize",
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
          <div style={{ fontSize: 12, color: "#666" }}>{problem.slug}</div>
        </div>
      </Link>
    </li>
  );
}

