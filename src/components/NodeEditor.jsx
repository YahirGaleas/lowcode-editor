import { useState, useEffect, useCallback } from "react";
import ReactFlow, { useReactFlow } from "reactflow";
import { getInitialDataByNodeType } from "../utils/nodeDataHelpers";

const NodeEditor = ({ node, onUpdate, onDelete, nodes }) => {
  const [localData, setLocalData] = useState(() =>
    getInitialDataByNodeType(node)
  );

  useEffect(() => {
    setLocalData(getInitialDataByNodeType(node));
  }, [node]);

  const terminaFlujo = (actions) =>
    actions?.some((a) => a.type === "gotoFlow" || a.type === "endFlow");

  const { getNodes } = useReactFlow();
  const definedVariables = getNodes()
    .filter((n) => n.type === "setvariable")
    .map((n) => ({
      name: n.data.name,
      type: n.data.dataType,
    }));

  const handleChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onUpdate(node.id, { ...node.data, ...updatedData });
  };

  const handleConditionChange = (index, value) => {
    const newConditions = [...(localData.conditions || [])];
    newConditions[index] = { ...newConditions[index], value };
    const updatedData = { ...localData, conditions: newConditions };
    setLocalData(updatedData);
    onUpdate(node.id, { ...node.data, ...updatedData });
  };

  const addCondition = () => {
    const newCondition = {
      value: "",
      id: `cond-${Date.now()}`,
      actions: [
        {
          id: `act-${Date.now()}`,
          type: "message",
          content: "",
        },
      ],
    };
    const updatedData = {
      ...localData,
      conditions: [...(localData.conditions || []), newCondition],
    };
    setLocalData(updatedData);
    onUpdate(node.id, { ...node.data, ...updatedData });
  };

  const removeCondition = (index) => {
    const newConditions = [...(localData.conditions || [])];
    newConditions.splice(index, 1);
    const updatedData = { ...localData, conditions: newConditions };
    setLocalData(updatedData);
    onUpdate(node.id, { ...node.data, ...updatedData });
  };

  const handleResponseChange = (conditionId, value) => {
    const updatedData = {
      ...localData,
      responses: {
        ...localData.responses,
        [conditionId]: value,
      },
    };
    setLocalData(updatedData);
    onUpdate(node.id, { ...node.data, ...updatedData });
  };

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este nodo?")) {
      onDelete(node.id);
    }
  };

  return (
    <div className="node-editor" style={{ color: "grey" }}>
      <div className="editor-header">
        <h3 style={{ color: "black" }}>Editar Nodo: {node.type}</h3>
        <button onClick={handleDelete} className="delete-button">
          Eliminar Nodo
        </button>
      </div>

      {node.type === "message" && (
        <div>
          <label>Contenido del mensaje:</label>
          <textarea
            value={localData.content || ""}
            onChange={(e) => handleChange("content", e.target.value)}
            rows={4}
          />
        </div>
      )}

      {node.type === "question" && (
        <div>
          <label>Pregunta:</label>
          <textarea
            value={localData.content || ""}
            onChange={(e) => handleChange("content", e.target.value)}
            rows={4}
          />
        </div>
      )}

      {node.type === "condition" && (
        <div className="conditions-container">
          <div className="conditions-header">
            <label className="section-title">Condiciones</label>
            <button className="add-condition-btn" onClick={addCondition}>
              + Nueva Condición
            </button>
          </div>

          <div className="conditions-list">
            {Array.isArray(localData.conditions) &&
              localData.conditions.map((cond, idx) => (
                <div key={cond.id} className="condition-card">
                  {/* Header de la condición */}
                  <div className="condition-header">
                    <div className="condition-number">#{idx + 1}</div>
                    <button
                      className="delete-condition-btn"
                      onClick={() => removeCondition(idx)}
                      title="Eliminar condición"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Modo de comparación */}
                  <div className="condition-input-group">
                    <label className="input-label">Comparar contra:</label>
                    <select
                      className="condition-keyword-input"
                      value={cond.compareMode || "literal"}
                      onChange={(e) => {
                        const newConditions = [...(localData.conditions || [])];
                        newConditions[idx].compareMode = e.target.value;
                        handleChange("conditions", newConditions);
                      }}
                    >
                      <option value="literal">Valor fijo</option>
                      <option value="variable">Una variable</option>
                    </select>
                  </div>

                  {/* Valor o Variable */}
                  {(cond.compareMode || "literal") === "literal" ? (
                    <div className="condition-input-group">
                      <label className="input-label">Palabra clave:</label>
                      <input
                        type="text"
                        className="condition-keyword-input"
                        value={cond.value || ""}
                        onChange={(e) => {
                          const newConditions = [
                            ...(localData.conditions || []),
                          ];
                          newConditions[idx].value = e.target.value;
                          handleChange("conditions", newConditions);
                        }}
                        placeholder="Ej: hola, ayuda, información..."
                      />
                    </div>
                  ) : (
                    <div className="condition-input-group">
                      <label className="input-label">
                        Seleccionar variable:
                      </label>
                      <select
                        className="condition-keyword-input"
                        value={cond.variableName || ""}
                        onChange={(e) => {
                          const newConditions = [
                            ...(localData.conditions || []),
                          ];
                          newConditions[idx].variableName = e.target.value;
                          handleChange("conditions", newConditions);
                        }}
                      >
                        <option value="">-- Selecciona una variable --</option>
                        {definedVariables.map((v, i) => (
                          <option key={`${v.name}-${i}`} value={v.name}>
                            {v.name} ({v.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Sección de acciones */}
                  <div className="actions-section">
                    <div className="actions-header">
                      <label className="actions-title">
                        Acciones a ejecutar:
                      </label>
                      <button
                        className="add-action-btn"
                        disabled={terminaFlujo(cond.actions)}
                        onClick={() => {
                          const newConditions = [
                            ...(localData.conditions || []),
                          ];
                          if (!newConditions[idx].actions)
                            newConditions[idx].actions = [];
                          newConditions[idx].actions.push({
                            id: `act-${Date.now()}`,
                            type: "message",
                            content: "",
                          });
                          handleChange("conditions", newConditions);
                        }}
                      >
                        + Acción
                      </button>
                    </div>

                    {/* Lista de acciones */}
                    <div className="actions-list">
                      {(cond.actions || []).map((action, actionIdx) => (
                        <div key={action.id} className="action-item">
                          <div className="action-controls">
                            <select
                              className="action-type-select"
                              value={action.type}
                              onChange={(e) => {
                                const newConditions = [...localData.conditions];
                                newConditions[idx].actions[actionIdx] = {
                                  type: e.target.value,
                                  id: `act-${Date.now()}`,
                                  content: "",
                                };
                                handleChange("conditions", newConditions);
                              }}
                            >
                              <option value="message">📝 Enviar Mensaje</option>
                              <option value="gotoFlow">
                                🔄 Ir a otro flujo
                              </option>
                              <option value="endFlow">
                                🛑 Finalizar flujo
                              </option>
                              <option value="setVariable">
                                🧮 Establecer Variable
                              </option>
                            </select>

                            <button
                              className="delete-action-btn"
                              onClick={() => {
                                const newConditions = [
                                  ...(localData.conditions || []),
                                ];
                                newConditions[idx].actions.splice(actionIdx, 1);
                                handleChange("conditions", newConditions);
                              }}
                              title="Eliminar acción"
                            >
                              ×
                            </button>
                          </div>

                          {/* Input condicional según el tipo de acción */}
                          {action.type === "setVariable" && (
                            <div className="action-setvariable-group">
                              <label>Nombre de la variable:</label>
                              <select
                                value={action.variableName || ""}
                                onChange={(e) => {
                                  const selected = definedVariables.find(
                                    (v) => v.name === e.target.value
                                  );
                                  const newConditions = [
                                    ...localData.conditions,
                                  ];
                                  newConditions[idx].actions[
                                    actionIdx
                                  ].variableName = selected?.name || "";
                                  newConditions[idx].actions[
                                    actionIdx
                                  ].dataType = selected?.type || "texto";
                                  handleChange("conditions", newConditions);
                                }}
                              >
                                <option value="">
                                  -- Selecciona una variable --
                                </option>
                                {definedVariables.map((v) => (
                                  <option key={v.name} value={v.name}>
                                    {v.name} ({v.type})
                                  </option>
                                ))}
                              </select>

                              <label>Tipo de dato:</label>
                              <input
                                type="text"
                                value={action.dataType || "texto"}
                                readOnly
                                disabled
                                style={{
                                  backgroundColor: "#f5f5f5",
                                  cursor: "not-allowed",
                                }}
                              />

                              <label>Valor:</label>
                              {action.dataType === "booleano" ? (
                                <select
                                  value={action.value || "false"}
                                  onChange={(e) => {
                                    const newConditions = [
                                      ...localData.conditions,
                                    ];
                                    newConditions[idx].actions[
                                      actionIdx
                                    ].value = e.target.value;
                                    handleChange("conditions", newConditions);
                                  }}
                                >
                                  <option value="true">Verdadero</option>
                                  <option value="false">Falso</option>
                                </select>
                              ) : (
                                <input
                                  type={
                                    action.dataType === "fecha"
                                      ? "date"
                                      : action.dataType === "numero"
                                      ? "number"
                                      : "text"
                                  }
                                  value={action.value || ""}
                                  onChange={(e) => {
                                    const newConditions = [
                                      ...localData.conditions,
                                    ];
                                    newConditions[idx].actions[
                                      actionIdx
                                    ].value = e.target.value;
                                    handleChange("conditions", newConditions);
                                  }}
                                />
                              )}
                            </div>
                          )}

                          {action.type === "message" && (
                            <div className="action-input-group">
                              <input
                                type="text"
                                className="action-content-input"
                                placeholder="Escribe el mensaje que se enviará..."
                                value={action.content || ""}
                                onChange={(e) => {
                                  const newConditions = [
                                    ...(localData.conditions || []),
                                  ];
                                  newConditions[idx].actions[
                                    actionIdx
                                  ].content = e.target.value;
                                  handleChange("conditions", newConditions);
                                }}
                              />
                            </div>
                          )}

                          {action.type === "gotoFlow" && (
                            <div className="action-input-group">
                              <input
                                type="text"
                                className="action-content-input"
                                placeholder="Nombre del flujo de destino..."
                                value={action.flowName || ""}
                                onChange={(e) => {
                                  const newConditions = [
                                    ...(localData.conditions || []),
                                  ];
                                  newConditions[idx].actions[
                                    actionIdx
                                  ].flowName = e.target.value;
                                  handleChange("conditions", newConditions);
                                }}
                              />
                            </div>
                          )}

                          {action.type === "endFlow" && (
                            <div className="action-info">
                              <span className="end-flow-message">
                                ✅ El flujo terminará después de esta acción
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Mensaje de advertencia */}
                    {terminaFlujo(cond.actions) && (
                      <div className="flow-end-warning">
                        <span className="warning-icon">⚠️</span>
                        Esta condición finaliza el flujo. No se pueden añadir
                        más acciones.
                      </div>
                    )}

                    {/* Placeholder cuando no hay acciones */}
                    {(!cond.actions || cond.actions.length === 0) && (
                      <div className="no-actions-placeholder">
                        <span className="placeholder-text">
                          No hay acciones configuradas. Haz clic en "+ Acción"
                          para añadir una.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Placeholder cuando no hay condiciones */}
          {(!localData.conditions || localData.conditions.length === 0) && (
            <div className="no-conditions-placeholder">
              <div className="placeholder-content">
                <span className="placeholder-icon">🎯</span>
                <h4>Sin condiciones configuradas</h4>
                <p>
                  Las condiciones permiten que el bot responda de manera
                  diferente según las palabras clave que detecte.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {node.type === "setvariable" && (
        <div>
          <label>Nombre de la variable:</label>
          <input
            type="text"
            value={localData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej. usuarioNombre"
          />

          <label>Tipo de dato:</label>
          <select
            value={localData.dataType || "texto"}
            onChange={(e) => handleChange("dataType", e.target.value)}
          >
            <option value="texto">Texto</option>
            <option value="numero">Número</option>
            <option value="booleano">Booleano</option>
            <option value="fecha">Fecha</option>
          </select>

          <label>Valor:</label>
          {localData.dataType === "booleano" ? (
            <select
              value={localData.value || "false"}
              onChange={(e) => handleChange("value", e.target.value)}
            >
              <option value="true">Verdadero</option>
              <option value="false">Falso</option>
            </select>
          ) : (
            <input
              type={
                localData.dataType === "fecha"
                  ? "date"
                  : localData.dataType === "numero"
                  ? "number"
                  : "text"
              }
              value={localData.value || ""}
              onChange={(e) => handleChange("value", e.target.value)}
            />
          )}
        </div>
      )}

      {node.type === "action" && (
        <div>
          <label>Código de acción personalizada (JS):</label>
          <textarea
            value={localData.code || ""}
            onChange={(e) => handleChange("code", e.target.value)}
            rows={6}
            placeholder="Ej: await flowDynamic('Mensaje dinámico');"
          />
        </div>
      )}
      {node.type === "fallback" && (
        <div>
          <label>Mensaje de Fallback:</label>
          <textarea
            value={localData.message || ""}
            onChange={(e) => handleChange("message", e.target.value)}
            rows={3}
          />
        </div>
      )}
      {node.type === "endflow" && (
        <div>
          <label>Mensaje final (opcional):</label>
          <textarea
            value={localData.message || ""}
            onChange={(e) => handleChange("message", e.target.value)}
            rows={3}
          />
        </div>
      )}
      {node.type === "gotoflow" && (
        <div>
          <label>Nombre del flujo destino:</label>
          <input
            type="text"
            value={localData.flowName || ""}
            onChange={(e) => handleChange("flowName", e.target.value)}
            placeholder="Ej. flowUserRegistered"
          />
        </div>
      )}
      {node.type === "flowdynamic" && (
        <div>
          <label>Mensaje dinámico:</label>
          <textarea
            value={localData.body || ""}
            onChange={(e) => handleChange("body", e.target.value)}
            placeholder="Texto del mensaje"
            rows={3}
          />

          <label>Delay (ms):</label>
          <input
            type="number"
            value={localData.delay || ""}
            onChange={(e) => handleChange("delay", Number(e.target.value))}
            placeholder="Ej. 1000"
          />

          <label>Media (URL o ruta local):</label>
          <input
            type="text"
            value={localData.media || ""}
            onChange={(e) => handleChange("media", e.target.value)}
            placeholder="https://..."
          />
        </div>
      )}
    </div>
  );
};

export default NodeEditor;
