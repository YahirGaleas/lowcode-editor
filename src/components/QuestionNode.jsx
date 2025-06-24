import { Handle } from 'reactflow';
export default function QuestionNode({ data }) {
  return (
    <>
    <div className="question-node" style={{ padding: '10px', borderRadius: '5px', background: '#FFF8E1', border: '1px solid #FFC107' }}>
      <div className="node-header" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#FF8F00' }}>Pregunta</div>
      <div className="node-content" style={{ color: '#333', fontSize: '12px', wordBreak: 'break-word' }}>
        {data.content || 'Nueva pregunta...'}
      </div>
    </div>
    <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </>
  );
}