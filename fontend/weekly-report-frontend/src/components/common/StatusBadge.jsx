import React from "react";
import "../../styles/components/StatusBadge.css";

function StatusBadge({ status }) {
  if (!status) {
    return null;
  }

  const statusClass = status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span
      className={`status-badge status-${statusClass}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;