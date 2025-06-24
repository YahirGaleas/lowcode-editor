import { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";

import "reactflow/dist/style.css";

import MessageNode from "./components/MessageNode";
import QuestionNode from "./components/QuestionNode";
import StartNode from "./components/StartNode";
import ConditionNode from "./components/ConditionNode";
import NodeEditor from "./components/NodeEditor";
import ActionNode from "./components/ActionNode";
import FallbackNode from "./components/FallbackNode";
import EndFlowNode from "./components/EndFlowNode";
import GotoFlowNode from "./components/GotoFlowNode";
import FlowDynamicNode from "./components/FlowDynamic";
import SetVariable from "./components/SetVariable";

import { generateMessageNode } from "./utils/generateMessage";
import { generateQuestionNode } from "./utils/generateQuestion";

const nodeTypes = {
  message: MessageNode,
  question: QuestionNode,
  start: StartNode,
  condition: ConditionNode,
  action: ActionNode,
  fallback: FallbackNode,
  endflow: EndFlowNode,
  gotoflow: GotoFlowNode,
  flowdynamic: FlowDynamicNode,
  setvariable: SetVariable,
};

const VALID_CONNECTIONS = {
  start: ["message", "question"],
  message: [
    "message",
    "question",
    "endflow",
    "gotoflow",
    "flowDynamic",
    "fallback",
  ],
  question: ["action", "condition"],
  condition: [
    "message",
    "question",
    "endflow",
    "gotoflow",
    "flowDynamic",
    "fallback",
    "action",
  ],
  action: [
    "message",
    "question",
    "condition",
    "flowDynamic",
    "fallback",
    "endflow",
    "gotoflow",
    "action",
  ],
  fallback: [
    "message",
    "question",
    "action",
    "condition",
    "flowDynamic",
    "endflow",
    "gotoflow",
    "fallback",
  ],
  flowDynamic: [
    "action",
    "message",
    "question",
    "condition",
    "fallback",
    "endflow",
    "gotoflow",
    "flowDynamic",
  ],
  gotoflow: [],
  endflow: [],
};

const initialNodes = [
  {
    id: "1",
    type: "start",
    position: { x: 250, y: 5 },
    data: { label: "Inicio del Flujo" },
  },
];

const initialEdges = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: {
              strokeWidth: 2,
              stroke: "#555",
            },
          },
          eds
        )
      ),
    [setEdges]
  );

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: `${type} node`,
          content: "",
          ...(type === "condition" && { conditions: [] }),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const isValidConnection = useCallback(
    (connection) => {
      if (connection.source === connection.target) return false;

      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return false;

      const allowedTargets = VALID_CONNECTIONS[sourceNode.type] || [];
      return allowedTargets.includes(targetNode.type);
    },
    [nodes]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && selectedNode) {
        deleteNode(selectedNode.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedNode, deleteNode]);

  const saveFlowToBackend = async (generatedCode) => {
    try {
      const response = await fetch("http://localhost:3008/v1/flows/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flowCode: generatedCode }),
      });

      const result = await response.json();
      if (result.success) {
        alert("¡Flujo agregado correctamente!");
        // Aquí puedes actualizar la UI si es necesario
      } else {
        alert("Error al agregar el flujo");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    }
  };

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, []);

  // Modificar generateBotCode para usar saveFlowToBackend
  const generateAndSaveFlow = () => {
    const code = generateBotCode();
    //saveFlowToBackend(code);
    return code;
  };

  const generateBotCode = () => {
    let code = `import { addKeyword } from '@builderbot/bot';\n\n`;
    code += `const flow = addKeyword('hola')\n`;

    const getConnectedNodes = (nodeId) => {
      return edges
        .filter((edge) => edge.source === nodeId)
        .map((edge) => nodes.find((node) => node.id === edge.target));
    };

    if (nodes.type === "setvariable") {
      const name = escapeString(node.data?.name || "var");
      const value = node.data?.value;
      const type = node.data?.dataType;

      let finalValue = value;
      if (type === "numero") {
        finalValue = parseFloat(value);
      } else if (type === "booleano") {
        finalValue = value === "true";
      } else {
        finalValue = `"${escapeString(value)}"`;
      }

      lines.push(`await state.update({ ${name}: ${finalValue} });`);
    }

    nodes.forEach((node) => {
      switch (node.type) {
        case "message":
          code += generateMessageNode(node);
          break;
        case "question":
          code += generateQuestionNode(node, getConnectedNodes);
          break;
        case "action":
          if (node.data.code) {
            code += `  .addAction(async (ctx, { flowDynamic, state, globalState, gotoFlow, fallBack, endFlow }) => {\n`;
            code += `    ${node.data.code}\n`;
            code += `  })\n`;
          }
          break;
        case "fallback":
          if (node.data.message) {
            code += `  .addAction(async (ctx, { fallBack }) => {\n`;
            code += `    return fallBack('${escapeString(
              node.data.message
            )}');\n`;
            code += `  })\n`;
          }
          break;
        case "endflow":
          code += `  .addAction(async (_, { endFlow }) => {\n`;
          if (node.data.message) {
            code += `    return endFlow('${escapeString(
              node.data.message
            )}');\n`;
          } else {
            code += `    return endFlow();\n`;
          }
          code += `  })\n`;
          break;
        case "gotoflow":
          if (node.data.flowName) {
            code += `  .addAction(async (_, { gotoFlow }) => {\n`;
            code += `    return gotoFlow(${node.data.flowName});\n`;
            code += `  })\n`;
          }
          break;
        case "flowdynamic":
          const body = escapeString(node.data.body || "");
          const delay = node.data.delay ? `, delay: ${node.data.delay}` : "";
          const media = node.data.media
            ? `, media: '${escapeString(node.data.media)}'`
            : "";

          code += `  .addAction(async (_, { flowDynamic }) => {\n`;
          code += `    await flowDynamic([{ body: '${body}'${delay}${media} }]);\n`;
          code += `  })\n`;
          break;
      }
    });

    code += `;\n\nexport default flow;`;
    return code;
  };

  // Función auxiliar para escapar strings
  const escapeString = (str) => {
    return str.replace(/'/g, "\\'").replace(/\n/g, "\\n");
  };

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper"
          style={{ height: "100vh", width: "100vw" }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            isValidConnection={isValidConnection}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>

        <div className="sidebar">
          <div className="node-palette">
            <div
              className="dndnode setvariable"
              onDragStart={(event) => onDragStart(event, "setvariable")}
              draggable
            >
              Set Variable
            </div>
            <div
              className="dndnode start"
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData("application/reactflow", "start")
              }
            >
              Inicio
            </div>
            <div
              className="dndnode message"
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData("application/reactflow", "message")
              }
            >
              Mensaje
            </div>
            <div
              className="dndnode question"
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData("application/reactflow", "question")
              }
            >
              Pregunta
            </div>
            <div
              className="dndnode condition"
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData("application/reactflow", "condition")
              }
            >
              Condición
            </div>
            <div
              className="dndnode action"
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData("application/reactflow", "action")
              }
            >
              Acción
            </div>
            <div
              className="dndnode fallback"
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData("application/reactflow", "fallback")
              }
            >
              Fallback
            </div>
            <div
              className="dndnode endflow"
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData("application/reactflow", "endflow")
              }
            >
              End Flow
            </div>
            <div
              className="dndnode gotoflow"
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData("application/reactflow", "gotoflow")
              }
            >
              Goto Flow
            </div>
            <div
              className="dndnode flowdynamic"
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData(
                  "application/reactflow",
                  "flowdynamic"
                )
              }
            >
              Flow Dynamic
            </div>
          </div>

          {selectedNode && (
            <NodeEditor
              node={selectedNode}
              onUpdate={(nodeId, newData) => {
                updateNodeData(nodeId, newData);
              }}
              onDelete={deleteNode}
              nodes={nodes}
            />
          )}
          <div className="code-generator">
            <button
              onClick={() => {
                const code = generateAndSaveFlow();
                console.log("Código generado:", code);

                // Opción 2: Mostrar en un modal/textarea
                // setShowCodeModal(true);
                // setGeneratedCode(code);
              }}
            >
              Generar Código
            </button>
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
}
