import React from "react";
import "../../styles/components/ErrorMessage.css";

function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
}) {
  return (
    <div className="common-error">

      <h3>{title}</h3>

      {message && (
        <p>{message}</p>
      )}

      {onRetry && (
        <button
          className="error-retry-button"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}

    </div>
  );
}

export default ErrorMessage;