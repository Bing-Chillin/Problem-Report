using Microsoft.AspNetCore.Mvc;
using ProblemReport.Data;
using ProblemReport.Entities.Entity;

namespace ProblemReport.Endpoint.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportController : ControllerBase
{
    ProblemReportContext ctx;

    public ReportController(ProblemReportContext ctx)
    {
        this.ctx = ctx;
    }

    [HttpGet]
    public IEnumerable<Report> Get()
    {
         return ctx.Set<Report>().ToList();
    }
}
