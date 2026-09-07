import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

import Button from "../components/common/Button";
import StatusBadge from "../components/common/StatusBadge";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import PageHeader from "../components/common/PageHeader";

import "../styles/ReportDetail.css";

function ReportDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const name = localStorage.getItem("name");

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // ========================================
  // Load Report
  // ========================================

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/Report/${id}`);

      console.log(
        "Report Details:",
        response.data
      );

      setReport(response.data);
    } catch (error) {
      console.error(
        "Report details error:",
        error
      );

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Unable to load report."
        );
      } else {
        setError(
          "Unable to connect to the server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Load on Page Open
  // ========================================

  useEffect(() => {
    loadReport();
  }, [id]);

  // ========================================
  // Submit Report
  // ========================================

  const handleSubmitReport = async () => {
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit this report?"
    );

    if (!confirmSubmit) {
      return;
    }

    try {
      setSubmitLoading(true);
      setError("");

      const response = await api.post(
        `/Report/${id}/submit`
      );

      console.log(
        "Submit Report:",
        response.data
      );

      setReport((previous) => ({
        ...previous,
        status: "Submitted",
      }));

      alert(
        "Report submitted successfully."
      );

      // Reload report
      await loadReport();

    } catch (error) {
      console.error(
        "Submit report error:",
        error
      );

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Unable to submit report."
        );
      } else {
        setError(
          "Unable to connect to the server."
        );
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // ========================================
  // Format Date
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ========================================
  // Loading
  // ========================================

  if (loading) {
    return (
      <Loading message="Loading report..." />
    );
  }

  // ========================================
  // Error
  // ========================================

  if (error && !report) {
    return (
      <div className="report-details-page">

        <ErrorMessage
          title="Unable to load report"
          message={error}
          onRetry={loadReport}
        />

        <div className="details-actions">
          <Button
            variant="secondary"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Back to Dashboard
          </Button>
        </div>

      </div>
    );
  }

  if (!report) {
    return null;
  }

  // ========================================
  // Page
  // ========================================

  return (
    <div className="report-details-page">

      {/* ==================================
          HEADER
      ================================== */}
<div className="report-details-page-header-wrapper">
      <PageHeader
        title="Report Details"
        subtitle={`Welcome, ${
          name || "Team Member"
        }`}
        showDashboard={true}
        showLogout={true}
      />
      </div>

      {/* ==================================
          MAIN
      ================================== */}

      <main className="details-container">

        {/* Error */}

        {error && (
          <ErrorMessage
            title="Something went wrong"
            message={error}
            onRetry={loadReport}
          />
        )}

        {/* ==================================
            REPORT SUMMARY
        ================================== */}

        <section className="details-card report-summary">

          <div className="summary-top">

            <div>

              <span className="details-label">
                Project
              </span>

              <h2>
                {report.projectName ||
                  `Weekly Report #${report.id}`}
              </h2>

            </div>

            <StatusBadge
              status={report.status}
            />

          </div>

          <div className="summary-grid">

            <div>
              <span className="details-label">
                Report ID
              </span>

              <strong>
                #{report.id}
              </strong>
            </div>

            <div>
              <span className="details-label">
                Week Start
              </span>

              <strong>
                {formatDate(
                  report.weekStart
                )}
              </strong>
            </div>

            <div>
              <span className="details-label">
                Week End
              </span>

              <strong>
                {formatDate(
                  report.weekEnd
                )}
              </strong>
            </div>

            <div>
              <span className="details-label">
                Submitted
              </span>

              <strong>
                {formatDate(
                  report.submittedAt
                )}
              </strong>
            </div>

          </div>

        </section>

        {/* ==================================
            WEEKLY TASKS
        ================================== */}

        <section className="details-card">

          <div className="details-section-title">

            <h2>
              Weekly Tasks
            </h2>

            <p>
              Tasks included in this weekly report.
            </p>

          </div>

          {report.tasks &&
          report.tasks.length > 0 ? (

            <div className="tasks-table-wrapper">

              <table className="tasks-table">

                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Planned %</th>
                    <th>Actual %</th>
                    <th>Planned Hours</th>
                    <th>Spent Hours</th>
                    <th>Deliverable</th>
                  </tr>
                </thead>

                <tbody>

                  {report.tasks.map(
                    (task, index) => (

                      <tr
                        key={
                          task.id ||
                          index
                        }
                      >

                        <td>
                          <strong>
                            {task.taskName}
                          </strong>
                        </td>

                        <td>
                          {task.priority}
                        </td>

                        <td>
                          {task.status}
                        </td>

                        <td>
                          {task.plannedPercent}%
                        </td>

                        <td>
                          {task.actualPercent}%
                        </td>

                        <td>
                          {task.plannedHours}
                        </td>

                        <td>
                          {task.spentHours}
                        </td>

                        <td>
                          {task.deliverable ||
                            "-"}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="no-data">
              No tasks available.
            </div>

          )}

        </section>

        {/* ==================================
            NEXT WEEK TASKS
        ================================== */}

        <section className="details-card">

          <div className="details-section-title">

            <h2>
              Next Week Tasks
            </h2>

          </div>

          <div className="details-text">

            {report.tasksPlannedNextWeek ||
              "No information provided."}

          </div>

        </section>

        {/* ==================================
            BLOCKERS & ACHIEVEMENTS
        ================================== */}

        <div className="details-two-column">

          {/* Blockers */}

          <section className="details-card">

            <div className="details-section-title">

              <h2>
                Blockers
              </h2>

            </div>

            <div className="details-text">

              {report.blockers ||
                "No blockers reported."}

            </div>

            {report.keyBlocker && (
              <span className="highlight-label">
                Key Blocker
              </span>
            )}

          </section>

          {/* Achievements */}

          <section className="details-card">

            <div className="details-section-title">

              <h2>
                Achievements
              </h2>

            </div>

            <div className="details-text">

              {report.achievements ||
                "No achievements reported."}

            </div>

            {report.keyAchievement && (
              <span className="highlight-label">
                Key Achievement
              </span>
            )}

          </section>

        </div>

        {/* ==================================
            HOURS SUMMARY
        ================================== */}

        <section className="details-card">

          <div className="details-section-title">

            <h2>
              Hours Summary
            </h2>

            <p>
              Time spent on different types of work.
            </p>

          </div>

          <div className="hours-grid">

            <div className="hours-item">

              <span>
                Development
              </span>

              <strong>
                {report.developmentHours ||
                  0} hrs
              </strong>

            </div>

            <div className="hours-item">

              <span>
                Testing
              </span>

              <strong>
                {report.testingHours ||
                  0} hrs
              </strong>

            </div>

            <div className="hours-item">

              <span>
                Meetings
              </span>

              <strong>
                {report.meetingHours ||
                  0} hrs
              </strong>

            </div>

            <div className="hours-item">

              <span>
                Documentation
              </span>

              <strong>
                {report.documentationHours ||
                  0} hrs
              </strong>

            </div>

          </div>

        </section>

        {/* ==================================
            NOTES
        ================================== */}

        <section className="details-card">

          <div className="details-section-title">

            <h2>
              Notes / Links
            </h2>

          </div>

          <div className="details-text">

            {report.notes ||
              "No notes provided."}

          </div>

        </section>

        {/* ==================================
            MANAGER REVIEW
        ================================== */}

        {(report.latestReviewComment ||
          report.lastReviewedAt) && (

          <section
            className={`details-card review-card ${
              report.status ===
              "Needs Correction"
                ? "needs-correction-card"
                : ""
            }`}
          >

            <div className="details-section-title">

              <h2>

                {report.status ===
                "Needs Correction"
                  ? "⚠️ Changes Requested"
                  : "Manager Review"}

              </h2>

              {report.status ===
                "Needs Correction" && (

                <p className="correction-message">

                  Your manager has requested
                  changes to this report. Please
                  review the comment below, edit
                  your report, and submit it again.

                </p>

              )}

            </div>

            {report.lastReviewedAt && (

              <p className="reviewed-date">

                <strong>
                  Reviewed:
                </strong>{" "}

                {formatDate(
                  report.lastReviewedAt
                )}

              </p>

            )}

            {report.latestReviewComment && (

              <div className="review-comment">

                <strong>
                  Manager's Comment
                </strong>

                <p>
                  {report.latestReviewComment}
                </p>

              </div>

            )}

          </section>

        )}

        {/* ==================================
            BOTTOM ACTIONS
        ================================== */}

        <div className="details-actions">

          {/* Back */}

          <Button
            variant="secondary"
            onClick={() =>
              navigate("/my-reports")
            }
          >
            ← Back to My Reports
          </Button>

          {/* Edit / Submit */}

          <div className="action-buttons">

            {(report.status === "Draft" ||
              report.status ===
                "Needs Correction") && (

              <>

                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate(
                      `/report/${report.id}/edit`
                    )
                  }
                  disabled={submitLoading}
                >
                  Edit Report
                </Button>

                <Button
                  variant="primary"
                  onClick={
                    handleSubmitReport
                  }
                  disabled={submitLoading}
                >
                  {submitLoading
                    ? "Submitting..."
                    : "Submit Report"}
                </Button>

              </>

            )}

          </div>

        </div>

      </main>
    </div>
  );
}

export default ReportDetails;
