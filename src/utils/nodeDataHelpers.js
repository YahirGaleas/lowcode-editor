export function getInitialDataByNodeType(node) {
  // Asegurar que node.data existe
  const nodeData = node.data || {};
  
  switch (node.type) {
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
    case "question":
    case "message":
      return {
        content: nodeData.content || "",
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
    default:
      return { ...nodeData };
  }
}