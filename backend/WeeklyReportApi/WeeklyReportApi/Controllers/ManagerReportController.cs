using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WeeklyReportApi.Data;
using WeeklyReportApi.DTOs;
using WeeklyReportApi.Models;

namespace WeeklyReportApi.Controllers
{
    [Route("api/manager/reports")]
    [ApiController]
    [Authorize(Roles = "Manager,Admin")]
    public class ManagerReportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ManagerReportController(AppDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // GET: api/manager/reports/submitted
        // Get all submitted reports
        // =========================================================
        [HttpGet("submitted")]
        public async Task<IActionResult> GetSubmittedReports()
        {
            var reports = await _context.Reports
                .Where(r => r.Status == "Submitted")
                .Include(r => r.User)
                .Include(r => r.Project)
                .Include(r => r.Tasks)
                .OrderByDescending(r => r.SubmittedAt)
                .Select(r => new
                {
                    r.Id,

                    UserId = r.UserId,
                    UserName = r.User.Name,
                    UserEmail = r.User.Email,

                    ProjectId = r.ProjectId,
                    ProjectName = r.Project.Name,

                    r.WeekStart,
                    r.WeekEnd,
                    r.Status,

                    r.SubmittedAt,

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


        // =========================================================
        // GET: api/manager/reports/{id}
        // Get one report for manager review
        // =========================================================
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetReportForReview(int id)
        {
            var report = await _context.Reports
                .Where(r => r.Id == id)
                .Include(r => r.User)
                .Include(r => r.Project)
                .Include(r => r.Tasks)
                .Select(r => new
                {
                    r.Id,

                    UserId = r.UserId,
                    UserName = r.User.Name,
                    UserEmail = r.User.Email,

                    ProjectId = r.ProjectId,
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
                    r.LastReviewerId,
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


        // =========================================================
        // POST: api/manager/reports/{id}/approve
        // Approve a submitted report
        // =========================================================
        [HttpPost("{id:int}/approve")]
        public async Task<IActionResult> ApproveReport(
            int id,
            [FromBody] ReviewReportRequest request)
        {
            var reviewerIdClaim = User.FindFirst(
                ClaimTypes.NameIdentifier);

            if (reviewerIdClaim == null)
            {
                return Unauthorized();
            }

            int reviewerId = int.Parse(reviewerIdClaim.Value);

            var report = await _context.Reports
                .FirstOrDefaultAsync(r => r.Id == id);

            if (report == null)
            {
                return NotFound(new
                {
                    message = "Report not found."
                });
            }

            if (report.Status != "Submitted")
            {
                return BadRequest(new
                {
                    message = "Only submitted reports can be approved."
                });
            }

            // Update report
            report.Status = "Approved";
            report.LastReviewerId = reviewerId;
            report.LastReviewedAt = DateTime.UtcNow;
            report.LatestReviewComment = request.Comment ?? string.Empty;
            report.UpdatedAt = DateTime.UtcNow;

            // Create review history
            var review = new ReviewHistory
            {
                ReportId = report.Id,
                ReviewerId = reviewerId,
                Action = "Approved",
                Comment = request.Comment ?? string.Empty,
                CreatedAt = DateTime.UtcNow
            };

            _context.ReviewHistories.Add(review);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Report approved successfully.",
                reportId = report.Id,
                status = report.Status,
                reviewedAt = report.LastReviewedAt
            });
        }


        // =========================================================
        // POST: api/manager/reports/{id}/request-changes
        // Send report back to team member
        // =========================================================
        [HttpPost("{id:int}/request-changes")]
        public async Task<IActionResult> RequestChanges(
            int id,
            [FromBody] ReviewReportRequest request)
        {
            var reviewerIdClaim = User.FindFirst(
                ClaimTypes.NameIdentifier);

            if (reviewerIdClaim == null)
            {
                return Unauthorized();
            }

            int reviewerId = int.Parse(reviewerIdClaim.Value);

            // Comment is required when requesting changes
            if (string.IsNullOrWhiteSpace(request.Comment))
            {
                return BadRequest(new
                {
                    message = "A comment is required when requesting changes."
                });
            }

            var report = await _context.Reports
                .FirstOrDefaultAsync(r => r.Id == id);

            if (report == null)
            {
                return NotFound(new
                {
                    message = "Report not found."
                });
            }

            if (report.Status != "Submitted")
            {
                return BadRequest(new
                {
                    message = "Only submitted reports can be sent back for correction."
                });
            }

            // Update report
            report.Status = "Needs Correction";
            report.LastReviewerId = reviewerId;
            report.LastReviewedAt = DateTime.UtcNow;
            report.LatestReviewComment = request.Comment;
            report.UpdatedAt = DateTime.UtcNow;

            // Create review history
            var review = new ReviewHistory
            {
                ReportId = report.Id,
                ReviewerId = reviewerId,
                Action = "Changes Requested",
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.ReviewHistories.Add(review);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Changes requested successfully.",
                reportId = report.Id,
                status = report.Status,
                reviewedAt = report.LastReviewedAt,
                comment = report.LatestReviewComment
            });
        }

        // GET: api/manager/reports/{id}/versions
        [HttpGet("{id:int}/versions")]
        public async Task<IActionResult> GetReportVersions(int id)
        {
            var reportExists = await _context.Reports
                .AnyAsync(r => r.Id == id);

            if (!reportExists)
            {
                return NotFound(new
                {
                    message = "Report not found."
                });
            }

            var versions = await _context.ReportVersions
                .Where(v => v.ReportId == id)
                .OrderByDescending(v => v.VersionNumber)
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

        // GET: api/manager/reports/{id}/review-history
        [HttpGet("{id:int}/review-history")]
        public async Task<IActionResult> GetReviewHistory(int id)
        {
            var reportExists = await _context.Reports
                .AnyAsync(r => r.Id == id);

            if (!reportExists)
            {
                return NotFound(new
                {
                    message = "Report not found."
                });
            }

            var history = await _context.ReviewHistories
                .Where(h => h.ReportId == id)
                .Include(h => h.Reviewer)
                .OrderByDescending(h => h.CreatedAt)
                .Select(h => new
                {
                    h.Id,
                    h.ReportId,
                    h.ReviewerId,
                    ReviewerName = h.Reviewer.Name,
                    ReviewerEmail = h.Reviewer.Email,
                    h.Action,
                    h.Comment,
                    h.CreatedAt
                })
                .ToListAsync();

            return Ok(history);
        }
    }
}