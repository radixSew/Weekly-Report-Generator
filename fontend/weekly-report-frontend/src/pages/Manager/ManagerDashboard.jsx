import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/ManagerDashboard.css";

function ManagerDashboard() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // Filters
  // ========================================

  const [selectedMember, setSelectedMember] = useState("All");
  const [selectedProject, setSelectedProject] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedWeek, setSelectedWeek] = useState("All");

  const name = localStorage.getItem("name");

  // ========================================
  // Load Reports
  // ========================================

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/Report/manager");

      console.log("Manager Reports:", response.data);

      setReports(response.data);
    } catch (error) {
      console.error("Error loading manager reports:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setError("Your session has expired. Please login again.");
        } else if (error.response.status === 403) {
          setError(
            "You do not have permission to access the Manager Dashboard.",
          );
        } else {
          setError(error.response.data?.message || "Unable to load reports.");
        }
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Logout
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/login");
  };

  // ========================================
  // Dashboard Statistics
  // ========================================

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status === "Submitted",
  ).length;

  const approvedReports = reports.filter(
    (report) => report.status === "Approved",
  ).length;

  const correctionReports = reports.filter(
    (report) => report.status === "Needs Correction",
  ).length;

  const draftReports = reports.filter(
    (report) => report.status === "Draft",
  ).length;

  // ========================================
  // Team Members
  // ========================================

  const teamMembers = [
    ...new Map(
      reports.map((report) => [
        report.userId,
        {
          id: report.userId,
          name: report.userName,
        },
      ]),
    ).values(),
  ];

  // ========================================
  // Projects
  // ========================================

  const projects = [
    ...new Map(
      reports.map((report) => [
        report.projectId,
        {
          id: report.projectId,
          name: report.projectName,
        },
      ]),
    ).values(),
  ];

  // ========================================
  // Statuses
  // ========================================

  const statuses = ["Draft", "Submitted", "Needs Correction", "Approved"];

  // ========================================
  // Weeks
  // ========================================

  const weeks = [
    ...new Map(
      reports.map((report) => [
        `${report.weekStart}-${report.weekEnd}`,
        {
          start: report.weekStart,
          end: report.weekEnd,
        },
      ]),
    ).values(),
  ].sort((a, b) => new Date(b.start) - new Date(a.start));

  // ========================================
  // Format Date
  // ========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ========================================
  // Week Label
  // ========================================

  const getWeekLabel = (week) => {
    return `${formatDate(week.start)} - ${formatDate(week.end)}`;
  };

  // ========================================
  // Filter Reports
  // ========================================

  const filteredReports = reports.filter((report) => {
    const memberMatches =
      selectedMember === "All" || report.userId === Number(selectedMember);

    const projectMatches =
      selectedProject === "All" || report.projectId === Number(selectedProject);

    const statusMatches =
      selectedStatus === "All" || report.status === selectedStatus;

    const weekMatches =
      selectedWeek === "All" ||
      (report.weekStart === selectedWeek.split("|")[0] &&
        report.weekEnd === selectedWeek.split("|")[1]);

    return memberMatches && projectMatches && statusMatches && weekMatches;
  });

  // ========================================
  // Filtered Statistics
  // ========================================

  const filteredSubmitted = filteredReports.filter(
    (report) => report.status === "Submitted",
  ).length;

  const filteredApproved = filteredReports.filter(
    (report) => report.status === "Approved",
  ).length;

  const filteredCorrection = filteredReports.filter(
    (report) => report.status === "Needs Correction",
  ).length;

  // ========================================
  // Clear Filters
  // ========================================

  const clearFilters = () => {
    setSelectedMember("All");
    setSelectedProject("All");
    setSelectedStatus("All");
    setSelectedWeek("All");
  };

  // ========================================
  // Chart Data
  // ========================================

  const statusChartData = [
    {
      name: "Draft",
      value: reports.filter((report) => report.status === "Draft").length,
    },
    {
      name: "Submitted",
      value: reports.filter((report) => report.status === "Submitted").length,
    },
    {
      name: "Needs Correction",
      value: reports.filter(
        (report) => report.status === "Needs Correction",
      ).length,
    },
    {
      name: "Approved",
      value: reports.filter((report) => report.status === "Approved").length,
    },
  ];

  // ========================================
  // Project Chart
  // ========================================

  const projectChartData = projects.map((project) => ({
    name: project.name,
    reports: reports.filter((report) => report.projectId === project.id).length,
  }));

  // ========================================
  // Member Chart
  // ========================================

  const memberChartData = teamMembers.map((member) => ({
    name: member.name,
    reports: reports.filter((report) => report.userId === member.id).length,
  }));

  // ========================================
  // Loading
  // ========================================

  if (loading) {
    return (
      <div className="manager-page">
        <div className="manager-loading">
          <div className="loading-spinner"></div>

          <h2>Loading Manager Dashboard...</h2>
        </div>
      </div>
    );
  }

  // ========================================
  // Page
  // ========================================

  return (
    <div className="manager-page">

      {/* ========================================
          Header
      ======================================== */}

      <header className="manager-header">

        <div className="manager-header-left">
          <h1>Manager Dashboard</h1>

          <p>Welcome, {name || "Manager"}</p>
        </div>

        {/* Header Buttons */}

        <div className="manager-header-actions">

          {/* Project Management */}

          <button
            className="manager-project-button"
            onClick={() => navigate("/projects")}
          >
             Project Management
          </button>

          {/* Logout */}

          <button
            className="manager-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* ========================================
          Main Container
      ======================================== */}

      <main className="manager-container">

        {/* ========================================
            Summary Cards
        ======================================== */}

        <section className="manager-summary-cards">

          <div className="manager-summary-card">
            <div className="summary-card-content">
              

              <div>
                <h3>Total Reports</h3>
                <p>{totalReports}</p>
              </div>
            </div>
          </div>

          <div className="manager-summary-card">
            <div className="summary-card-content">
              

              <div>
                <h3>Pending Reports</h3>
                <p>{pendingReports}</p>
              </div>
            </div>
          </div>

          <div className="manager-summary-card">
            <div className="summary-card-content">
              

              <div>
                <h3>Approved Reports</h3>
                <p>{approvedReports}</p>
              </div>
            </div>
          </div>

          <div className="manager-summary-card">
            <div className="summary-card-content">
              

              <div>
                <h3>Needs Correction</h3>
                <p>{correctionReports}</p>
              </div>
            </div>
          </div>

        </section>

        {/* ========================================
            Reports Title
        ======================================== */}

        <div className="manager-title-row">

          <div>
            <h2>Team Reports</h2>

            <p>
              Filter and review weekly reports submitted by team members.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={fetchReports}
          >
            Refresh
          </button>

        </div>

        {/* ========================================
            Filters
        ======================================== */}

        <div className="manager-filters">

          {/* Team Member */}

          <div className="manager-filter-group">

            <label htmlFor="teamMember">
              Team Member
            </label>

            <select
              id="teamMember"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="All">
                All Team Members
              </option>

              {teamMembers.map((member) => (
                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.name}
                </option>
              ))}
            </select>

          </div>

          {/* Project */}

          <div className="manager-filter-group">

            <label htmlFor="project">
              Project
            </label>

            <select
              id="project"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="All">
                All Projects
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>

          </div>

          {/* Status */}

          <div className="manager-filter-group">

            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">
                All Statuses
              </option>

              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

          </div>

          {/* Week */}

          <div className="manager-filter-group">

            <label htmlFor="week">
              Week / Date
            </label>

            <select
              id="week"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              <option value="All">
                All Weeks
              </option>

              {weeks.map((week) => (
                <option
                  key={`${week.start}|${week.end}`}
                  value={`${week.start}|${week.end}`}
                >
                  {getWeekLabel(week)}
                </option>
              ))}

            </select>

          </div>

          {/* Clear Filters */}

          <button
            className="clear-filter-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>

        {/* ========================================
            Filter Result
        ======================================== */}

        {(selectedMember !== "All" ||
          selectedProject !== "All" ||
          selectedStatus !== "All" ||
          selectedWeek !== "All") && (

          <div className="active-filter-message">
            Showing <strong>{filteredReports.length}</strong> report
            {filteredReports.length !== 1 ? "s" : ""}
          </div>

        )}

        {/* ========================================
            Error
        ======================================== */}

        {error && (

          <div className="manager-error">

            <h3>
              Unable to load reports
            </h3>

            <p>{error}</p>

            <button onClick={fetchReports}>
              Try Again
            </button>

          </div>

        )}

        {/* ========================================
            Charts
        ======================================== */}

        {!error && reports.length > 0 && (

          <section className="manager-charts-section">

            <div className="charts-section-title">

              <h2>
                Dashboard Insights
              </h2>

              <p>
                Overview of report submissions and team activity.
              </p>

            </div>

            <div className="manager-charts-grid">

              {/* Status Chart */}

              <div className="manager-chart-card">

                <h3>
                  Reports by Status
                </h3>

                <div className="status-chart">

                  {statusChartData.map((item) => (

                    <div
                      className="status-chart-row"
                      key={item.name}
                    >

                      <div className="status-chart-label">

                        <span>
                          {item.name}
                        </span>

                        <strong>
                          {item.value}
                        </strong>

                      </div>

                      <div className="status-bar-background">

                        <div
                          className={`status-bar status-bar-${item.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          style={{
                            width:
                              totalReports > 0
                                ? `${(item.value / totalReports) * 100}%`
                                : "0%",
                          }}
                        ></div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

              {/* Project Chart */}

              <div className="manager-chart-card">

                <h3>
                  Reports by Project
                </h3>

                <div className="project-chart">

                  {projectChartData.length === 0 ? (

                    <p className="chart-empty">
                      No project data available.
                    </p>

                  ) : (

                    projectChartData.map((item) => {

                      const percentage =
                        totalReports > 0
                          ? (item.reports / totalReports) * 100
                          : 0;

                      return (

                        <div
                          className="project-chart-row"
                          key={item.name}
                        >

                          <div className="project-chart-label">

                            <span>
                              {item.name}
                            </span>

                            <strong>
                              {item.reports}
                            </strong>

                          </div>

                          <div className="project-bar-background">

                            <div
                              className="project-bar"
                              style={{
                                width: `${percentage}%`,
                              }}
                            ></div>

                          </div>

                        </div>

                      );

                    })

                  )}

                </div>

              </div>

              {/* Team Member Chart */}

              <div className="manager-chart-card manager-chart-full">

                <h3>
                  Reports by Team Member
                </h3>

                <div className="member-chart">

                  {memberChartData.length === 0 ? (

                    <p className="chart-empty">
                      No team member data available.
                    </p>

                  ) : (

                    memberChartData.map((item) => {

                      const percentage =
                        totalReports > 0
                          ? (item.reports / totalReports) * 100
                          : 0;

                      return (

                        <div
                          className="member-chart-row"
                          key={item.name}
                        >

                          <div className="member-chart-label">

                            <span>
                              {item.name}
                            </span>

                            <strong>
                              {item.reports}
                            </strong>

                          </div>

                          <div className="member-bar-background">

                            <div
                              className="member-bar"
                              style={{
                                width: `${percentage}%`,
                              }}
                            ></div>

                          </div>

                        </div>

                      );

                    })

                  )}

                </div>

              </div>

            </div>

          </section>

        )}

        {/* ========================================
            No Reports
        ======================================== */}

        {!error && reports.length === 0 && (

          <div className="no-submitted-reports">

            <h2>
              No Reports Available
            </h2>

            <p>
              There are currently no reports in the system.
            </p>

          </div>

        )}

        {/* ========================================
            No Filter Results
        ======================================== */}

        {!error &&
          reports.length > 0 &&
          filteredReports.length === 0 && (

            <div className="no-submitted-reports">

              <h2>
                No Reports Found
              </h2>

              <p>
                No reports match the selected filters.
              </p>

              <button
                className="clear-filter-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          )}

        {/* ========================================
            Reports List
        ======================================== */}

        {!error && filteredReports.length > 0 && (

          <div className="manager-reports-list">

            {filteredReports.map((report) => (

              <div
                className="manager-report-card"
                key={report.id}
              >

                {/* Header */}

                <div className="manager-report-header">

                  <div>

                    <span className="report-label">
                      Weekly Report
                    </span>

                    <h3>
                      Report #{report.id}
                    </h3>

                  </div>

                  <span
                    className={`manager-status status-${report.status
                      ?.toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {report.status}
                  </span>

                </div>

                {/* Information */}

                <div className="manager-report-body">

                  <div className="manager-info">

                    <span>
                      Team Member
                    </span>

                    <strong>
                      {report.userName || "-"}
                    </strong>

                  </div>

                  <div className="manager-info">

                    <span>
                      Email
                    </span>

                    <strong>
                      {report.userEmail || "-"}
                    </strong>

                  </div>

                  <div className="manager-info">

                    <span>
                      Project
                    </span>

                    <strong>
                      {report.projectName || "-"}
                    </strong>

                  </div>

                  <div className="manager-info">

                    <span>
                      Week
                    </span>

                    <strong>
                      {formatDate(report.weekStart)}
                      {" - "}
                      {formatDate(report.weekEnd)}
                    </strong>

                  </div>

                  <div className="manager-info">

                    <span>
                      Submitted
                    </span>

                    <strong>
                      {formatDate(report.submittedAt)}
                    </strong>

                  </div>

                  <div className="manager-info">

                    <span>
                      Last Reviewed
                    </span>

                    <strong>
                      {formatDate(report.lastReviewedAt)}
                    </strong>

                  </div>

                </div>

                {/* Footer */}

                <div className="manager-report-footer">

                  <button
                    className="view-manager-report-button"
                    onClick={() =>
                      navigate(`/manager/reports/${report.id}`)
                    }
                  >
                     Review Report
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default ManagerDashboard;