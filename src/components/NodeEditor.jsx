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

      {node.type === "start" && (
        <div className="start-config-section">
          <label>Nombre del flujo:</label>
          <input
            type="text"
            value={localData.flowName || ""}
            onChange={(e) => handleChange("flowName", e.target.value.trim())}
            placeholder="Ej. flujoBienvenida"
          />
          {(localData.flowName || "").trim() === "" && (
            <div className="error-message">
              El nombre del flujo es obligatorio.
            </div>
          )}
          {nodes.filter(
            (n) =>
              n.id !== node.id &&
              n.type === "start" &&
              n.data?.flowName === (localData.flowName || "")
          ).length > 0 && (
            <div className="error-message">
              Ya existe otro nodo de inicio con este nombre.
            </div>
          )}

          <label>Palabras clave:</label>
          {(localData.keywords || []).map((kw, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: "0.5rem", marginBottom: "0.3rem" }}
            >
              <input
                type="text"
                value={kw || ""}
                placeholder="Ej: hola"
                onChange={(e) => {
                  const newKeywords = [...(localData.keywords || [])];
                  newKeywords[index] = e.target.value;
                  handleChange("keywords", newKeywords);
                }}
              />
              <button
                onClick={() => {
                  const newKeywords = [...(localData.keywords || [])];
                  newKeywords.splice(index, 1);
                  handleChange("keywords", newKeywords);
                }}
                disabled={(localData.keywords || []).length <= 1}
              >
                ❌
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newKeywords = [...(localData.keywords || []), ""];
              handleChange("keywords", newKeywords);
            }}
            disabled={(localData.keywords || []).length >= 10}
          >
            + Añadir palabra clave
          </button>

          {/* Validaciones */}
          {(localData.keywords || []).length === 0 && (
            <div className="error-message">
              Debe haber al menos una palabra clave.
            </div>
          )}
          {(localData.keywords || []).some(
            (kw) => (kw || "").trim() === ""
          ) && (
            <div className="error-message">
              Las palabras clave no pueden estar vacías.
            </div>
          )}
          {new Set(
            (localData.keywords || []).map((k) =>
              (k || "").trim().toLowerCase()
            )
          ).size !== (localData.keywords || []).length && (
            <div className="error-message">
              No se permiten palabras clave duplicadas.
            </div>
          )}
        </div>
      )}

      {node.type === "api" && (
        <div className="api-config-section">
          <label>Nombre del API:</label>
          <input
            type="text"
            value={localData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej. Consulta IA"
          />

          <label>URL del Endpoint:</label>
          <input
            type="text"
            value={localData.url || ""}
            onChange={(e) => handleChange("url", e.target.value)}
            placeholder="https://api.example.com/endpoint"
          />

          <label>Método HTTP:</label>
          <select
            value={localData.method || "GET"}
            onChange={(e) => handleChange("method", e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <label>Entradas esperadas:</label>
          <div className="api-input-options">
            <label>
              <input
                type="checkbox"
                checked={!!localData.useText}
                onChange={(e) => handleChange("useText", e.target.checked)}
              />
              Texto
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!localData.useMedia}
                onChange={(e) => handleChange("useMedia", e.target.checked)}
              />
              Media
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!localData.useAudio}
                onChange={(e) => handleChange("useAudio", e.target.checked)}
              />
              Audio
            </label>
          </div>

          {/* Request Body dinámico */}
          <label>Cuerpo de la petición (llave: valor):</label>
          {(localData.requestBody || []).map((item, idx) => (
            <div key={`reqbody-${idx}`} className="key-value-pair">
              <input
                type="text"
                placeholder="Llave"
                value={item.key}
                onChange={(e) => {
                  const newRequestBody = [...localData.requestBody];
                  newRequestBody[idx].key = e.target.value;
                  handleChange("requestBody", newRequestBody);
                }}
              />
              <input
                type="text"
                placeholder="Valor"
                value={item.value}
                onChange={(e) => {
                  const newRequestBody = [...localData.requestBody];
                  newRequestBody[idx].value = e.target.value;
                  handleChange("requestBody", newRequestBody);
                }}
              />
              <button
                onClick={() => {
                  const newRequestBody = [...localData.requestBody];
                  newRequestBody.splice(idx, 1);
                  handleChange("requestBody", newRequestBody);
                }}
                title="Eliminar"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              handleChange("requestBody", [
                ...(localData.requestBody || []),
                { key: "", value: "" },
              ])
            }
          >
            + Añadir campo
          </button>

          {/* Variables para capturar la respuesta */}
          <label>Variables para capturar respuesta:</label>
          {(localData.responseVars || []).map((v, idx) => (
            <div key={`respvar-${idx}`} className="response-var-item">
              <input
                type="text"
                placeholder="Nombre de variable"
                value={v}
                onChange={(e) => {
                  const newResponseVars = [...localData.responseVars];
                  newResponseVars[idx] = e.target.value;
                  handleChange("responseVars", newResponseVars);
                }}
              />
              <button
                onClick={() => {
                  const newResponseVars = [...localData.responseVars];
                  newResponseVars.splice(idx, 1);
                  handleChange("responseVars", newResponseVars);
                }}
                title="Eliminar"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              handleChange("responseVars", [
                ...(localData.responseVars || []),
                "",
              ])
            }
          >
            + Añadir variable
          </button>
        </div>
      )}

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
                                className="action-type-select"
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

                              <label>Operación:</label>
                              <select
                                className="action-type-select"
                                value={action.operation || "="}
                                onChange={(e) => {
                                  const newConditions = [
                                    ...localData.conditions,
                                  ];
                                  newConditions[idx].actions[
                                    actionIdx
                                  ].operation = e.target.value;
                                  handleChange("conditions", newConditions);
                                }}
                              >
                                <option value="=">= Asignar</option>
                                {action.dataType === "numero" && (
                                  <option value="+=">+= Sumar</option>
                                )}
                                {action.dataType === "numero" && (
                                  <option value="-=">-= Restar</option>
                                )}
                                {action.dataType === "booleano" && (
                                  <option value="toggle">🔁 Invertir</option>
                                )}
                              </select>

                              {action.operation !== "toggle" && (
                                <>
                                  <label>Valor (literal o ctx.atributo):</label>
                                  <input
                                    type="text"
                                    placeholder="Ej: 10 o ctx.edad"
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
                                </>
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

      {node.type === "form" && (
        <div className="form-editor">
          <div className="input-group">
            <label>Nombre del formulario:</label>
            <input
              type="text"
              value={localData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ej. Registro Usuario"
            />
          </div>

          <div className="fields-editor">
            <label>Campos del formulario:</label>
            {(localData.fields || []).map((field, idx) => (
              <div key={idx} className="field-row">
                <input
                  type="text"
                  placeholder="Etiqueta"
                  value={field.label}
                  onChange={(e) => {
                    const updatedFields = [...localData.fields];
                    updatedFields[idx].label = e.target.value;
                    handleChange("fields", updatedFields);
                  }}
                />
                <select
                  value={field.type}
                  onChange={(e) => {
                    const updatedFields = [...localData.fields];
                    updatedFields[idx].type = e.target.value;
                    handleChange("fields", updatedFields);
                  }}
                >
                  <option value="texto">Texto</option>
                  <option value="numero">Número</option>
                  <option value="booleano">Booleano</option>
                  <option value="fecha">Fecha</option>
                </select>
                <button
                  onClick={() => {
                    const updatedFields = [...localData.fields];
                    updatedFields.splice(idx, 1);
                    handleChange("fields", updatedFields);
                  }}
                  title="Eliminar campo"
                >
                  🗑️
                </button>
              </div>
            ))}

            <button
              className="add-field-btn"
              onClick={() => {
                const updatedFields = [...(localData.fields || [])];
                updatedFields.push({ label: "", type: "texto" });
                handleChange("fields", updatedFields);
              }}
            >
              + Añadir campo
            </button>
          </div>
        </div>
      )}

      {node.type === "evaluator" && (
        <div className="evaluator-config">
          <label className="input-label">Nombre del evaluador:</label>
          <input
            type="text"
            className="input-text"
            value={localData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej. compararEdad"
          />

          <label className="input-label">Comparación:</label>
          <div className="comparison-row">
            <input
              type="text"
              className="comparison-input"
              value={localData.left || ""}
              onChange={(e) => handleChange("left", e.target.value)}
              placeholder="Izquierda (ej. edad, 18)"
            />

            <select
              className="comparison-operator"
              value={localData.operator || "=="}
              onChange={(e) => handleChange("operator", e.target.value)}
            >
              <option value="==">==</option>
              <option value="!=">!=</option>
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value=">=">&gt;=</option>
              <option value="<=">&lt;=</option>
            </select>

            <input
              type="text"
              className="comparison-input"
              value={localData.right || ""}
              onChange={(e) => handleChange("right", e.target.value)}
              placeholder="Derecha (ej. edad, 18)"
            />
          </div>

          <label className="input-label">Si es verdadero:</label>
          <input
            type="text"
            className="input-text"
            value={localData.ifTrue || ""}
            onChange={(e) => handleChange("ifTrue", e.target.value)}
            placeholder="Ej. goto:flujoEdadMayor"
          />

          <label className="input-label">Si es falso:</label>
          <input
            type="text"
            className="input-text"
            value={localData.ifFalse || ""}
            onChange={(e) => handleChange("ifFalse", e.target.value)}
            placeholder="Ej. message:Edad no válida"
          />
        </div>
      )}

      {node.type === "idle" && (
        <div className="section idle-config">
          <label>Nombre del nodo:</label>
          <input
            type="text"
            value={localData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <label>Tiempo de espera (segundos):</label>
          <input
            type="number"
            value={localData.timeout}
            onChange={(e) =>
              handleChange("timeout", parseInt(e.target.value, 10))
            }
          />

          <label>Mensaje de respuesta:</label>
          <textarea
            value={localData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder="¿Qué mensaje enviar si el usuario tarda en responder?"
          />
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
