import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import ReportTaskTable from "../components/ReportTaskTable";
import ReportForm from "../components/ReportForm";

import Button from "../components/common/Button";
import PageHeader from "../components/common/PageHeader";
import ErrorMessage from "../components/common/ErrorMessage";

import "../styles/CreateReport.css";

function CreateReport() {
  const navigate = useNavigate();

  // ========================================
  // Form Data
  // ========================================

  const [formData, setFormData] = useState({
    projectId: "",
    weekStart: "",
    weekEnd: "",

    tasksPlannedNextWeek: "",

    blockers: "",
    keyBlocker: false,

    achievements: "",
    keyAchievement: false,

    developmentHours: 0,
    testingHours: 0,
    meetingHours: 0,
    documentationHours: 0,

    notes: "",
  });

  // ========================================
  // Tasks
  // ========================================

  const [tasks, setTasks] = useState([
    {
      taskName: "",
      priority: "Medium",
      plannedPercent: 0,
      actualPercent: 0,
      status: "In Progress",
      plannedHours: 0,
      spentHours: 0,
      deliverable: "",
    },
  ]);

  // ========================================
  // UI State
  // ========================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // Projects
  // ========================================

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // ========================================
  // Load Projects
  // ========================================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setProjectsLoading(true);
        setError("");

        const response = await api.get("/Project");

        console.log("Projects:", response.data);

        setProjects(response.data);
      } catch (error) {
        console.error("Project loading error:", error);

        if (error.response) {
          setError(
            error.response.data?.message ||
              "Unable to load projects."
          );
        } else {
          setError("Unable to connect to the server.");
        }
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // ========================================
  // Handle Form Changes
  // ========================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ========================================
  // Handle Task Changes
  // ========================================

  const handleTaskChange = (index, event) => {
    const {
      name,
      value,
    } = event.target;

    const updatedTasks = [...tasks];

    updatedTasks[index] = {
      ...updatedTasks[index],
      [name]: value,
    };

    setTasks(updatedTasks);
  };

  // ========================================
  // Add Task
  // ========================================

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        taskName: "",
        priority: "Medium",
        plannedPercent: 0,
        actualPercent: 0,
        status: "In Progress",
        plannedHours: 0,
        spentHours: 0,
        deliverable: "",
      },
    ]);
  };

  // ========================================
  // Remove Task
  // ========================================

  const removeTask = (index) => {
    if (tasks.length === 1) {
      return;
    }

    setTasks(
      tasks.filter(
        (_, taskIndex) => taskIndex !== index
      )
    );
  };

  // ========================================
  // Submit Report
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ----------------------------------------
    // Validation
    // ----------------------------------------

    if (!formData.projectId) {
      setError("Please select a project.");
      return;
    }

    if (!formData.weekStart || !formData.weekEnd) {
      setError(
        "Please select the week start and week end dates."
      );
      return;
    }

    if (
      new Date(formData.weekEnd) <
      new Date(formData.weekStart)
    ) {
      setError(
        "Week end date cannot be before week start date."
      );
      return;
    }

    const validTasks = tasks.filter(
      (task) => task.taskName.trim() !== ""
    );

    if (validTasks.length === 0) {
      setError("Please add at least one task.");
      return;
    }

    // ----------------------------------------
    // Send Request
    // ----------------------------------------

    try {
      setLoading(true);

      const requestData = {
        projectId: Number(formData.projectId),

        weekStart: formData.weekStart,

        weekEnd: formData.weekEnd,

        tasksPlannedNextWeek:
          formData.tasksPlannedNextWeek,

        blockers: formData.blockers,

        keyBlocker: Boolean(formData.keyBlocker),

        achievements: formData.achievements,

        keyAchievement: Boolean(
          formData.keyAchievement
        ),

        developmentHours: Number(
          formData.developmentHours
        ),

        testingHours: Number(
          formData.testingHours
        ),

        meetingHours: Number(
          formData.meetingHours
        ),

        documentationHours: Number(
          formData.documentationHours
        ),

        notes: formData.notes,

        tasks: validTasks.map((task) => ({
          taskName: task.taskName,

          priority: task.priority,

          plannedPercent: Number(
            task.plannedPercent
          ),

          actualPercent: Number(
            task.actualPercent
          ),

          status: task.status,

          plannedHours: Number(
            task.plannedHours
          ),

          spentHours: Number(
            task.spentHours
          ),

          deliverable: task.deliverable,
        })),
      };

      console.log(
        "Create Report Request:",
        requestData
      );

      const response = await api.post(
        "/Report",
        requestData
      );

      console.log(
        "Create Report Response:",
        response.data
      );

      setSuccess(
        "Weekly report created successfully!"
      );

      setTimeout(() => {
        navigate("/my-reports");
      }, 1500);
    } catch (error) {
      console.error(
        "Create report error:",
        error
      );

      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );

        if (error.response.data?.message) {
          setError(
            error.response.data.message
          );
        } else if (error.response.data?.errors) {
          setError(
            "Please check the entered information."
          );
        } else {
          setError(
            "Unable to create report."
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
  // Page
  // ========================================

  return (
    <div className="create-report-page">

      {/* Header */}

      <div className="create-report-header-wrapper">
        <PageHeader
          title="Create Weekly Report"
          subtitle="Create your weekly work report"
          showDashboard={true}
          showLogout={true}
        />
      </div>

      {/* Main */}

      <main className="create-report-container">

        {/* Error */}

        {error && (
          <ErrorMessage
            title="Unable to create report"
            message={error}
            onRetry={() => {
              setError("");
            }}
          />
        )}

        {/* Success */}

        {success && (
          <div className="form-success">
            {success}
          </div>
        )}

        {/* Report Form */}

        <form onSubmit={handleSubmit}>

          <ReportForm
            formData={formData}
            projects={projects}
            projectsLoading={projectsLoading}
            handleChange={handleChange}
          />

          {/* Weekly Tasks */}

          <ReportTaskTable
            tasks={tasks}
            onTaskChange={handleTaskChange}
            onAddTask={addTask}
            onRemoveTask={removeTask}
          />

          {/* Action Buttons */}

          <div className="form-actions">

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                navigate("/my-reports")
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading
                ? "Saving Report..."
                : "Save Report"}
            </Button>

          </div>

        </form>
      </main>
    </div>
  );
}

export default CreateReport;