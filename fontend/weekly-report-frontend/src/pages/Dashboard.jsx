import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import StatusBadge from "../components/common/StatusBadge";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load Team Member reports
  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/Report/my");

        console.log("My Reports:", response.data);

        // Newest reports first
        const sortedReports = [...response.data].sort(
          (a, b) =>
            new Date(b.weekStart) -
            new Date(a.weekStart)
        );

        setReports(sortedReports);
      } catch (error) {
        console.error("Report loading error:", error);

        if (error.response) {
          setError(
            error.response.data?.message ||
              "Unable to load reports."
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

    loadReports();
  }, []);

  // Dashboard statistics
  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) =>
      report.status === "Submitted" ||
      report.status === "Draft"
  ).length;

  const approvedReports = reports.filter(
    (report) =>
      report.status === "Approved"
  ).length;

  const correctionReports = reports.filter(
    (report) =>
      report.status === "Needs Correction"
  ).length;

  return (
    <div className="dashboard-page">

      <main className="dashboard-main">

        {/* ========================================
            Header
        ======================================== */}

        <PageHeader
          title="Dashboard"
          subtitle={`Welcome back, ${name || "User"}!`}
          showDashboard={false}
          showLogout={true}
        />


        {/* ========================================
            Error Message
        ======================================== */}

        {error && (
          <ErrorMessage
            title="Unable to load reports"
            message={error}
          />
        )}


        {/* ========================================
            Dashboard Cards
        ======================================== */}

        <section className="dashboard-cards">

          <div className="dashboard-card">
            <h3>Total Reports</h3>
            <p>{totalReports}</p>
          </div>

          <div className="dashboard-card">
            <h3>Pending Reports</h3>
            <p>{pendingReports}</p>
          </div>

          <div className="dashboard-card">
            <h3>Approved Reports</h3>
            <p>{approvedReports}</p>
          </div>

          <div className="dashboard-card">
            <h3>Needs Correction</h3>
            <p>{correctionReports}</p>
          </div>

        </section>


        {/* ========================================
            Recent Reports
        ======================================== */}

        <section className="recent-reports">

          <div className="section-header">

            <div>
              <h2>Recent Reports</h2>

              <p>
                View your latest weekly reports.
              </p>
            </div>


            <div className="section-header-buttons">

              <Button
                variant="secondary"
                onClick={() =>
                  navigate("/my-reports")
                }
                className="report-history-button"
              >
                Report History
              </Button>


              <Button
                variant="primary"
                onClick={() =>
                  navigate("/report/create")
                }
                className="create-report-button"
              >
                + Create Report
              </Button>

            </div>

          </div>


          {/* ========================================
              Loading
          ======================================== */}

          {loading && (
            <Loading
              message="Loading reports..."
            />
          )}


          {/* ========================================
              No Reports
          ======================================== */}

          {!loading &&
            !error &&
            reports.length === 0 && (

              <div className="empty-reports">

                <p>
                  No reports available yet.
                </p>

                <span>
                  Create your first weekly report.
                </span>

              </div>

            )}


          {/* ========================================
              Reports
          ======================================== */}

          {!loading &&
            !error &&
            reports.length > 0 && (

              <div className="reports-list">

                {reports.map((report) => (

                  <div
                    className="report-item"
                    key={report.id}
                    onClick={() =>
                      navigate(
                        `/report/${report.id}`
                      )
                    }
                    style={{
                      cursor: "pointer",
                    }}
                  >

                    {/* Report Information */}

                    <div>

                      <h3>
                        {report.projectName ||
                          `Weekly Report #${report.id}`}
                      </h3>

                      <p>
                        Week:{" "}

                        {report.weekStart
                          ? new Date(
                              report.weekStart
                            ).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}

                        {" - "}

                        {report.weekEnd
                          ? new Date(
                              report.weekEnd
                            ).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}
                      </p>

                    </div>


                    {/* Status */}

                    <StatusBadge
                      status={report.status}
                    />

                  </div>

                ))}

              </div>

            )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;