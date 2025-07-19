using Microsoft.AspNetCore.Mvc;
using ProblemReport.Data;
using ProblemReport.Entities.Dto;
using ProblemReport.Entities.Entity;
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
    public IEnumerable<ReportViewDto> Get()
    {
        return logic.Read();
    }

    [HttpPost]
    public async Task Post(ReportCreateUpdateDto report)
    {
        await logic.Create(report);
    }
    
    [HttpDelete("{id}")]
    public async Task Delete(string id)
    {
        await logic.Delete(id);
    }        
}
