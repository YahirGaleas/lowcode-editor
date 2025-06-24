import { escapeString } from "./escape.js";

export const generateQuestionNode = (node, getConnectedNodes) => {
  let code = `  .addAnswer('${escapeString(node.data.content)}')\n`;
  code += `  .addAction({ capture: true }, async (ctx, { gotoFlow, flowDynamic, endFlow, fallBack }) => {\n`;

  // Obtener nodos de condición conectados directamente
  const conditionNodes = getConnectedNodes(node.id).filter(
    (n) => n?.type === "condition"
  );

  conditionNodes.forEach((conditionNode) => {
    conditionNode.data.conditions?.forEach((cond) => {
      const keyword = escapeString(cond.value.toLowerCase());
      code += `    if (ctx.body.toLowerCase().includes('${keyword}')) {\n`;

      (cond.actions || []).forEach((action) => {
        switch (action.type) {
          case "message":
            code += `      await flowDynamic('${escapeString(
              action.content
            )}');\n`;
            break;
          case "gotoFlow":
            code += `      return gotoFlow(${action.flowName});\n`;
            break;
          case "endFlow":
            code += `      return endFlow();\n`;
            break;
        }
      });

      code += `    }\n`;
    });
  });

  code += `    return fallBack('Opción no reconocida');\n`;
  code += `  })\n`;
  return code;
};
