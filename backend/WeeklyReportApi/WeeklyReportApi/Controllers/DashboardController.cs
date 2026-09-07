using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeeklyReportApi.Data;

namespace WeeklyReportApi.Controllers
{
    [Route("api/manager/dashboard")]
    [ApiController]
    [Authorize(Roles = "Manager,Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/manager/dashboard/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var totalReports = await _context.Reports.CountAsync();

            var draftReports = await _context.Reports
                .CountAsync(r => r.Status == "Draft");

            var submittedReports = await _context.Reports
                .CountAsync(r => r.Status == "Submitted");

            var correctionReports = await _context.Reports
                .CountAsync(r => r.Status == "Needs Correction");

            var approvedReports = await _context.Reports
                .CountAsync(r => r.Status == "Approved");

            var compliancePercentage = totalReports == 0
                ? 0
                : Math.Round(
                    (decimal)approvedReports / totalReports * 100,
                    2);

            return Ok(new
            {
                totalReports,
                draftReports,
                submittedReports,
                correctionReports,
                approvedReports,
                compliancePercentage
            });
        }

        // GET: api/manager/dashboard/status
        [HttpGet("status")]
        public async Task<IActionResult> GetReportsByStatus()
        {
            var result = await _context.Reports
                .GroupBy(r => r.Status)
                .Select(g => new
                {
                    status = g.Key,
                    count = g.Count()
                })
                .OrderBy(x => x.status)
                .ToListAsync();

            return Ok(result);
        }
        // GET: api/manager/dashboard/projects
        [HttpGet("projects")]
        public async Task<IActionResult> GetReportsByProject()
        {
            var result = await _context.Reports
                .Include(r => r.Project)
                .GroupBy(r => new
                {
                    r.ProjectId,
                    ProjectName = r.Project.Name
                })
                .Select(g => new
                {
                    projectId = g.Key.ProjectId,
                    projectName = g.Key.ProjectName,
                    count = g.Count()
                })
                .OrderByDescending(x => x.count)
                .ToListAsync();

            return Ok(result);
        }
        // GET: api/manager/dashboard/team-members
        [HttpGet("team-members")]
        public async Task<IActionResult> GetTeamMemberReportStats()
        {
            var result = await _context.Users
                .Where(u => u.Role == "TeamMember")
                .Select(u => new
                {
                    userId = u.Id,
                    userName = u.Name,

                    total = u.Reports.Count(),

                    draft = u.Reports.Count(r => r.Status == "Draft"),

                    submitted = u.Reports.Count(r => r.Status == "Submitted"),

                    needsCorrection = u.Reports.Count(
                        r => r.Status == "Needs Correction"),

                    approved = u.Reports.Count(
                        r => r.Status == "Approved")
                })
                .OrderBy(x => x.userName)
                .ToListAsync();

            return Ok(result);
        }
        // GET: api/manager/dashboard/weekly-compliance
        [HttpGet("weekly-compliance")]
        public async Task<IActionResult> GetWeeklyCompliance()
        {
            var result = await _context.Reports
                .GroupBy(r => new
                {
                    r.WeekStart,
                    r.WeekEnd
                })
                .Select(g => new
                {
                    weekStart = g.Key.WeekStart,
                    weekEnd = g.Key.WeekEnd,
                    totalReports = g.Count(),
                    submittedReports = g.Count(
                        r => r.Status == "Submitted"),
                    approvedReports = g.Count(
                        r => r.Status == "Approved"),
                    needsCorrectionReports = g.Count(
                        r => r.Status == "Needs Correction"),
                    draftReports = g.Count(
                        r => r.Status == "Draft")
                })
                .OrderByDescending(x => x.weekStart)
                .ToListAsync();

            return Ok(result);
        }

    }
}