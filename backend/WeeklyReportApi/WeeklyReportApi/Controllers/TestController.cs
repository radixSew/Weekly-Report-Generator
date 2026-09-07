using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WeeklyReportApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet("public")]
        public IActionResult Public()
        {
            return Ok(new
            {
                message = "This endpoint is public."
            });
        }

        [Authorize]
        [HttpGet("protected")]
        public IActionResult Protected()
        {
            return Ok(new
            {
                message = "You are authenticated!",
                name = User.Identity?.Name,
                role = User.FindFirst(
                    System.Security.Claims.ClaimTypes.Role
                )?.Value
            });
        }

        [Authorize(Roles = "Manager")]
        [HttpGet("manager")]
        public IActionResult ManagerOnly()
        {
            return Ok(new
            {
                message = "You are a Manager!",
                name = User.Identity?.Name,
                role = User.FindFirst(
                    System.Security.Claims.ClaimTypes.Role
                )?.Value
            });
        }
    }
}