"use client";

import { parseTestCase, ParsedTestCase } from "../utils/visualizeTestCase";

type TestCaseVisualizerProps = {
  testCases: any[];
};

function renderArray(arr: any) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {arr.map((item: any, i: number) => (
        <div
          key={i}
          style={{
            background: "#f0f8ff",
            border: "1px solid #0a66c2",
            padding: "6px 10px",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {typeof item === "object" ? JSON.stringify(item) : String(item)}
        </div>
      ))}
    </div>
  );
}

function renderMatrix(matrix: any) {
  return (
    <table style={{ borderCollapse: "collapse", fontSize: 12 }}>
      <tbody>
        {matrix.map((row: any, i: number) => (
          <tr key={i}>
            {row.map((cell: any, j: number) => (
              <td
                key={j}
                style={{
                  border: "1px solid #ddd",
                  padding: "6px 10px",
                  textAlign: "center",
                  background: "#f9f9f9",
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderTree(root: any) {
  return (
    <pre style={{ background: "#f5f5f5", padding: 8, borderRadius: 4, fontSize: 11, overflow: "auto" }}>
      {JSON.stringify(root, null, 2)}
    </pre>
  );
}

function renderLinkedList(head: any) {
  let current = head;
  const values = [];
  while (current && values.length < 20) {
    values.push(current.val);
    current = current.next;
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
      {values.map((val: any, i: number) => (
        <div key={i}>
          <div
            style={{
              background: "#e8f5e9",
              border: "1px solid #4caf50",
              padding: "6px 10px",
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            {val}
          </div>
          {i < values.length - 1 && <div style={{ marginTop: -8 }}>→</div>}
        </div>
      ))}
      {current && <div style={{ marginLeft: 8 }}>...</div>}
    </div>
  );
}

function renderGraph(obj: any) {
  return (
    <pre style={{ background: "#f5f5f5", padding: 8, borderRadius: 4, fontSize: 11, overflow: "auto" }}>
      {JSON.stringify(obj, null, 2)}
    </pre>
  );
}

function renderVisualization(parsed: ParsedTestCase) {
  const { parsedInput, visualizationType } = parsed;

  switch (visualizationType) {
    case "array":
      return renderArray(parsedInput);
    case "matrix":
      return renderMatrix(parsedInput);
    case "tree":
      return renderTree(parsedInput[0]);
    case "linkedlist":
      return renderLinkedList(parsedInput[0]);
    case "graph":
      return renderGraph(parsedInput);
    case "string":
      return (
        <div
          style={{
            background: "#fff3e0",
            border: "1px solid #ff9800",
            padding: "8px 12px",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 500,
            wordBreak: "break-all",
          }}
        >
          "{parsedInput}"
        </div>
      );
    case "number":
      return (
        <div
          style={{
            background: "#ede7f6",
            border: "1px solid #673ab7",
            padding: "8px 12px",
            borderRadius: 4,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {parsedInput}
        </div>
      );
    default:
      return (
        <pre style={{ background: "#f5f5f5", padding: 8, borderRadius: 4, fontSize: 11, overflow: "auto" }}>
          {JSON.stringify(parsedInput, null, 2)}
        </pre>
      );
  }
}

export default function TestCaseVisualizer({ testCases }: TestCaseVisualizerProps) {
  if (!testCases || testCases.length === 0) {
    return <div style={{ color: "#000" }}>No test cases to display.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {testCases.map((testCase, idx) => {
        const parsed = parseTestCase(testCase);
        return (
          <div
            key={idx}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: 16,
              background: "#fafafa",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span
                  style={{
                    fontWeight: 600,
                    color: "#000",
                    fontSize: 14,
                  }}
                >
                  Test Case {idx + 1}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    background:
                      parsed.category === "base"
                        ? "#e8f5e9"
                        : parsed.category === "edge"
                          ? "#fff3e0"
                          : "#ffebee",
                    color:
                      parsed.category === "base"
                        ? "#2e7d32"
                        : parsed.category === "edge"
                          ? "#e65100"
                          : "#c62828",
                    padding: "4px 8px",
                    borderRadius: 4,
                    textTransform: "capitalize",
                    fontWeight: 500,
                  }}
                >
                  {parsed.category}
                </span>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 8 }}>
                  Input ({parsed.visualizationType}):
                </div>
                {renderVisualization(parsed)}
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 8 }}>
                  Expected Output:
                </div>
                <div
                  style={{
                    background: "#f0f8ff",
                    border: "1px solid #0a66c2",
                    padding: "8px 12px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    wordBreak: "break-all",
                  }}
                >
                  {parsed.expectedOutput}
                </div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: "#999", paddingTop: 12, borderTop: "1px solid #ddd" }}>
              Raw JSON:
              <pre
                style={{
                  background: "#fff",
                  padding: 8,
                  borderRadius: 4,
                  fontSize: 10,
                  overflow: "auto",
                  marginTop: 8,
                }}
              >
                {JSON.stringify(testCase, null, 2)}
              </pre>
            </div>
          </div>
        );
      })}
    </div>
  );
}

