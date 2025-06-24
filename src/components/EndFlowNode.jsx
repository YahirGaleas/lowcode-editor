import { Handle } from 'reactflow';

export default function EndFlowNode({ data }) {
  return (
    <>
      <div className="endflow-node" style={{
        padding: '10px',
        borderRadius: '5px',
        background: '#E8F5E9',
        border: '1px solid #43A047',
        minWidth: '150px',
        maxWidth: '200px'
      }}>
        <div className="node-header" style={{
          fontWeight: 'bold',
          marginBottom: '5px',
          color: '#2E7D32',
          fontSize: '12px'
        }}>End Flow</div>
        <div className="node-content" style={{
          color: '#333',
          fontSize: '12px',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        }}>
          {data.message?.slice(0, 60) || 'Finaliza el flujo'}
        </div>
      </div>
      <Handle type="target" position="top" />
    </>
  );
}
