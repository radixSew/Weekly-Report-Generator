import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "../../styles/ManagerReportVersions.css";

function ManagerReportVersions() {
    console.log("ManagerReportVersions page loaded");

    const { id } = useParams();
    const navigate = useNavigate();

    const [versions, setVersions] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        console.log("Report ID:", id);

        const fetchVersions = async () => {
            try {
                setLoading(true);
                setError("");

                console.log(
                    "Calling API:",
                    `/manager/reports/${id}/versions`
                );

                const response = await api.get(
                    `/manager/reports/${id}/versions`
                );

                console.log(
                    "Manager Report Versions API Response:",
                    response.data
                );

                const data = Array.isArray(response.data)
                    ? response.data
                    : [];

                setVersions(data);

            } catch (error) {
                console.error(
                    "Error loading manager report versions:",
                    error
                );

                console.error(
                    "Error response:",
                    error.response
                );

                setError(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Unable to load report versions."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchVersions();

    }, [id]);

    // =========================================================
    // Helper function
    // Supports both camelCase and PascalCase JSON
    // =========================================================

    const getValue = (object, ...keys) => {
        if (!object) {
            return undefined;
        }

        for (const key of keys) {
            if (
                object[key] !== undefined &&
                object[key] !== null
            ) {
                return object[key];
            }
        }

        return undefined;
    };

    // =========================================================
    // View Version
    // =========================================================

    const handleViewVersion = (version) => {
        try {
            console.log(
                "Selected version:",
                version
            );

            if (!version.snapshotJson) {
                alert(
                    "This version does not contain snapshot data."
                );
                return;
            }

            const snapshot = JSON.parse(
                version.snapshotJson
            );

            console.log(
                "Parsed snapshot:",
                snapshot
            );

            setSelectedVersion({
                ...version,
                snapshot
            });

        } catch (error) {
            console.error(
                "Error reading version:",
                error
            );

            alert(
                "Unable to display this version."
            );
        }
    };

    // =========================================================
    // Format Date
    // =========================================================

    const formatDateTime = (date) => {
        if (!date) {
            return "-";
        }

        const formattedDate = new Date(date);

        if (isNaN(formattedDate.getTime())) {
            return "-";
        }

        return formattedDate.toLocaleString(
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

    // =========================================================
    // Loading
    // =========================================================

    if (loading) {
        return (
            <div className="versions-page">

                <div className="versions-loading">

                    <h2>
                        Loading report versions...
                    </h2>

                    <p>
                        Report #{id}
                    </p>

                </div>

            </div>
        );
    }

    // =========================================================
    // Error
    // =========================================================

    if (error) {
        return (
            <div className="versions-page">

                <div className="versions-error">

                    <h2>
                        Unable to load versions
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="versions-back-button"
                        onClick={() =>
                            navigate(
                                `/manager/reports/${id}`
                            )
                        }
                    >
                        ← Back to Report
                    </button>

                </div>

            </div>
        );
    }

    // =========================================================
    // Main Page
    // =========================================================

    return (
        <div className="versions-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="versions-header">

                <div>

                    <h1>
                        Report Versions
                    </h1>

                    <p>
                        Report #{id} version history
                    </p>

                </div>

                <button
                    className="versions-back-button"
                    onClick={() =>
                        navigate(
                            `/manager/reports/${id}`
                        )
                    }
                >
                    ← Back to Report
                </button>

            </header>


            <main className="versions-container">

                {/* =================================================
                    SUBMISSION HISTORY
                ================================================= */}

                <section className="versions-card">

                    <h2>
                        Submission History
                    </h2>

                    {versions.length === 0 ? (

                        <p className="versions-empty">
                            No versions available.
                        </p>

                    ) : (

                        <div className="versions-list">

                            {versions.map((version) => (

                                <div
                                    className="version-item"
                                    key={version.id}
                                >

                                    <div className="version-info">

                                        <h3>
                                            Version{" "}
                                            {version.versionNumber}
                                        </h3>

                                        <p>
                                            <strong>
                                                Submitted:
                                            </strong>{" "}
                                            {formatDateTime(
                                                version.submissionTimestamp
                                            )}
                                        </p>

                                        <p>
                                            <strong>
                                                Submitted By:
                                            </strong>{" "}
                                            {version.submittedBy || "-"}
                                        </p>

                                    </div>


                                    <button
                                        className="view-version-button"
                                        onClick={() =>
                                            handleViewVersion(
                                                version
                                            )
                                        }
                                    >
                                        View Version
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* =================================================
                    SELECTED VERSION
                ================================================= */}

                {selectedVersion && (

                    <section className="versions-card selected-version">

                        <div className="selected-version-header">

                            <div>

                                <h2>
                                    Version{" "}
                                    {selectedVersion.versionNumber}
                                </h2>

                                <p>
                                    Submitted:{" "}
                                    {formatDateTime(
                                        selectedVersion.submissionTimestamp
                                    )}
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            BASIC INFORMATION
                        ================================================= */}

                        <div className="snapshot-grid">

                            {/* Report ID */}

                            <div>

                                <span>
                                    Report ID
                                </span>

                                <strong>
                                    {
                                        getValue(
                                            selectedVersion.snapshot,
                                            "id",
                                            "Id",
                                            "reportId",
                                            "ReportId"
                                        ) ?? "-"
                                    }
                                </strong>

                            </div>


                            {/* Project ID */}

                            <div>

                                <span>
                                    Project ID
                                </span>

                                <strong>
                                    {
                                        getValue(
                                            selectedVersion.snapshot,
                                            "projectId",
                                            "ProjectId"
                                        ) ?? "-"
                                    }
                                </strong>

                            </div>


                            {/* Week Start */}

                            <div>

                                <span>
                                    Week Start
                                </span>

                                <strong>

                                    {
                                        (() => {

                                            const date = getValue(
                                                selectedVersion.snapshot,
                                                "weekStart",
                                                "WeekStart"
                                            );

                                            return date
                                                ? new Date(
                                                    date
                                                ).toLocaleDateString(
                                                    "en-GB"
                                                )
                                                : "-";

                                        })()
                                    }

                                </strong>

                            </div>


                            {/* Week End */}

                            <div>

                                <span>
                                    Week End
                                </span>

                                <strong>

                                    {
                                        (() => {

                                            const date = getValue(
                                                selectedVersion.snapshot,
                                                "weekEnd",
                                                "WeekEnd"
                                            );

                                            return date
                                                ? new Date(
                                                    date
                                                ).toLocaleDateString(
                                                    "en-GB"
                                                )
                                                : "-";

                                        })()
                                    }

                                </strong>

                            </div>


                            {/* Status */}

                            <div>

                                <span>
                                    Status
                                </span>

                                <strong>

                                    {
                                        getValue(
                                            selectedVersion.snapshot,
                                            "status",
                                            "Status"
                                        ) ?? "-"
                                    }

                                </strong>

                            </div>

                        </div>


                        {/* =================================================
                            TASKS PLANNED
                        ================================================= */}

                        <div className="version-section">

                            <h3>
                                Tasks Planned for Next Week
                            </h3>

                            <p>

                                {
                                    getValue(
                                        selectedVersion.snapshot,
                                        "tasksPlannedNextWeek",
                                        "TasksPlannedNextWeek"
                                    ) ||
                                    "No information provided."
                                }

                            </p>

                        </div>


                        {/* =================================================
                            ACHIEVEMENTS
                        ================================================= */}

                        <div className="version-section">

                            <h3>
                                Achievements
                            </h3>

                            <p>

                                {
                                    getValue(
                                        selectedVersion.snapshot,
                                        "achievements",
                                        "Achievements"
                                    ) ||
                                    "No achievements provided."
                                }

                            </p>

                        </div>


                        {/* =================================================
                            BLOCKERS
                        ================================================= */}

                        <div className="version-section">

                            <h3>
                                Blockers
                            </h3>

                            <p>

                                {
                                    getValue(
                                        selectedVersion.snapshot,
                                        "blockers",
                                        "Blockers"
                                    ) ||
                                    "No blockers reported."
                                }

                            </p>

                        </div>


                        {/* =================================================
                            WORKING HOURS
                        ================================================= */}

                        <div className="version-section">

                            <h3>
                                Working Hours
                            </h3>


                            <div className="hours-grid">

                                {/* Development */}

                                <div>

                                    <span>
                                        Development
                                    </span>

                                    <strong>

                                        {
                                            getValue(
                                                selectedVersion.snapshot,
                                                "developmentHours",
                                                "DevelopmentHours"
                                            ) ?? 0
                                        }{" "}

                                        hours

                                    </strong>

                                </div>


                                {/* Testing */}

                                <div>

                                    <span>
                                        Testing
                                    </span>

                                    <strong>

                                        {
                                            getValue(
                                                selectedVersion.snapshot,
                                                "testingHours",
                                                "TestingHours"
                                            ) ?? 0
                                        }{" "}

                                        hours

                                    </strong>

                                </div>


                                {/* Meetings */}

                                <div>

                                    <span>
                                        Meetings
                                    </span>

                                    <strong>

                                        {
                                            getValue(
                                                selectedVersion.snapshot,
                                                "meetingHours",
                                                "MeetingHours",
                                                "meetingsHours",
                                                "MeetingsHours"
                                            ) ?? 0
                                        }{" "}

                                        hours

                                    </strong>

                                </div>


                                {/* Documentation */}

                                <div>

                                    <span>
                                        Documentation
                                    </span>

                                    <strong>

                                        {
                                            getValue(
                                                selectedVersion.snapshot,
                                                "documentationHours",
                                                "DocumentationHours"
                                            ) ?? 0
                                        }{" "}

                                        hours

                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            NOTES
                        ================================================= */}

                        <div className="version-section">

                            <h3>
                                Notes
                            </h3>

                            <p>

                                {
                                    getValue(
                                        selectedVersion.snapshot,
                                        "notes",
                                        "Notes"
                                    ) ||
                                    "No notes provided."
                                }

                            </p>

                        </div>


                        {/* =================================================
                            TASKS
                        ================================================= */}

                        <div className="version-section">

                            <h3>
                                Tasks
                            </h3>


                            {(() => {

                                const tasks = getValue(
                                    selectedVersion.snapshot,
                                    "tasks",
                                    "Tasks"
                                );

                                return tasks &&
                                    Array.isArray(tasks) &&
                                    tasks.length > 0
                                    ? (

                                        <div className="versions-table-wrapper">

                                            <table className="versions-table">

                                                <thead>

                                                    <tr>

                                                        <th>
                                                            Task
                                                        </th>

                                                        <th>
                                                            Priority
                                                        </th>

                                                        <th>
                                                            Planned %
                                                        </th>

                                                        <th>
                                                            Actual %
                                                        </th>

                                                        <th>
                                                            Status
                                                        </th>

                                                    </tr>

                                                </thead>


                                                <tbody>

                                                    {tasks.map(
                                                        (
                                                            task,
                                                            index
                                                        ) => (

                                                            <tr
                                                                key={
                                                                    getValue(
                                                                        task,
                                                                        "id",
                                                                        "Id"
                                                                    ) ??
                                                                    index
                                                                }
                                                            >

                                                                {/* Task */}

                                                                <td>

                                                                    {
                                                                        getValue(
                                                                            task,
                                                                            "taskName",
                                                                            "TaskName",
                                                                            "name",
                                                                            "Name"
                                                                        ) ||
                                                                        "-"
                                                                    }

                                                                </td>


                                                                {/* Priority */}

                                                                <td>

                                                                    {
                                                                        getValue(
                                                                            task,
                                                                            "priority",
                                                                            "Priority"
                                                                        ) ||
                                                                        "-"
                                                                    }

                                                                </td>


                                                                {/* Planned */}

                                                                <td>

                                                                    {
                                                                        getValue(
                                                                            task,
                                                                            "plannedPercent",
                                                                            "PlannedPercent"
                                                                        ) ?? 0
                                                                    }%

                                                                </td>


                                                                {/* Actual */}

                                                                <td>

                                                                    {
                                                                        getValue(
                                                                            task,
                                                                            "actualPercent",
                                                                            "ActualPercent"
                                                                        ) ?? 0
                                                                    }%

                                                                </td>


                                                                {/* Status */}

                                                                <td>

                                                                    {
                                                                        getValue(
                                                                            task,
                                                                            "status",
                                                                            "Status"
                                                                        ) ||
                                                                        "-"
                                                                    }

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

                                    );

                            })()}

                        </div>

                    </section>

                )}

            </main>

        </div>
    );
}

export default ManagerReportVersions;