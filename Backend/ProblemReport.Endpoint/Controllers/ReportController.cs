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
<<<<<<< HEAD
        this.ctx = ctx;
    }

    [HttpGet]
    public IEnumerable<Report> Get()
    {
         return ctx.Set<Report>().ToList();
=======
        var report = new Report
        {
            SubSystem = SubSystem.PlayGround,
            Text = "A hinta eltört a játszótéren.",
            ImageData = null, // vagy null, ha nincs kép
            ImageType = "jpeg",
            Date = DateTime.Now
        };
        return report;
>>>>>>> 9b3f37d59ad81c492c0a52436050f5d5951834e7
    }
}
