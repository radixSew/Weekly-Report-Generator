import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "../../styles/ManagerReportReview.css";

function ManagerReportReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [reviewHistory, setReviewHistory] = useState([]);

  // --------------------------------------------------
  // Load Report + Review History
  // --------------------------------------------------
  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      // Load report
      const response = await api.get(`/manager/reports/${id}`);

      console.log("Manager Report:", response.data);

      setReport(response.data);

      // Load review history
      try {
        const historyResponse = await api.get(
          `/manager/reports/${id}/review-history`,
        );

        console.log("Review History:", historyResponse.data);

        setReviewHistory(historyResponse.data);
      } catch (historyError) {
        console.error("Review history error:", historyError);

        // Don't stop the whole page
        // if history fails to load.
        setReviewHistory([]);
      }
    } catch (error) {
      console.error("Error loading report:", error);

      setError(error.response?.data?.message || "Unable to load report.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Approve Report
  // --------------------------------------------------
  const handleApprove = async () => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this report?",
    );

    if (!confirmApprove) {
      return;
    }

    try {
      setProcessing(true);

      await api.post(`/manager/reports/${id}/approve`, {
        comment: comment,
      });

      alert("Report approved successfully.");

      navigate("/manager/dashboard");
    } catch (error) {
      console.error("Approve error:", error);

      alert(error.response?.data?.message || "Unable to approve report.");
    } finally {
      setProcessing(false);
    }
  };

  // --------------------------------------------------
  // Request Changes
  // --------------------------------------------------
  const handleRequestChanges = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment before requesting changes.");
      return;
    }

    const confirmChanges = window.confirm(
      "Are you sure you want to request changes to this report?",
    );

    if (!confirmChanges) {
      return;
    }

    try {
      setProcessing(true);

      await api.post(`/manager/reports/${id}/request-changes`, {
        comment: comment,
      });

      alert("Changes requested successfully.");

      navigate("/manager/dashboard");
    } catch (error) {
      console.error("Request changes error:", error);

      alert(error.response?.data?.message || "Unable to request changes.");
    } finally {
      setProcessing(false);
    }
  };

  // --------------------------------------------------
  // Format Date
  // --------------------------------------------------
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // Format Date + Time
  // --------------------------------------------------
  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="manager-review-page">
        <div className="review-loading">
          <h2>Loading report...</h2>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div className="manager-review-page">
        <div className="review-error">
          <h2>Unable to load report</h2>

          <p>{error}</p>

          <button onClick={() => navigate("/manager/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // No Report
  // --------------------------------------------------
  if (!report) {
    return null;
  }

  return (
    <div className="manager-review-page">
      {/* ==========================================
                HEADER
            ========================================== */}

      <header className="review-header">
        <div>
          <h1>Review Report #{report.id}</h1>

          <p>Review the weekly report submitted by the team member.</p>
        </div>

        <div className="review-header-actions">
          <button
            className="versions-button"
            onClick={() => navigate(`/manager/reports/${id}/versions`)}
          >
            View Versions
          </button>

          <button
            className="back-button"
            onClick={() => navigate("/manager/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="review-container">
        {/* ========================================
                    REPORT INFORMATION
                ======================================== */}

        <section className="review-card">
          <h2>Report Information</h2>

          <div className="review-info-grid">
            <div>
              <span>Team Member</span>

              <strong>{report.userName || "-"}</strong>
            </div>

            <div>
              <span>Email</span>

              <strong>{report.userEmail || "-"}</strong>
            </div>

            <div>
              <span>Project</span>

              <strong>{report.projectName || "-"}</strong>
            </div>

            <div>
              <span>Status</span>

              <strong>{report.status || "-"}</strong>
            </div>

            <div>
              <span>Week Start</span>

              <strong>{formatDate(report.weekStart)}</strong>
            </div>

            <div>
              <span>Week End</span>

              <strong>{formatDate(report.weekEnd)}</strong>
            </div>

            <div>
              <span>Submitted</span>

              <strong>{formatDateTime(report.submittedAt)}</strong>
            </div>
          </div>
        </section>

        {/* ========================================
                    TASKS
                ======================================== */}

        <section className="review-card">
          <h2>Tasks</h2>

          {report.tasks && report.tasks.length > 0 ? (
            <div className="tasks-table-wrapper">
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>Task</th>

                    <th>Priority</th>

                    <th>Planned %</th>

                    <th>Actual %</th>

                    <th>Status</th>

                    <th>Planned Hours</th>

                    <th>Spent Hours</th>

                    <th>Deliverable</th>
                  </tr>
                </thead>

                <tbody>
                  {report.tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.taskName || "-"}</td>

                      <td>{task.priority || "-"}</td>

                      <td>{task.plannedPercent ?? 0}%</td>

                      <td>{task.actualPercent ?? 0}%</td>

                      <td>{task.status || "-"}</td>

                      <td>{task.plannedHours ?? 0}</td>

                      <td>{task.spentHours ?? 0}</td>

                      <td>{task.deliverable || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-section">No tasks added to this report.</p>
          )}
        </section>

        {/* ========================================
                    PLANNED TASKS
                ======================================== */}

        <section className="review-card">
          <h2>Tasks Planned for Next Week</h2>

          <p className="report-text">
            {report.tasksPlannedNextWeek || "No information provided."}
          </p>
        </section>

        {/* ========================================
                    ACHIEVEMENTS
                ======================================== */}

        <section className="review-card">
          <h2>Achievements</h2>

          <p className="report-text">
            {report.achievements || "No achievements provided."}
          </p>

          <div className="boolean-info">
            <strong>Key Achievement:</strong>

            <span>{report.keyAchievement ? "Yes" : "No"}</span>
          </div>
        </section>

        {/* ========================================
                    BLOCKERS
                ======================================== */}

        <section className="review-card">
          <h2>Blockers</h2>

          <p className="report-text">
            {report.blockers || "No blockers reported."}
          </p>

          <div className="boolean-info">
            <strong>Key Blocker:</strong>

            <span>{report.keyBlocker ? "Yes" : "No"}</span>
          </div>
        </section>

        {/* ========================================
                    WORKING HOURS
                ======================================== */}

        <section className="review-card">
          <h2>Working Hours</h2>

          <div className="hours-grid">
            <div>
              <span>Development</span>

              <strong>{report.developmentHours ?? 0} hours</strong>
            </div>

            <div>
              <span>Testing</span>

              <strong>{report.testingHours ?? 0} hours</strong>
            </div>

            <div>
              <span>Meetings</span>

              <strong>{report.meetingHours ?? 0} hours</strong>
            </div>

            <div>
              <span>Documentation</span>

              <strong>{report.documentationHours ?? 0} hours</strong>
            </div>
          </div>
        </section>

        {/* ========================================
                    NOTES
                ======================================== */}

        <section className="review-card">
          <h2>Notes</h2>

          <p className="report-text">{report.notes || "No notes provided."}</p>
        </section>

        {/* ========================================
                    MANAGER REVIEW ACTION
                ======================================== */}

        <section className="review-card review-action-card">
          <h2>Manager Review</h2>

          <label htmlFor="comment">Review Comment</label>

          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your review comment..."
            rows="5"
          />

          <div className="review-buttons">
            <button
              className="approve-button"
              onClick={handleApprove}
              disabled={processing}
            >
              {processing ? "Processing..." : "✓ Approve Report"}
            </button>

            <button
              className="changes-button"
              onClick={handleRequestChanges}
              disabled={processing}
            >
              {processing ? "Processing..." : "Request Changes"}
            </button>
          </div>
        </section>

        {/* ========================================
                    REVIEW HISTORY
                ======================================== */}

        <section className="review-card">
          <div className="review-history-title">
            <div>
              <h2>Review History</h2>

              <p>Previous manager actions and comments for this report.</p>
            </div>
          </div>

          {reviewHistory.length === 0 ? (
            <p className="empty-section">No review history available.</p>
          ) : (
            <div className="review-history-list">
              {reviewHistory.map((item) => (
                <div className="review-history-item" key={item.id}>
                  <div className="review-history-header">
                    <strong>{item.action || "Review Action"}</strong>

                    <span>{formatDateTime(item.createdAt)}</span>
                  </div>

                  <div className="review-history-reviewer">
                    <strong>Reviewer:</strong> {item.reviewerName || "-"}
                    {item.reviewerEmail && <span> ({item.reviewerEmail})</span>}
                  </div>

                  {item.comment && (
                    <div className="review-history-comment">
                      <strong>Comment</strong>

                      <p>{item.comment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ManagerReportReview;
