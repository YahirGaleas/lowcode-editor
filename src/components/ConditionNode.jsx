import { Handle } from "reactflow";
export default function ConditionNode({ data }) {
  return (
    <>
      <div
        className="condition-node"
        style={{
          padding: "10px",
          borderRadius: "5px",
          background: "#F3E5F5",
          border: "1px solid #9C27B0",
        }}
      >
        <div
          className="node-header"
          style={{ fontWeight: "bold", marginBottom: "5px", color: "#7B1FA2" }}
        >
          Condición
        </div>
        <div
          className="node-conditions"
          style={{ fontSize: "12px", color: "black" }}
        >
          {data.conditions?.length > 0 ? (
            data.conditions.map((cond, idx) => (
              <div
                key={idx}
                style={{
                  margin: "3px 0",
                  padding: "3px",
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: "3px",
                }}
              >
                {cond.value || "nueva condición"}
              </div>
            ))
          ) : (
            <div style={{ color: "#999" }}>Sin condiciones</div>
          )}
        </div>
      </div>
      <Handle type="target" position="top" />
      {data.conditions?.map((cond, idx) => (
        <Handle
          key={`handle-${idx}`}
          type="source"
          position="bottom"
          id={`cond-${idx}`}
          style={{
            top: 60 + idx * 20,
            left: "100%",
            background: "#9C27B0",
          }}
        />
      ))}
    </>
  );
}
