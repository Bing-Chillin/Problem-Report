using Microsoft.AspNetCore.Mvc;
using ProblemReport.Entities.Entity;

namespace ProblemReport.Endpoint.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportController : ControllerBase
{
    [HttpGet]
    public Report Get()
    {
        var report = new Report
        {
            SubSystem = SubSystem.PlayGround,
            Text = "A hinta eltört a játszótéren.",
            ImageData = null,
            ImageType = "jpeg",
            Date = DateTime.Now
        };
        return report;
    }
}
