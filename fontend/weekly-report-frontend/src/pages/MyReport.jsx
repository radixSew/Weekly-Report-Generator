import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import ReportCard from "../components/ReportCard";
import PageHeader from "../components/common/PageHeader";

import "../styles/MyReport.css";

function MyReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const name = localStorage.getItem("name");

  // ========================================
  // Load My Reports
  // ========================================

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/Report/my");

      console.log("My Reports:", response.data);

      // Newest week first
      const sortedReports = [...response.data].sort(
        (a, b) =>
          new Date(b.weekStart) -
          new Date(a.weekStart)
      );

      setReports(sortedReports);
    } catch (error) {
      console.error(
        "Error loading reports:",
        error
      );

      if (error.response) {
        if (error.response.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else {
          setError(
            error.response.data?.message ||
              "Unable to load reports."
          );
        }
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
  // Loading
  // ========================================

  if (loading) {
    return (
      <Loading message="Loading reports..." />
    );
  }

  return (
    <div className="my-reports-page">

      {/* ========================================
          Header
      ======================================== */}

      <div className="my-reports-header-wrapper">
  <PageHeader
    title="My Reports"
    subtitle={`Welcome, ${name || "Team Member"}`}
    showDashboard={true}
    showLogout={true}
  />
</div>


      {/* ========================================
          Main Content
      ======================================== */}

      <main className="reports-container">

        {/* ========================================
            Page Title
        ======================================== */}

        <div className="reports-title-row">

          <div>

            <h2>
              Weekly Reports
            </h2>

            <p>
              View and manage your submitted
              weekly reports.
            </p>

          </div>


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


        {/* ========================================
            Error
        ======================================== */}

        {error && (
          <ErrorMessage
            title="Unable to load reports"
            message={error}
            onRetry={fetchMyReports}
          />
        )}


        {/* ========================================
            No Reports
        ======================================== */}

        {!error &&
          reports.length === 0 && (

            <div className="no-reports">

              <h2>
                No Reports Found
              </h2>

              <p>
                You haven't created any weekly
                reports yet.
              </p>


              <Button
                variant="primary"
                onClick={() =>
                  navigate("/report/create")
                }
                className="create-report-button"
              >
                Create Your First Report
              </Button>

            </div>
          )}


        {/* ========================================
            Reports
        ======================================== */}

        {!error &&
          reports.length > 0 && (

            <div className="reports-list">

              {reports.map((report) => (

                <ReportCard
                  key={report.id}
                  report={report}
                />

              ))}

            </div>
          )}

      </main>

    </div>
  );
}

export default MyReports;
