import { Handle } from "reactflow";

export default function FormNode({ data }) {
  return (
    <>
    <div className="form-node">
      <div className="node-header">📝 Formulario</div>
      <div className="node-body">
        <div className="form-name">
          {data.name || "Sin título"}
        </div>
        <div className="form-summary">
          <strong>Campos:</strong> {Array.isArray(data.fields) ? data.fields.length : 0}
        </div>
      </div>
    </div>
    <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </>
  );
}
