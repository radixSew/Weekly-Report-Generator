using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WeeklyReportApi.Data;
using WeeklyReportApi.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace WeeklyReportApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(
            AppDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterRequest request)
        {
            var existingUser = _context.Users
                .FirstOrDefault(x => x.Email == request.Email);

            if (existingUser != null)
            {
                return BadRequest(new
                {
                    message = "Email already registered."
                });
            }

            if (request.Role != "TeamMember" &&
                request.Role != "Manager" &&
                request.Role != "Admin")
            {
                return BadRequest(new
                {
                    message = "Invalid role."
                });
            }

            var user = new Models.User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = request.Role,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Registration successful.",
                userId = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role
            });
        }
        [HttpGet("team-members")]
        [Authorize(Roles = "TeamMember,Manager,Admin")]
        public IActionResult GetTeamMembers()
        {
            var teamMembers = _context.Users
                .Where(x => x.Role == "TeamMember")
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Email,
                    x.Role,
                    x.CreatedAt
                })
                .ToList();

            return Ok(teamMembers);
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var user = _context.Users
                .FirstOrDefault(x => x.Email == request.Email);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });
            }

            var passwordValid = BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash
            );

            if (!passwordValid)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });
            }

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                message = "Login successful.",
                token = token,
                userId = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role
            });
        }

        private string GenerateJwtToken(Models.User user)
        {
            var jwtKey = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("JWT Key is missing.");

            var jwtIssuer = _configuration["Jwt:Issuer"]
                ?? throw new InvalidOperationException("JWT Issuer is missing.");

            var jwtAudience = _configuration["Jwt:Audience"]
                ?? throw new InvalidOperationException("JWT Audience is missing.");

            var duration = int.Parse(
                _configuration["Jwt:DurationInMinutes"] ?? "60"
            );

            var claims = new[]
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.Id.ToString()
                ),

                new Claim(
                    ClaimTypes.Name,
                    user.Name
                ),

                new Claim(
                    ClaimTypes.Email,
                    user.Email
                ),

                new Claim(
                    ClaimTypes.Role,
                    user.Role
                )
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(duration),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}