import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";

import "../styles/ReportVersions.css";

function ReportVersions() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVersion, setSelectedVersion] =
    useState(null);

  // ========================================
  // LOAD VERSIONS
  // ========================================

  const fetchVersions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/Report/${id}/versions`
      );

      console.log(
        "Report Versions:",
        response.data
      );

      setVersions(response.data);
    } catch (error) {
      console.error(
        "Error loading report versions:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load report versions."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD ON PAGE OPEN
  // ========================================

  useEffect(() => {
    fetchVersions();
  }, [id]);

  // ========================================
  // FORMAT DATE/TIME
  // ========================================

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ========================================
  // FORMAT DATE
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
  // VIEW VERSION
  // ========================================

  const handleViewVersion = (version) => {
    try {
      const snapshot = JSON.parse(
        version.snapshotJson
      );

      setSelectedVersion({
        ...version,
        snapshot,
      });
    } catch (error) {
      console.error(
        "Error parsing snapshot:",
        error
      );

      setError(
        "Unable to display this version."
      );
    }
  };

  // ========================================
  // CLOSE VERSION
  // ========================================

  const closeVersion = () => {
    setSelectedVersion(null);
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <Loading message="Loading report versions..." />
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error && versions.length === 0) {
    return (
      <div className="versions-page">

        <ErrorMessage
          title="Unable to load versions"
          message={error}
          onRetry={fetchVersions}
        />

        <div className="versions-actions">

          <Button
            variant="secondary"
            onClick={() =>
              navigate(`/report/${id}`)
            }
          >
            ← Back to Report
          </Button>

        </div>

      </div>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="versions-page">

      {/* ==================================
          HEADER
      ================================== */}
<div className="versions-page-header-wrapper">
      <PageHeader
        title="Report Versions"
        subtitle={`View previous submissions of Report #${id}`}
        showDashboard={false}
        showLogout={true}
      />
      </div>

      {/* ==================================
          MAIN
      ================================== */}

      <main className="versions-container">

        {/* Error */}

        {error && (
          <ErrorMessage
            title="Something went wrong"
            message={error}
            onRetry={fetchVersions}
          />
        )}

        {/* ==================================
            VERSION LIST
        ================================== */}

        {versions.length === 0 ? (

          <section className="versions-card">

            <div className="empty-versions">

              <h2>
                No Versions Found
              </h2>

              <p>
                This report has not been
                submitted yet.
              </p>

              <Button
                variant="secondary"
                onClick={() =>
                  navigate(
                    `/report/${id}`
                  )
                }
              >
                ← Back to Report
              </Button>

            </div>

          </section>

        ) : (

          <section className="versions-card">

            <div className="versions-title">

              <h2>
                Submission History
              </h2>

              <span>
                {versions.length} version
                {versions.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            <div className="versions-list">

              {versions.map((version) => {

                let snapshot = null;

                try {
                  snapshot = JSON.parse(
                    version.snapshotJson
                  );
                } catch {
                  snapshot = null;
                }

                return (
                  <div
                    className="version-item"
                    key={version.id}
                  >

                    <div className="version-main">

                      {/* Version Number */}

                      <div className="version-number">

                        <span>
                          Version
                        </span>

                        <strong>
                          {version.versionNumber}
                        </strong>

                      </div>

                      {/* Version Details */}

                      <div className="version-details">

                        <div>

                          <span>
                            Submitted
                          </span>

                          <strong>
                            {formatDateTime(
                              version.submissionTimestamp
                            )}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Submitted By
                          </span>

                          <strong>
                            {version.submittedBy}
                          </strong>

                        </div>

                        {snapshot && (
                          <>
                            <div>

                              <span>
                                Tasks
                              </span>

                              <strong>
                                {snapshot.Tasks
                                  ?.length || 0}
                              </strong>

                            </div>

                            <div>

                              <span>
                                Status
                              </span>

                              <StatusBadge
                                status={
                                  snapshot.Status
                                }
                              />

                            </div>
                          </>
                        )}

                      </div>

                      {/* View Button */}

                      <Button
                        variant="secondary"
                        onClick={() =>
                          handleViewVersion(
                            version
                          )
                        }
                      >
                        View Version
                      </Button>

                    </div>

                  </div>
                );
              })}

            </div>

          </section>
        )}

        {/* ==================================
            SELECTED VERSION
        ================================== */}

        {selectedVersion && (

          <section
            className="versions-card selected-version-card"
          >

            {/* Selected Version Header */}

            <div className="selected-version-header">

              <div>

                <h2>
                  Version{" "}
                  {
                    selectedVersion.versionNumber
                  }
                </h2>

                <p>
                  Submitted{" "}
                  {formatDateTime(
                    selectedVersion.submissionTimestamp
                  )}
                </p>

              </div>

              <Button
                variant="secondary"
                onClick={closeVersion}
              >
                ✕ Close
              </Button>

            </div>

            {/* ==================================
                REPORT INFORMATION
            ================================== */}

            <div className="snapshot-section">

              <h3>
                Report Information
              </h3>

              <div className="snapshot-grid">

                <div>

                  <span>
                    Project ID
                  </span>

                  <strong>
                    {
                      selectedVersion
                        .snapshot
                        .ProjectId
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Week Start
                  </span>

                  <strong>
                    {formatDate(
                      selectedVersion
                        .snapshot
                        .WeekStart
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Week End
                  </span>

                  <strong>
                    {formatDate(
                      selectedVersion
                        .snapshot
                        .WeekEnd
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Status
                  </span>

                  <StatusBadge
                    status={
                      selectedVersion
                        .snapshot
                        .Status
                    }
                  />

                </div>

              </div>

            </div>

            {/* ==================================
                NEXT WEEK TASKS
            ================================== */}

            <div className="snapshot-section">

              <h3>
                Tasks Planned for Next Week
              </h3>

              <p>
                {
                  selectedVersion
                    .snapshot
                    .TasksPlannedNextWeek ||
                  "No information provided."
                }
              </p>

            </div>

            {/* ==================================
                ACHIEVEMENTS
            ================================== */}

            <div className="snapshot-section">

              <h3>
                Achievements
              </h3>

              <p>
                {
                  selectedVersion
                    .snapshot
                    .Achievements ||
                  "No achievements provided."
                }
              </p>

            </div>

            {/* ==================================
                BLOCKERS
            ================================== */}

            <div className="snapshot-section">

              <h3>
                Blockers
              </h3>

              <p>
                {
                  selectedVersion
                    .snapshot
                    .Blockers ||
                  "No blockers reported."
                }
              </p>

            </div>

            {/* ==================================
                WORKING HOURS
            ================================== */}

            <div className="snapshot-section">

              <h3>
                Working Hours
              </h3>

              <div className="snapshot-hours">

                <div>

                  <span>
                    Development
                  </span>

                  <strong>
                    {
                      selectedVersion
                        .snapshot
                        .DevelopmentHours ?? 0
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Testing
                  </span>

                  <strong>
                    {
                      selectedVersion
                        .snapshot
                        .TestingHours ?? 0
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Meetings
                  </span>

                  <strong>
                    {
                      selectedVersion
                        .snapshot
                        .MeetingHours ?? 0
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Documentation
                  </span>

                  <strong>
                    {
                      selectedVersion
                        .snapshot
                        .DocumentationHours ??
                      0
                    }
                  </strong>

                </div>

              </div>

            </div>

            {/* ==================================
                NOTES
            ================================== */}

            <div className="snapshot-section">

              <h3>
                Notes
              </h3>

              <p>
                {
                  selectedVersion
                    .snapshot
                    .Notes ||
                  "No notes provided."
                }
              </p>

            </div>

            {/* ==================================
                TASKS
            ================================== */}

            <div className="snapshot-section">

              <h3>
                Tasks
              </h3>

              {selectedVersion.snapshot.Tasks &&
              selectedVersion.snapshot.Tasks.length >
                0 ? (

                <div className="snapshot-table-wrapper">

                  <table className="snapshot-table">

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

                      {selectedVersion.snapshot.Tasks.map(
                        (task, index) => (

                          <tr
                            key={
                              task.Id ||
                              index
                            }
                          >

                            <td>
                              {task.TaskName ||
                                "-"}
                            </td>

                            <td>
                              {task.Priority ||
                                "-"}
                            </td>

                            <td>
                              {task.PlannedPercent ??
                                0}
                              %
                            </td>

                            <td>
                              {task.ActualPercent ??
                                0}
                              %
                            </td>

                            <td>
                              {task.Status ||
                                "-"}
                            </td>

                            <td>
                              {task.PlannedHours ??
                                0}
                            </td>

                            <td>
                              {task.SpentHours ??
                                0}
                            </td>

                            <td>
                              {task.Deliverable ||
                                "-"}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              ) : (

                <p>
                  No tasks available.
                </p>

              )}

            </div>

          </section>
        )}

        {/* ==================================
            BOTTOM ACTION
        ================================== */}

        <div className="versions-actions">

          <Button
            variant="secondary"
            onClick={() =>
              navigate(`/report/${id}`)
            }
          >
            ← Back to Report
          </Button>

        </div>

      </main>

    </div>
  );
}

export default ReportVersions;
