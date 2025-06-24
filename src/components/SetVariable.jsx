import React from "react";
import { Handle } from "reactflow";

function SetVariable({ data }) {
  const name = data?.name || "variable";
  const value = data?.value ?? "—";
  const type = data?.dataType || "texto";

  return (
    <div className="dndnode setvariable">
      <div>
        <strong>{name}</strong> ={" "}
        <span style={{ fontStyle: "italic", color: "#555" }}>
          {type === "booleano" ? (value === "true" ? "✔️" : "❌") : value}
        </span>
      </div>
    </div>
  );
}

export default SetVariable;
