"use client";

type TreeNode = {
  val: number | string;
  left?: TreeNode | null;
  right?: TreeNode | null;
};

type TreeVisualizerProps = {
  root: TreeNode | null;
};

function renderTreeNode(node: TreeNode | null | undefined, isLeft: boolean = false): React.ReactNode {
  if (!node) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Draw the node */}
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "#0a66c2",
          border: "2px solid #005a87",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {node.val}
      </div>

      {/* Draw children */}
      {(node.left || node.right) && (
        <div
          style={{
            display: "flex",
            gap: 40,
            justifyContent: "center",
          }}
        >
          {node.left ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 2,
                  height: 20,
                  background: "#999",
                }}
              />
              {renderTreeNode(node.left, true)}
            </div>
          ) : (
            <div style={{ width: 60 }} />
          )}

          {node.right ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 2,
                  height: 20,
                  background: "#999",
                }}
              />
              {renderTreeNode(node.right, false)}
            </div>
          ) : (
            <div style={{ width: 60 }} />
          )}
        </div>
      )}
    </div>
  );
}

export default function TreeVisualizer({ root }: TreeVisualizerProps) {
  if (!root) {
    return <div style={{ color: "#999", fontSize: 12 }}>Empty tree (null)</div>;
  }

  return (
    <div
      style={{
        background: "#fafafa",
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        padding: 16,
        overflowX: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ paddingBottom: 16 }}>{renderTreeNode(root)}</div>
    </div>
  );
}

