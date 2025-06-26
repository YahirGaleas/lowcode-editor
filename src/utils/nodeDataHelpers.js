export function getInitialDataByNodeType(node) {
  // Asegurar que node.data existe
  const nodeData = node.data || {};

  switch (node.type) {
    case "start":
      return {
        flowName: nodeData.flowName || "",
        keywords: nodeData.keywords || [""],
      };
    case "setvariable":
      return {
        name: nodeData.name || "",
        dataType: nodeData.dataType || "texto",
        value: nodeData.value || "",
      };
    case "condition":
      return {
        content: nodeData.content || "",
        conditions: nodeData.conditions || [],
        responses: nodeData.responses || {},
      };

    case "api":
      return {
        name: nodeData.name || "",
        url: nodeData.url || "",
        method: nodeData.method || "GET",
        useText: nodeData.useText || false,
        useMedia: nodeData.useMedia || false,
        useAudio: nodeData.useAudio || false,
        requestBody: nodeData.requestBody || [{ key: "", value: "" }], // Por defecto un campo vacío
        responseVars: nodeData.responseVars || [""], // Por defecto un campo vacío
      };

    case "question":
    case "message":
      return {
        content: nodeData.content || "",
      };

    case "idle":
      return {
        name: nodeData.name || "",
        timeout: nodeData.timeout || 60,
        message: nodeData.message || "",
      };

    case "flowdynamic":
      return {
        body: nodeData.body || "",
        delay: nodeData.delay || 0,
        media: nodeData.media || "",
      };
    case "gotoflow":
      return {
        flowName: nodeData.flowName || "",
      };
    case "endflow":
    case "fallback":
      return {
        message: nodeData.message || "",
      };
    case "action":
      return {
        code: nodeData.code || "",
      };
    case "form":
      return {
        name: nodeData.name || "",
        fields: nodeData.fields || [],
      };

    case "evaluator":
      return {
        name: nodeData.name || "",
        left: nodeData.left || "",
        operator: nodeData.operator || "==",
        right: nodeData.right || "",
        ifTrue: nodeData.ifTrue || "",
        ifFalse: nodeData.ifFalse || "",
      };

    default:
      return { ...nodeData };
  }
}
