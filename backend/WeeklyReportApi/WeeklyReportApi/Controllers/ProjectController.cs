using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeeklyReportApi.Data;
using WeeklyReportApi.DTOs;
using WeeklyReportApi.Models;

namespace WeeklyReportApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectController(AppDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // GET ALL PROJECTS
        // Team Member, Manager and Admin can view projects
        // =========================================================

        [HttpGet]
        [Authorize(Roles = "TeamMember,Manager,Admin")]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _context.Projects
                .OrderBy(x => x.Name)
                .ToListAsync();

            return Ok(projects);
        }


        // =========================================================
        // GET PROJECT BY ID
        // =========================================================

        [HttpGet("{id}")]
        [Authorize(Roles = "TeamMember,Manager,Admin")]
        public async Task<IActionResult> GetProject(int id)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(x => x.Id == id);

            if (project == null)
            {
                return NotFound(new
                {
                    message = "Project not found."
                });
            }

            return Ok(project);
        }


        // =========================================================
        // CREATE PROJECT
        // Manager and Admin only
        // =========================================================

        [HttpPost]
        [Authorize(Roles = "Manager,Admin")]
        public async Task<IActionResult> CreateProject(
            [FromBody] CreateProjectRequest request)
        {
            // Validate project name
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new
                {
                    message = "Project name is required."
                });
            }

            // Remove unnecessary spaces
            request.Name = request.Name.Trim();

            // Check duplicate project
            var existingProject = await _context.Projects
                .FirstOrDefaultAsync(x => x.Name == request.Name);

            if (existingProject != null)
            {
                return BadRequest(new
                {
                    message = "Project already exists."
                });
            }

            // Create project
            var project = new Project
            {
                Name = request.Name,
                Description = request.Description?.Trim()
            };

            _context.Projects.Add(project);

            await _context.SaveChangesAsync();

            return Ok(project);
        }


        // =========================================================
        // UPDATE PROJECT
        // Manager and Admin only
        // =========================================================

        [HttpPut("{id}")]
        [Authorize(Roles = "Manager,Admin")]
        public async Task<IActionResult> UpdateProject(
            int id,
            [FromBody] CreateProjectRequest request)
        {
            // Validate project name
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new
                {
                    message = "Project name is required."
                });
            }

            request.Name = request.Name.Trim();

            // Find project
            var project = await _context.Projects
                .FirstOrDefaultAsync(x => x.Id == id);

            if (project == null)
            {
                return NotFound(new
                {
                    message = "Project not found."
                });
            }

            // Check duplicate name
            var existingProject = await _context.Projects
                .FirstOrDefaultAsync(x =>
                    x.Name == request.Name &&
                    x.Id != id);

            if (existingProject != null)
            {
                return BadRequest(new
                {
                    message = "Another project with this name already exists."
                });
            }

            // Update
            project.Name = request.Name;
            project.Description = request.Description?.Trim();

            await _context.SaveChangesAsync();

            return Ok(project);
        }


        // =========================================================
        // DELETE PROJECT
        // Manager and Admin only
        // =========================================================

        [HttpDelete("{id}")]
        [Authorize(Roles = "Manager,Admin")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            // Find project
            var project = await _context.Projects
                .FirstOrDefaultAsync(x => x.Id == id);

            if (project == null)
            {
                return NotFound(new
                {
                    message = "Project not found."
                });
            }

            // Check whether project is being used by reports
            var hasReports = await _context.Reports
                .AnyAsync(x => x.ProjectId == id);

            if (hasReports)
            {
                return BadRequest(new
                {
                    message = "This project cannot be deleted because it is already used by one or more reports."
                });
            }

            _context.Projects.Remove(project);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Project deleted successfully."
            });
        }
    }
}