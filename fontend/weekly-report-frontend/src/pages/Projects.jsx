import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Projects.css";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const name = localStorage.getItem("name");

  // ========================================
  // Load Projects
  // ========================================
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/Project");

        console.log("Projects:", response.data);

        setProjects(response.data);
      } catch (error) {
        console.error("Project loading error:", error);

        if (error.response) {
          if (error.response.status === 401) {
            setError("Your session has expired. Please login again.");
          } else {
            setError(
              error.response.data?.message ||
                "Unable to load projects."
            );
          }
        } else {
          setError("Unable to connect to the server.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

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

  return (
    <div className="projects-page">

      {/* ========================================
          Header
      ======================================== */}
      <header className="projects-header">

        <div>
          <h1>Projects</h1>
          <p>
            Welcome, {name || "Team Member"}
          </p>
        </div>

        <div className="projects-header-actions">

          <button
            className="dashboard-button"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ========================================
          Main Content
      ======================================== */}
      <main className="projects-container">

        <div className="projects-title-row">

          <div>
            <h2>Available Projects</h2>

            <p>
              View the projects available for weekly reports.
            </p>
          </div>

          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

        </div>


        {/* ========================================
            Error
        ======================================== */}
        {error && (
          <div className="projects-error">

            <h3>Unable to load projects</h3>

            <p>{error}</p>

            <button
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>

          </div>
        )}


        {/* ========================================
            Loading
        ======================================== */}
        {loading && !error && (
          <div className="projects-loading">
            <h2>Loading projects...</h2>
            <p>Please wait.</p>
          </div>
        )}


        {/* ========================================
            No Projects
        ======================================== */}
        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="no-projects">

              <h2>No Projects Found</h2>

              <p>
                There are currently no projects available.
              </p>

            </div>
          )}


        {/* ========================================
            Project List
        ======================================== */}
        {!loading &&
          !error &&
          projects.length > 0 && (

            <div className="projects-grid">

              {projects.map((project) => (

                <div
                  className="project-card"
                  key={project.id}
                >

                  {/* Project Header */}
                  <div className="project-card-header">

                    <div>
                      <span className="project-label">
                        Project
                      </span>

                      <h3>
                        {project.name ||
                          project.projectName ||
                          `Project #${project.id}`}
                      </h3>
                    </div>

                    <span className="project-id">
                      #{project.id}
                    </span>

                  </div>


                  {/* Project Description */}
                  <div className="project-description">

                    <span>Description</span>

                    <p>
                      {project.description ||
                        "No description available."}
                    </p>

                  </div>


                  {/* Project Details */}
                  <div className="project-details">

                    <div>
                      <span>Created</span>

                      <strong>
                        {formatDate(project.createdAt)}
                      </strong>
                    </div>

                    <div>
                      <span>Status</span>

                      <strong className="active-status">
                        Active
                      </strong>
                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

      </main>

    </div>
  );
}

export default Projects;