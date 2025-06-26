export default function IdleNode({ data }) {
  return (
    <div className="idle-node">
      <div className="node-header">⏳ Idle Timeout</div>
      <div className="node-body">
        <div className="idle-title">
          {data.name || "Sin nombre"}
        </div>
        <div className="idle-summary">
          <div>
            <strong>Tiempo de espera:</strong> {data.timeout || 0} segundos
          </div>
          <div>
            <strong>Mensaje:</strong> {data.message || "(sin mensaje)"}
          </div>
        </div>
      </div>
    </div>
  );
}
