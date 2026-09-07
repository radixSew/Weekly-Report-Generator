import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./common/StatusBadge";
import Button from "./common/Button";
import "../styles/components/ReportCard.css";

function ReportCard({ report }) {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="report-card">

      <div className="report-card-header">

        <div>
          <span className="report-label">
            Report
          </span>

          <h3>
            #{report.id}
          </h3>
        </div>

        <StatusBadge status={report.status} />

      </div>


      <div className="report-card-body">

        <div className="report-info">
          <span>Project</span>

          <strong>
            {report.projectName || "-"}
          </strong>
        </div>


        <div className="report-info">
          <span>Week Start</span>

          <strong>
            {formatDate(report.weekStart)}
          </strong>
        </div>


        <div className="report-info">
          <span>Week End</span>

          <strong>
            {formatDate(report.weekEnd)}
          </strong>
        </div>


        <div className="report-info">
          <span>Submitted</span>

          <strong>
            {formatDate(report.submittedAt)}
          </strong>
        </div>

      </div>


      <div className="report-card-footer">

        <Button
          variant="secondary"
          onClick={() =>
            navigate(
              `/report/${report.id}/versions`
            )
          }
        >
          View Versions
        </Button>


        {(report.status === "Draft" ||
          report.status === "Needs Correction") && (

          <Button
            variant="primary"
            onClick={() =>
              navigate(
                `/report/${report.id}/edit`
              )
            }
          >
            Edit
          </Button>

        )}

      </div>

    </div>
  );
}

export default ReportCard;