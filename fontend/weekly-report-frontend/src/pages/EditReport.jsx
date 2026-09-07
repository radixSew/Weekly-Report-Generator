import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

import ReportForm from "../components/ReportForm";
import ReportTaskTable from "../components/ReportTaskTable";

import Button from "../components/common/Button";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

import "../styles/CreateReport.css";

function EditReport() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ========================================
  // Projects
  // ========================================

  const [projects, setProjects] = useState([]);

  // ========================================
  // UI State
  // ========================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const [tasks, setTasks] = useState([]);

  // ========================================
  // LOAD REPORT AND PROJECTS
  // ========================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [reportResponse, projectResponse] = await Promise.all([
          api.get(`/Report/${id}`),
          api.get("/Project"),
        ]);

        const report = reportResponse.data;

        console.log("Edit Report:", report);
        console.log("Projects:", projectResponse.data);

        setProjects(projectResponse.data);

        setFormData({
          projectId: report.projectId || "",

          weekStart: report.weekStart ? report.weekStart.substring(0, 10) : "",

          weekEnd: report.weekEnd ? report.weekEnd.substring(0, 10) : "",

          tasksPlannedNextWeek: report.tasksPlannedNextWeek || "",

          blockers: report.blockers || "",

          keyBlocker: Boolean(report.keyBlocker),

          achievements: report.achievements || "",

          keyAchievement: Boolean(report.keyAchievement),

          developmentHours: report.developmentHours || 0,

          testingHours: report.testingHours || 0,

          meetingHours: report.meetingHours || 0,

          documentationHours: report.documentationHours || 0,

          notes: report.notes || "",
        });

        setTasks(
          (report.tasks || []).map((task) => ({
            ...task,

            taskName: task.taskName || "",

            priority: task.priority || "Medium",

            status: task.status || "Not Started",

            plannedPercent: task.plannedPercent ?? 0,

            actualPercent: task.actualPercent ?? 0,

            plannedHours: task.plannedHours ?? 0,

            spentHours: task.spentHours ?? 0,

            deliverable: task.deliverable || "",
          })),
        );
      } catch (error) {
        console.error("Error loading edit report:", error);

        if (error.response) {
          setError(error.response.data?.message || "Unable to load report.");
        } else {
          setError("Unable to connect to the server.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // ========================================
  // HANDLE MAIN FORM CHANGES
  // ========================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ========================================
  // HANDLE TASK CHANGES
  // ========================================

  const handleTaskChange = (index, event) => {
    const { name, value } = event.target;

    setTasks((previous) => {
      const updatedTasks = [...previous];

      updatedTasks[index] = {
        ...updatedTasks[index],
        [name]: value,
      };

      return updatedTasks;
    });
  };

  // ========================================
  // ADD TASK
  // ========================================

  const addTask = () => {
    setTasks((previous) => [
      ...previous,

      {
        id: 0,
        taskName: "",
        priority: "Medium",
        status: "Not Started",
        plannedPercent: 0,
        actualPercent: 0,
        plannedHours: 0,
        spentHours: 0,
        deliverable: "",
      },
    ]);
  };

  // ========================================
  // REMOVE TASK
  // ========================================

  const removeTask = (index) => {
    if (tasks.length === 1) {
      return;
    }

    setTasks((previous) =>
      previous.filter((_, taskIndex) => taskIndex !== index),
    );
  };

  // ========================================
  // UPDATE REPORT
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
      setError("Please select the week start and end dates.");
      return;
    }

    if (formData.weekEnd < formData.weekStart) {
      setError("Week End cannot be earlier than Week Start.");
      return;
    }

    const validTasks = tasks.filter(
      (task) => task.taskName && task.taskName.trim() !== "",
    );

    if (validTasks.length === 0) {
      setError("Please add at least one task.");
      return;
    }

    // ----------------------------------------
    // Request Data
    // ----------------------------------------

    try {
      setSaving(true);

      const requestData = {
        projectId: Number(formData.projectId),

        weekStart: formData.weekStart,

        weekEnd: formData.weekEnd,

        tasksPlannedNextWeek: formData.tasksPlannedNextWeek,

        blockers: formData.blockers,

        keyBlocker: Boolean(formData.keyBlocker),

        achievements: formData.achievements,

        keyAchievement: Boolean(formData.keyAchievement),

        developmentHours: Number(formData.developmentHours),

        testingHours: Number(formData.testingHours),

        meetingHours: Number(formData.meetingHours),

        documentationHours: Number(formData.documentationHours),

        notes: formData.notes,

        tasks: validTasks.map((task) => ({
          id: task.id || 0,

          taskName: task.taskName,

          priority: task.priority,

          status: task.status,

          plannedPercent: Number(task.plannedPercent),

          actualPercent: Number(task.actualPercent),

          plannedHours: Number(task.plannedHours),

          spentHours: Number(task.spentHours),

          deliverable: task.deliverable || "",
        })),
      };

      console.log("Update Request:", requestData);

      await api.put(`/Report/${id}`, requestData);

      setSuccess("Report updated successfully.");

      setTimeout(() => {
        navigate(`/report/${id}`);
      }, 1000);
    } catch (error) {
      console.error("Update report error:", error);

      if (error.response) {
        console.error("Backend response:", error.response.data);

        setError(error.response.data?.message || "Unable to update report.");
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return <Loading message="Loading report..." />;
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="create-report-page">
      {/* HEADER */}

      <div className="create-report-header-wrapper">
        <PageHeader
          title="Edit Weekly Report"
          subtitle={`Update Report #${id}`}
          showDashboard={true}
          showLogout={true}
        />
      </div>

      {/* MAIN */}

      <main className="create-report-container">
        {/* ERROR */}

        {error && (
          <ErrorMessage
            title="Unable to update report"
            message={error}
            onRetry={() => setError("")}
          />
        )}

        {/* SUCCESS */}

        {success && <div className="form-success">{success}</div>}

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          {/* REPORT INFORMATION,
              NEXT WEEK TASKS,
              BLOCKERS,
              ACHIEVEMENTS,
              HOURS,
              NOTES */}

          <ReportForm
            formData={formData}
            projects={projects}
            projectsLoading={false}
            handleChange={handleChange}
          />

          {/* WEEKLY TASKS */}

          <ReportTaskTable
            tasks={tasks}
            onTaskChange={handleTaskChange}
            onAddTask={addTask}
            onRemoveTask={removeTask}
          />

          {/* ACTION BUTTONS */}

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/report/${id}`)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Updating..." : "Update Report"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditReport;
