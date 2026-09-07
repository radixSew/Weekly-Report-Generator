import React from "react";
import ProjectSelect from "./ProjectSelect";

function ReportForm({
  formData,
  projects,
  projectsLoading,
  handleChange,
}) {
  return (
    <>
      {/* 1. Report Information */}

      <section className="form-card">

        <div className="section-heading">
          <h2>1. Report Information</h2>

          <p>
            Enter the basic information about your weekly report.
          </p>
        </div>

        <div className="form-grid">

          <ProjectSelect
            projects={projects}
            value={formData.projectId}
            onChange={handleChange}
            loading={projectsLoading}
          />

          {/* WEEK START */}

          <div className="form-group">
            <label>
              Week Start *
            </label>

            <input
              type="date"
              name="weekStart"
              value={formData.weekStart}
              onChange={handleChange}
            />
          </div>

          {/* WEEK END */}

          <div className="form-group">
            <label>
              Week End *
            </label>

            <input
              type="date"
              name="weekEnd"
              value={formData.weekEnd}
              onChange={handleChange}
            />
          </div>

        </div>
      </section>


      {/* 3. Tasks Planned Next Week */}

      <section className="form-card">

        <div className="section-heading">
          <h2>
            3. Tasks Planned Next Week
          </h2>
        </div>

        <div className="form-group">

          <label>
            Planned Tasks
          </label>

          <textarea
            name="tasksPlannedNextWeek"
            rows="5"
            placeholder="Describe the tasks you plan to complete next week..."
            value={formData.tasksPlannedNextWeek}
            onChange={handleChange}
          />

        </div>

      </section>


      {/* 4. Blockers */}

      <section className="form-card">

        <div className="section-heading">
          <h2>
            4. Blockers
          </h2>
        </div>

        <div className="form-group">

          <label>
            Blockers
          </label>

          <textarea
            name="blockers"
            rows="4"
            placeholder="Describe any blockers or challenges..."
            value={formData.blockers}
            onChange={handleChange}
          />

        </div>

        <div className="form-group checkbox-group">

          <label>

            <input
              type="checkbox"
              name="keyBlocker"
              checked={formData.keyBlocker}
              onChange={(event) =>
                handleChange({
                  target: {
                    name: "keyBlocker",
                    value: event.target.checked,
                  },
                })
              }
            />

            <span>
              Is this a key blocker?
            </span>

          </label>

        </div>

      </section>


      {/* 5. Achievements */}

      <section className="form-card">

        <div className="section-heading">
          <h2>
            5. Achievements
          </h2>
        </div>

        <div className="form-group">

          <label>
            Achievements
          </label>

          <textarea
            name="achievements"
            rows="4"
            placeholder="Describe what you achieved this week..."
            value={formData.achievements}
            onChange={handleChange}
          />

        </div>

        <div className="form-group checkbox-group">

          <label>

            <input
              type="checkbox"
              name="keyAchievement"
              checked={formData.keyAchievement}
              onChange={(event) =>
                handleChange({
                  target: {
                    name: "keyAchievement",
                    value: event.target.checked,
                  },
                })
              }
            />

            <span>
              Is this a key achievement?
            </span>

          </label>

        </div>

      </section>


      {/* 6. Working Hours */}

      <section className="form-card">

        <div className="section-heading">

          <h2>
            6. Working Hours
          </h2>

          <p>
            Enter the approximate hours spent on each type of work.
          </p>

        </div>

        <div className="form-grid">

          {/* DEVELOPMENT */}

          <div className="form-group">
            <label>
              Development Hours
            </label>

            <input
              type="number"
              name="developmentHours"
              min="0"
              step="0.5"
              value={formData.developmentHours}
              onChange={handleChange}
            />
          </div>

          {/* TESTING */}

          <div className="form-group">
            <label>
              Testing Hours
            </label>

            <input
              type="number"
              name="testingHours"
              min="0"
              step="0.5"
              value={formData.testingHours}
              onChange={handleChange}
            />
          </div>

          {/* MEETING */}

          <div className="form-group">
            <label>
              Meeting Hours
            </label>

            <input
              type="number"
              name="meetingHours"
              min="0"
              step="0.5"
              value={formData.meetingHours}
              onChange={handleChange}
            />
          </div>

          {/* DOCUMENTATION */}

          <div className="form-group">
            <label>
              Documentation Hours
            </label>

            <input
              type="number"
              name="documentationHours"
              min="0"
              step="0.5"
              value={formData.documentationHours}
              onChange={handleChange}
            />
          </div>

        </div>

      </section>


      {/* 7. Notes */}

      <section className="form-card">

        <div className="section-heading">
          <h2>
            7. Notes / Links
          </h2>
        </div>

        <div className="form-group">

          <label>
            Notes
          </label>

          <textarea
            name="notes"
            rows="5"
            placeholder="Add any additional notes, links, or comments..."
            value={formData.notes}
            onChange={handleChange}
          />

        </div>

      </section>
    </>
  );
}

export default ReportForm;