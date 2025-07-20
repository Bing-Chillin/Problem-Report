using AutoMapper;
using ProblemReport.Data;
using ProblemReport.Entities.Dto.Report;
using ProblemReport.Entities.Entity;
using ProblemReport.Logic.Dto;

namespace ProblemReport.Logic;

public class ReportLogic
{
    public Repository<Report> repository;
    public Mapper mapper;

    public ReportLogic(Repository<Report> repository, DtoProvider provider)
    {
        this.repository = repository;
        this.mapper = provider.Mapper;
    }

    public async Task Create(ReportCreateUpdateDto dto)
    {
        var report = mapper.Map<Report>(dto);
        if (report is null)
        {
            throw new ArgumentNullException(nameof(dto), "Report is not given.");
        }
        else
        {
            await repository.CreateAsync(report);
        }
    }

    public IEnumerable<ReportViewDto> Read()
    {
        return repository.GetAll().Select(t => mapper.Map<ReportViewDto>(t));
    }
    
    public async Task Update(string id, ReportCreateUpdateDto dto)
        {
            var reportToUpdate = repository.FindById(id);
            if (reportToUpdate != null)
            {
                mapper.Map(dto, reportToUpdate);
                await repository.UpdateAsync(reportToUpdate);
            }
        }
    
    public async Task Delete(string id)
    {
        await repository.DeleteByIdAsync(id);
    }
}
