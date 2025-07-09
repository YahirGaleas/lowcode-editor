import { Handle } from "reactflow";
export default function EvaluatorNode({ data }) {
  return (
    <>
      <div className="evaluator-node">
        <div className="node-header">🧠 Evaluador</div>
        <div className="node-body">
          <div className="evaluator-title">{data.name || "Sin nombre"}</div>
          <div className="evaluator-summary">
            <div>
              <strong>Comparar:</strong> {data.left || ""} {data.operator || ""}{" "}
              {data.right || ""}
            </div>
            <div>
              <strong>Si verdadero:</strong> {data.ifTrue || "(sin acción)"}
            </div>
            <div>
              <strong>Si falso:</strong> {data.ifFalse || "(sin acción)"}
            </div>
          </div>
        </div>
      </div>
      <Handle type="target" position="top" />
      <Handle
        type="source"
        position="bottom"
        id="true"
        style={{ background: "#4CAF50", top: 50 }}
      />
      <Handle
        type="source"
        position="left"
        id="false"
        style={{ background: "#F44336", top: 50 }}
      />
    </>
  );
}
