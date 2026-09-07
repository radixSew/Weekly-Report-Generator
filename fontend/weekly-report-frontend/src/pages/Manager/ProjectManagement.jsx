import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/ProjectManagement.css";

const ProjectManagement = () => {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("token");

    const api = axios.create({
        baseURL: "https://localhost:7024/api",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    // ============================================
    // GET PROJECTS
    // ============================================

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/Project");

            setProjects(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // ============================================
    // CLEAR FORM
    // ============================================

    const clearForm = () => {
        setName("");
        setDescription("");
        setEditingId(null);
        setError("");
        setSuccess("");
    };

    // ============================================
    // ADD / UPDATE PROJECT
    // ============================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Project name is required.");
            return;
        }

        try {
            setLoading(true);

            const projectData = {
                name: name.trim(),
                description: description.trim(),
            };

            if (editingId) {
                await api.put(`/Project/${editingId}`, projectData);

                setSuccess("Project updated successfully.");
            } else {
                await api.post("/Project", projectData);

                setSuccess("Project created successfully.");
            }

            clearForm();
            await fetchProjects();

        } catch (err) {
            console.error(err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // EDIT PROJECT
    // ============================================

    const handleEdit = (project) => {
        setEditingId(project.id);
        setName(project.name);
        setDescription(project.description || "");

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ============================================
    // DELETE PROJECT
    // ============================================

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await api.delete(`/Project/${id}`);

            setSuccess(
                response.data.message || "Project deleted successfully."
            );

            await fetchProjects();

        } catch (err) {
            console.error(err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to delete project.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="project-management-page">

            {/* ============================================
                HEADER
            ============================================ */}

            <div className="project-header">

                <div className="project-header-content">

                    <div>
                        <h1>Project Management</h1>

                        <p>
                            Create and manage projects used in weekly reports.
                        </p>
                    </div>

                    {/* Dashboard Button */}

                    <button
                        className="dashboard-button"
                        onClick={() => navigate("/manager/dashboard")}
                    >
                        ← Dashboard
                    </button>

                </div>

            </div>


            {/* ============================================
                MAIN CONTENT
            ============================================ */}

            <div className="project-container">

                {/* ========================================
                    FORM
                ======================================== */}

                <div className="project-form-card">

                    <h2>
                        {editingId
                            ? "Edit Project"
                            : "Add New Project"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label>
                                Project Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter project name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                placeholder="Enter project description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                rows="4"
                            />

                        </div>


                        {error && (
                            <div className="message error-message">
                                {error}
                            </div>
                        )}


                        {success && (
                            <div className="message success-message">
                                {success}
                            </div>
                        )}


                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Project"
                                        : "Add Project"}
                            </button>


                            {editingId && (
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={clearForm}
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </div>


                {/* ========================================
                    PROJECT LIST
                ======================================== */}

                <div className="project-list-card">

                    <div className="project-list-header">

                        <div>

                            <h2>
                                Projects
                            </h2>

                            <span>
                                {projects.length} project
                                {projects.length !== 1 ? "s" : ""}
                            </span>

                        </div>

                    </div>


                    {loading && projects.length === 0 ? (

                        <div className="empty-message">
                            Loading projects...
                        </div>

                    ) : projects.length === 0 ? (

                        <div className="empty-message">
                            No projects found.
                        </div>

                    ) : (

                        <div className="project-list">

                            {projects.map((project) => (

                                <div
                                    className="project-item"
                                    key={project.id}
                                >

                                    <div className="project-info">

                                        <h3>
                                            {project.name}
                                        </h3>

                                        <p>
                                            {project.description ||
                                                "No description provided."}
                                        </p>

                                    </div>


                                    <div className="project-actions">

                                        <button
                                            className="edit-button"
                                            onClick={() =>
                                                handleEdit(project)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDelete(project.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default ProjectManagement;