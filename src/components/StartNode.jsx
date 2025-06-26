import { Handle } from "reactflow";
export default function StartNode({ data }) {
  return (
    <>
    <div className="start-node">
      <div className="node-header">
        {data.flowName ? `Flujo: ${data.flowName}` : "Inicio del Flujo"}
      </div>

      {Array.isArray(data.keywords) && data.keywords.length > 0 && (
        <div className="node-keywords">
          <strong>Keywords:</strong>{" "}
          {data.keywords.filter(Boolean).join(", ") || "Ninguna"}
        </div>
      )}
      <Handle type="source" position="bottom" />
    </div>
    
    </>
  );
}
