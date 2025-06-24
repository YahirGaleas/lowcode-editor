import { Handle } from 'reactflow';

export default function GotoFlowNode({ data }) {
  return (
    <>
      <div className="gotoflow-node" style={{
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
        }}>Goto Flow</div>
        <div className="node-content" style={{
          color: '#333',
          fontSize: '12px',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        }}>
          {data.flowName || 'Destino no asignado'}
        </div>
      </div>
      <Handle type="target" position="top" />
    </>
  );
}
