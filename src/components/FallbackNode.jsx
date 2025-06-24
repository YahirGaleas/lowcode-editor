import { Handle } from 'reactflow';

export default function FallbackNode({ data }) {
  return (
    <>
      <div className="fallback-node" style={{
        padding: '10px',
        borderRadius: '5px',
        background: '#FFEBEE',
        border: '1px solid #E53935',
        minWidth: '150px',
        maxWidth: '200px'
      }}>
        <div className="node-header" style={{
          fontWeight: 'bold',
          marginBottom: '5px',
          color: '#B71C1C',
          fontSize: '12px'
        }}>Fallback</div>
        <div className="node-content" style={{
          color: '#333',
          fontSize: '12px',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        }}>
          {data.message?.slice(0, 60) || 'Mensaje de fallback...'}
        </div>
      </div>
      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </>
  );
}
