import { Handle } from 'reactflow';

export default function ActionNode({ data }) {
  return (
    <>
      <div className="action-node" style={{
        padding: '10px',
        borderRadius: '5px',
        background: '#FFF3E0',
        border: '1px solid #FB8C00',
        minWidth: '150px',
        maxWidth: '200px'
      }}>
        <div className="node-header" style={{
          fontWeight: 'bold',
          marginBottom: '5px',
          color: '#EF6C00',
          fontSize: '12px'
        }}>Acción</div>
        <div className="node-content" style={{
          color: '#333',
          fontSize: '12px',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        }}>
          {data.code?.slice(0, 60) || 'Sin acción definida'}
        </div>
      </div>
      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </>
  );
}
