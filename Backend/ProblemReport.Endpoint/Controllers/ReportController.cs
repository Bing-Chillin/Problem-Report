using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProblemReport.Data;
using ProblemReport.Entities.Dto.Report;
using ProblemReport.Logic;

namespace ProblemReport.Endpoint.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportController : ControllerBase
{
    ReportLogic logic;

    public ReportController(ReportLogic logic)
    {
        this.logic = logic;
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
        await logic.Create(report);
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
