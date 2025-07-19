using Microsoft.AspNetCore.Mvc;
using ProblemReport.Data;
using ProblemReport.Entities.Entity;

namespace ProblemReport.Endpoint.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportController : ControllerBase
{
    Repository<Report> repo;

    public ReportController(Repository<Report> repo)
    {
        this.repo = repo;
    }

    [HttpGet]
    public IEnumerable<Report> Get()
    {
        return repo.GetAll().ToList();
    }

    [HttpPost]
    public async Task Post(Report report)
    {
        await repo.CreateAsync(report);
    }
    
    [HttpDelete("{id}")]
    public async Task Delete(string id)
    {
        await repo.DeleteByIdAsync(id);
    }        
}
