using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using WeeklyReportApi.Data;
using WeeklyReportApi.DTOs;
using WeeklyReportApi.Models;
using WeeklyReportBackend.DTOs;

namespace WeeklyReportApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportController(AppDbContext context)
        {
            _context = context;
        }


        // ============================================================
        // TEAM MEMBER - CREATE REPORT
        // POST: api/Report
        // ============================================================

        [HttpPost]
        [Authorize(Roles = "TeamMember")]
        public async Task<IActionResult> CreateReport(
            [FromBody] CreateReportRequest request)
        {
            var userIdClaim = User.FindFirst(
                ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdClaim.Value);

            var project = await _context.Projects
                .FirstOrDefaultAsync(x => x.Id == request.ProjectId);

            if (project == null)
            {
                return BadRequest(new
                {
                    message = "Project not found."
                });
            }

            if (request.WeekEnd < request.WeekStart)
            {
                return BadRequest(new
                {
                    message =
                        "Week end date cannot be before week start date."
                });
            }

            var report = new Report
            {
                UserId = userId,
                ProjectId = request.ProjectId,

                WeekStart = request.WeekStart,
                WeekEnd = request.WeekEnd,

                Status = "Draft",

                TasksPlannedNextWeek =
                    request.TasksPlannedNextWeek,

                Blockers =
                    request.Blockers,

                KeyBlocker =
                    request.KeyBlocker,

                Achievements =
                    request.Achievements,

                KeyAchievement =
                    request.KeyAchievement,

                DevelopmentHours =
                    request.DevelopmentHours,

                TestingHours =
                    request.TestingHours,

                MeetingHours =
                    request.MeetingHours,

                DocumentationHours =
                    request.DocumentationHours,

                Notes =
                    request.Notes,

                CreatedAt =
                    DateTime.UtcNow,

                UpdatedAt =
                    DateTime.UtcNow
            };

            foreach (var taskRequest in request.Tasks)
            {
                var task = new ReportTask
                {
                    TaskName =
                        taskRequest.TaskName,

                    Priority =
                        taskRequest.Priority,

                    PlannedPercent =
                        taskRequest.PlannedPercent,

                    ActualPercent =
                        taskRequest.ActualPercent,

                    Status =
                        taskRequest.Status,

                    PlannedHours =
                        taskRequest.PlannedHours,

                    SpentHours =
                        taskRequest.SpentHours,

                    Deliverable =
                        taskRequest.Deliverable
                };

                report.Tasks.Add(task);
            }

            _context.Reports.Add(report);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message =
                    "Weekly report created successfully.",

                reportId =
                    report.Id,

                status =
                    report.Status
            });
        }


        // ============================================================
        // TEAM MEMBER - GET MY REPORTS
        // GET: api/Report/my
        // ============================================================

        [HttpGet("my")]
        [Authorize(Roles = "TeamMember,Manager,Admin")]
        public async Task<IActionResult> GetMyReports()
        {
            var userIdClaim = User.FindFirst(
                ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdClaim.Value);

            var reports = await _context.Reports
                .Where(x => x.UserId == userId)

                .Include(x => x.Project)
                .Include(x => x.Tasks)

                .OrderByDescending(x => x.WeekStart)

                .Select(x => new
                {
                    x.Id,

                    x.UserId,

                    x.ProjectId,

                    ProjectName =
                        x.Project.Name,

                    x.WeekStart,
                    x.WeekEnd,

                    x.Status,

                    x.TasksPlannedNextWeek,

                    x.Blockers,
                    x.KeyBlocker,

                    x.Achievements,
                    x.KeyAchievement,

                    x.DevelopmentHours,
                    x.TestingHours,
                    x.MeetingHours,
                    x.DocumentationHours,

                    x.Notes,

                    x.SubmittedAt,

                    x.LastReviewedAt,

                    x.LatestReviewComment,

                    x.CreatedAt,

                    x.UpdatedAt,

                    Tasks = x.Tasks.Select(t => new
                    {
                        t.Id,

                        t.TaskName,

                        t.Priority,

                        t.PlannedPercent,

                        t.ActualPercent,

                        t.Status,

                        t.PlannedHours,

                        t.SpentHours,

                        t.Deliverable
                    }).ToList()
                })

                .ToListAsync();

            return Ok(reports);
        }


        // ============================================================
        // TEAM MEMBER - GET OWN REPORT
        // GET: api/Report/{id}
        // ============================================================

        [HttpGet("{id:int}")]
        [Authorize(Roles = "TeamMember")]
        public async Task<IActionResult> GetMyReport(int id)
        {
            var userIdClaim = User.FindFirst(
                ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdClaim.Value);

            var report = await _context.Reports

                .Where(x =>
                    x.Id == id &&
                    x.UserId == userId)

                .Include(x => x.Project)
                .Include(x => x.Tasks)

                .Select(x => new
                {
                    x.Id,

                    x.UserId,

                    x.ProjectId,

                    ProjectName =
                        x.Project.Name,

                    x.WeekStart,
                    x.WeekEnd,

                    x.Status,

                    x.TasksPlannedNextWeek,

                    x.Blockers,
                    x.KeyBlocker,

                    x.Achievements,
                    x.KeyAchievement,

                    x.DevelopmentHours,
                    x.TestingHours,
                    x.MeetingHours,
                    x.DocumentationHours,

                    x.Notes,

                    x.SubmittedAt,

                    x.LastReviewedAt,

                    x.LatestReviewComment,

                    x.CreatedAt,

                    x.UpdatedAt,

                    Tasks = x.Tasks.Select(t => new
                    {
                        t.Id,

                        t.TaskName,

                        t.Priority,

                        t.PlannedPercent,

                        t.ActualPercent,

                        t.Status,

                        t.PlannedHours,

                        t.SpentHours,

                        t.Deliverable
                    }).ToList()
                })

                .FirstOrDefaultAsync();

            if (report == null)
            {
                return NotFound(new
                {
                    message = "Report not found."
                });
            }

            return Ok(report);
        }


        // ============================================================
        // TEAM MEMBER - UPDATE REPORT
        // PUT: api/Report/{id}
        // ============================================================

        [HttpPut("{id:int}")]
        [Authorize(Roles = "TeamMember")]
        public async Task<IActionResult> UpdateReport(
            int id,
            [FromBody] UpdateReportRequest request)
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            int userId =
                int.Parse(userIdClaim);

            var report = await _context.Reports
                .Include(r => r.Tasks)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (report == null)
            {
                return NotFound(new
                {
                    message = "Report not found."
                });
            }

            if (report.UserId != userId)
            {
                return Forbid();
            }

            if (report.Status != "Draft" &&
                report.Status != "Needs Correction")
            {
                return BadRequest(new
                {
                    message =
                        "Only Draft or Needs Correction reports can be edited."
                });
            }

            if (request.WeekEnd < request.WeekStart)
            {
                return BadRequest(new
                {
                    message =
                        "Week end date cannot be before week start date."
                });
            }

            var projectExists = await _context.Projects
                .AnyAsync(p => p.Id == request.ProjectId);

            if (!projectExists)
            {
                return BadRequest(new
                {
                    message = "Project not found."
                });
            }

            report.ProjectId =
                request.ProjectId;

            report.WeekStart =
                request.WeekStart;

            report.WeekEnd =
                request.WeekEnd;

            report.TasksPlannedNextWeek =
                request.TasksPlannedNextWeek;

            report.Blockers =
                request.Blockers;

            report.KeyBlocker =
                request.KeyBlocker;

            report.Achievements =
                request.Achievements;

            report.KeyAchievement =
                request.KeyAchievement;

            report.DevelopmentHours =
                request.DevelopmentHours;

            report.TestingHours =
                request.TestingHours;

            report.MeetingHours =
                request.MeetingHours;

            report.DocumentationHours =
                request.DocumentationHours;

            report.Notes =
                request.Notes;


            // --------------------------------------------------------
            // Remove old tasks
            // --------------------------------------------------------

            _context.ReportTasks
                .RemoveRange(report.Tasks);


            // --------------------------------------------------------
            // Add updated tasks
            // --------------------------------------------------------

            foreach (var taskRequest in request.Tasks)
            {
                var task = new ReportTask
                {
                    ReportId =
                        report.Id,

                    TaskName =
                        taskRequest.TaskName,

                    Priority =
                        taskRequest.Priority,

                    PlannedPercent =
                        taskRequest.PlannedPercent,

                    ActualPercent =
                        taskRequest.ActualPercent,

                    Status =
                        taskRequest.Status,

                    PlannedHours =
                        taskRequest.PlannedHours,

                    SpentHours =
                        taskRequest.SpentHours,

                    Deliverable =
                        taskRequest.Deliverable
                };

                report.Tasks.Add(task);
            }

            report.UpdatedAt =
                DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message =
                    "Report updated successfully.",

                reportId =
                    report.Id,

                status =
                    report.Status
            });
        }


        // ============================================================
        // TEAM MEMBER - SUBMIT REPORT
        // POST: api/Report/{id}/submit
        // ============================================================

        [HttpPost("{id:int}/submit")]
        [Authorize(Roles = "TeamMember")]
        public async Task<IActionResult> SubmitReport(int id)
        {
            var userIdClaim = User.FindFirst(
                ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            int userId =
                int.Parse(userIdClaim.Value);

            var report = await _context.Reports
                .Include(r => r.Tasks)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (report == null)
            {
                return NotFound(new
                {
                    message =
                        "Report not found."
                });
            }

            if (report.UserId != userId)
            {
                return Forbid();
            }

            if (report.Status != "Draft" &&
                report.Status != "Needs Correction")
            {
                return BadRequest(new
                {
                    message =
                        "Only Draft or Needs Correction reports can be submitted."
                });
            }

            if (report.WeekEnd < report.WeekStart)
            {
                return BadRequest(new
                {
                    message =
                        "Week end date cannot be before week start date."
                });
            }

            if (report.ProjectId <= 0)
            {
                return BadRequest(new
                {
                    message =
                        "A project must be selected."
                });
            }

            if (!report.Tasks.Any())
            {
                return BadRequest(new
                {
                    message =
                        "At least one task is required before submitting the report."
                });
            }


            // --------------------------------------------------------
            // Change status
            // --------------------------------------------------------

            report.Status =
                "Submitted";

            report.SubmittedAt =
                DateTime.UtcNow;

            report.UpdatedAt =
                DateTime.UtcNow;


            // --------------------------------------------------------
            // Find latest version
            // --------------------------------------------------------

            var lastVersionNumber =
                await _context.ReportVersions

                    .Where(v =>
                        v.ReportId == report.Id)

                    .Select(v =>
                        (int?)v.VersionNumber)

                    .MaxAsync() ?? 0;

            var nextVersionNumber =
                lastVersionNumber + 1;


            // --------------------------------------------------------
            // Create report snapshot
            // --------------------------------------------------------

            var snapshot = new
            {
                report.Id,

                report.UserId,

                report.ProjectId,

                report.WeekStart,

                report.WeekEnd,

                report.Status,

                report.TasksPlannedNextWeek,

                report.Blockers,

                report.KeyBlocker,

                report.Achievements,

                report.KeyAchievement,

                report.DevelopmentHours,

                report.TestingHours,

                report.MeetingHours,

                report.DocumentationHours,

                report.Notes,

                Tasks = report.Tasks.Select(t => new
                {
                    t.Id,

                    t.TaskName,

                    t.Priority,

                    t.PlannedPercent,

                    t.ActualPercent,

                    t.Status,

                    t.PlannedHours,

                    t.SpentHours,

                    t.Deliverable
                }).ToList()
            };


            var snapshotJson =
                JsonSerializer.Serialize(snapshot);


            // --------------------------------------------------------
            // Create version
            // --------------------------------------------------------

            var version = new ReportVersion
            {
                ReportId =
                    report.Id,

                VersionNumber =
                    nextVersionNumber,

                SubmissionTimestamp =
                    DateTime.UtcNow,

                SnapshotJson =
                    snapshotJson,

                SubmittedBy =
                    userId.ToString()
            };

            _context.ReportVersions
                .Add(version);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message =
                    "Weekly report submitted successfully.",

                reportId =
                    report.Id,

                status =
                    report.Status,

                submittedAt =
                    report.SubmittedAt
            });
        }


        // ============================================================
        // TEAM MEMBER - GET REPORT VERSIONS
        // GET: api/Report/{id}/versions
        // ============================================================

        [HttpGet("{id:int}/versions")]
        [Authorize(Roles = "TeamMember")]
        public async Task<IActionResult> GetReportVersions(int id)
        {
            var userIdClaim = User.FindFirst(
                ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            int userId =
                int.Parse(userIdClaim.Value);

            var reportExists =
                await _context.Reports

                    .AnyAsync(r =>
                        r.Id == id &&
                        r.UserId == userId);

            if (!reportExists)
            {
                return NotFound(new
                {
                    message =
                        "Report not found."
                });
            }

            var versions =
                await _context.ReportVersions

                    .Where(v =>
                        v.ReportId == id)

                    .OrderByDescending(v =>
                        v.VersionNumber)

                    .Select(v => new
                    {
                        v.Id,

                        v.ReportId,

                        v.VersionNumber,

                        v.SubmissionTimestamp,

                        v.SubmittedBy,

                        v.SnapshotJson
                    })

                    .ToListAsync();

            return Ok(versions);
        }

        [HttpGet("manager")]
        [Authorize(Roles = "Manager,Admin")]
        public async Task<IActionResult> GetAllReportsForManager()
        {
            var reports = await _context.Reports
                .Include(r => r.User)
                .Include(r => r.Project)
                .Include(r => r.Tasks)
                .OrderByDescending(r => r.WeekStart)
                .Select(r => new
                {
                    r.Id,
                    r.UserId,

                    UserName = r.User.Name,
                    UserEmail = r.User.Email,

                    r.ProjectId,
                    ProjectName = r.Project.Name,

                    r.WeekStart,
                    r.WeekEnd,
                    r.Status,

                    r.TasksPlannedNextWeek,
                    r.Blockers,
                    r.KeyBlocker,
                    r.Achievements,
                    r.KeyAchievement,

                    r.DevelopmentHours,
                    r.TestingHours,
                    r.MeetingHours,
                    r.DocumentationHours,

                    r.Notes,
                    r.SubmittedAt,
                    r.LastReviewedAt,
                    r.LatestReviewComment,

                    r.CreatedAt,
                    r.UpdatedAt,

                    Tasks = r.Tasks.Select(t => new
                    {
                        t.Id,
                        t.TaskName,
                        t.Priority,
                        t.PlannedPercent,
                        t.ActualPercent,
                        t.Status,
                        t.PlannedHours,
                        t.SpentHours,
                        t.Deliverable
                    }).ToList()
                })
                .ToListAsync();

            return Ok(reports);
        }

    }
}