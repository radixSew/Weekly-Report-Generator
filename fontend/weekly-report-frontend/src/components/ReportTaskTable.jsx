import React from "react";
import Button from "./common/Button";

function ReportTaskTable({
  tasks,
  onTaskChange,
  onAddTask,
  onRemoveTask,
}) {
  return (
    <section className="form-card">
      <div className="section-heading">
        <div className="section-heading-row">
          <div>
            <h2>2. Weekly Tasks</h2>

            <p>
              Add the tasks you worked on during this week.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={onAddTask}
          >
            + Add Task
          </Button>
        </div>
      </div>

      {tasks.map((task, index) => (
        <div
          className="task-card"
          key={index}
        >
          <div className="task-header">
            <h3>
              Task {index + 1}
            </h3>

            {tasks.length > 1 && (
              <Button
                type="button"
                variant="danger"
                onClick={() =>
                  onRemoveTask(index)
                }
              >
                Remove
              </Button>
            )}
          </div>

          <div className="form-grid">

            {/* TASK NAME */}

            <div className="form-group full-width">
              <label>
                Task Name *
              </label>

              <input
                type="text"
                name="taskName"
                placeholder="Enter task name"
                value={task.taskName}
                onChange={(event) =>
                  onTaskChange(index, event)
                }
              />
            </div>

            {/* PRIORITY */}

            <div className="form-group">
              <label>
                Priority
              </label>

              <select
                name="priority"
                value={task.priority}
                onChange={(event) =>
                  onTaskChange(index, event)
                }
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>
            </div>

            {/* STATUS */}

            <div className="form-group">
              <label>
                Status
              </label>

              <select
                name="status"
                value={task.status}
                onChange={(event) =>
                  onTaskChange(index, event)
                }
              >
                <option value="Not Started">
                  Not Started
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Blocked">
                  Blocked
                </option>
              </select>
            </div>

            {/* PLANNED PERCENT */}

            <div className="form-group">
              <label>
                Planned %
              </label>

              <input
                type="number"
                name="plannedPercent"
                min="0"
                max="100"
                value={task.plannedPercent}
                onChange={(event) =>
                  onTaskChange(index, event)
                }
              />
            </div>

            {/* ACTUAL PERCENT */}

            <div className="form-group">
              <label>
                Actual %
              </label>

              <input
                type="number"
                name="actualPercent"
                min="0"
                max="100"
                value={task.actualPercent}
                onChange={(event) =>
                  onTaskChange(index, event)
                }
              />
            </div>

            {/* PLANNED HOURS */}

            <div className="form-group">
              <label>
                Planned Hours
              </label>

              <input
                type="number"
                name="plannedHours"
                min="0"
                step="0.5"
                value={task.plannedHours}
                onChange={(event) =>
                  onTaskChange(index, event)
                }
              />
            </div>

            {/* SPENT HOURS */}

            <div className="form-group">
              <label>
                Spent Hours
              </label>

              <input
                type="number"
                name="spentHours"
                min="0"
                step="0.5"
                value={task.spentHours}
                onChange={(event) =>
                  onTaskChange(index, event)
                }
              />
            </div>

            {/* DELIVERABLE */}

            <div className="form-group full-width">
              <label>
                Deliverable
              </label>

              <input
                type="text"
                name="deliverable"
                placeholder="Enter deliverable"
                value={task.deliverable}
                onChange={(event) =>
                  onTaskChange(index, event)
                }
              />
            </div>

          </div>
        </div>
      ))}
    </section>
  );
}

export default ReportTaskTable;