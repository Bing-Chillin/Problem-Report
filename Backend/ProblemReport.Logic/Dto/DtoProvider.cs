using System;
using AutoMapper;
using ProblemReport.Entities.Dto;
using ProblemReport.Entities.Entity;

namespace ProblemReport.Logic.Dto;

public class DtoProvider
{
    public Mapper Mapper { get; }

        public DtoProvider()
        {
            Mapper = new Mapper(new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<ReportCreateUpdateDto, Report>()
                    .AfterMap((src, dest) => dest.SubSystem = Enum.TryParse<SubSystem>(src.SubSystem, out var subSystem) ? subSystem : SubSystem.None);
                cfg.CreateMap<Report, ReportViewDto>()
                    .AfterMap((src, dest) =>
                    {
                        dest.SubSystem = src.SubSystem.ToString();
                        dest.Date = src.Date.ToString("yyyy-MM-dd HH:mm:ss");
                    });
            }));
        }
}
