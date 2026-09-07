import React from "react";

function ProjectSelect({
  projects,
  value,
  onChange,
  loading = false,
}) {
  return (
    <div className="form-group">
      <label>
        Project *
      </label>

      <select
        name="projectId"
        value={value}
        onChange={onChange}
        disabled={loading}
      >
        <option value="">
          {loading
            ? "Loading projects..."
            : "Select a project"}
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
  );
}

export default ProjectSelect;