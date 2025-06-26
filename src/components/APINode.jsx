import { Handle } from "reactflow";
export default function APINode({ data }) {
  return (
    <>
    <div className="api-node">
      <div className="node-header">🌐 API Request</div>
      <div className="node-body">
        <div className="api-title">{data.name || "Sin nombre"}</div>
        <div className="api-summary">
          <div>
            <strong>URL:</strong> {data.url || "No definida"}
          </div>
          <div>
            <strong>Método:</strong> {data.method || "GET"}
          </div>
          <div>
            <strong>Entrada:</strong>{" "}
            {[
              data.useText && "Texto",
              data.useMedia && "Media",
              data.useAudio && "Audio",
            ]
              .filter(Boolean)
              .join(", ") || "Ninguna"}
          </div>
          <div>
            <strong>Request Body:</strong>{" "}
            {Array.isArray(data.requestBody) && data.requestBody.length > 0
              ? data.requestBody
                  .map(({ key, value }) => `${key}: ${value}`)
                  .join(", ")
              : "Ninguno"}
          </div>
          <div>
            <strong>Variables respuesta:</strong>{" "}
            {Array.isArray(data.responseVars) && data.responseVars.length > 0
              ? data.responseVars.filter(Boolean).join(", ")
              : "Ninguna"}
          </div>
        </div>
      </div>
    </div>
    <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </>
  );
}
