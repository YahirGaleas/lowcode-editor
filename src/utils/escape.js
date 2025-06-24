export const escapeString = (str) =>
  str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, "\\n");
