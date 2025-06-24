import { escapeString } from './escape.js';

export const generateMessageNode = (node) => {
  return node.data.content
    ? `  .addAnswer('${escapeString(node.data.content)}')\n`
    : '';
};