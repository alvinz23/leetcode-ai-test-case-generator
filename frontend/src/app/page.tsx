"use client";

import { useEffect, useMemo, useState } from "react";
import ProblemCard from "./components/ProblemCard";

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

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [search, setSearch] = useState("");

  const query = useMemo(() => search.trim(), [search]);

  // Fetch all problems once on mount
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    async function load() {
      setLoadingProblems(true);
      try {
        const res = await fetch(`${API_BASE}/api/problems/?page_size=200`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to load problems (${res.status})`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.results;
        if (active) setProblems(items || []);
      } catch (e: any) {
        if (active) console.error(e.message);
      } finally {
        if (active) setLoadingProblems(false);
      }
    }
    load();
    return () => {
      active = false;
      controller.abort();
    };
  }, []); // Empty dependency - only fetch on mount

  // Filter problems locally based on search query
  const filtered = useMemo(() => {
    if (!query) return problems;
    return problems.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, problems]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 16, color: "#000" }}>LeetCode AI Test Case Generator</h1>

      <section style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#000" }}>
          Search problems
        </label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or slug..."
          style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 6 }}
        />
      </section>

      <section style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 12, color: "#000" }}>All Problems ({filtered.length})</div>
        {loadingProblems ? (
          <div style={{ color: "#000" }}>Loading problems...</div>
        ) : filtered.length === 0 ? (
          <div style={{ color: "#000" }}>No problems found</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
            {filtered.map((p) => (
              <ProblemCard key={p.id} problem={p} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
