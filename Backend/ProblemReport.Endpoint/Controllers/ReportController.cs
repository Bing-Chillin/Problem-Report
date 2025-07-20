using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProblemReport.Data;
using ProblemReport.Data.Helper;
using ProblemReport.Entities.Dto.Report;
using ProblemReport.Logic;

namespace ProblemReport.Endpoint.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportController : ControllerBase
{
    ReportLogic logic;
    UserManager<AppUser> userManager;

    public ReportController(ReportLogic logic, UserManager<AppUser> userManager)
    {
        this.logic = logic;
        this.userManager = userManager;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Developer")]
    public IEnumerable<ReportViewDto> Get()
    {
        return logic.Read();
    }

    [HttpPost]
    [Authorize]
    public async Task Post(ReportCreateUpdateDto report)
    {
        var user = await userManager.GetUserAsync(User);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        await logic.Create(report, user.Id);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Developer")]
    public async Task Update(string id, [FromBody] ReportCreateUpdateDto dto)
    {
        await logic.Update(id, dto);
    }


    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task Delete(string id)
    {
        await logic.Delete(id);
    }
}
