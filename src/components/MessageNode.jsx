import { Handle } from 'reactflow';

export default function MessageNode({ data }) {
  return (
    <>
    <div className="message-node" style={{ 
      padding: '10px', 
      borderRadius: '5px', 
      background: '#E3F2FD', 
      border: '1px solid #2196F3',
      minWidth: '150px',
      maxWidth: '200px'
    }}>
      <div className="node-header" style={{ 
        fontWeight: 'bold', 
        marginBottom: '5px', 
        color: '#1565C0',
        fontSize: '12px'
      }}>Mensaje</div>
      <div className="node-content" style={{ 
        color: '#333', 
        fontSize: '12px', 
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap'
      }}>
        {data.content || 'Nuevo mensaje...'}
      </div>
    </div>
    <Handle type="target" position="top" />
    <Handle type="source" position="bottom" />
  </>
  );
}