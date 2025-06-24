import { Handle } from 'reactflow';

export default function FlowDynamicNode({ data }) {
  return (
    <>
      <div className="flowdynamic-node" style={{
        padding: '10px',
        borderRadius: '5px',
        background: '#E8F5E9',
        border: '1px solid #43A047',
        minWidth: '150px',
        maxWidth: '250px'
      }}>
        <div className="node-header" style={{
          fontWeight: 'bold',
          marginBottom: '5px',
          color: '#2E7D32',
          fontSize: '12px'
        }}>Flow Dynamic</div>
        <div className="node-content" style={{
          color: '#333',
          fontSize: '12px',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        }}>
          {data.body || 'Sin mensaje'}
        </div>
      </div>
      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </>
  );
}
