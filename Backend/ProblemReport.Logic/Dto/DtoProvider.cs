using System;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ProblemReport.Data.Helper;
using ProblemReport.Entities.Dto.Report;
using ProblemReport.Entities.Entity;

namespace ProblemReport.Logic.Dto;

public class DtoProvider
{
    public Mapper Mapper { get; }
    UserManager<AppUser>? userManager;

    public DtoProvider(UserManager<AppUser> userManager)
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
                    var user = userManager.Users.FirstOrDefault(u => u.Id == src.CreatorId);
                    dest.Name = user == null ? "Unknown User" : $"{user.FamilyName} {user.GivenName}";
                    dest.Email = user?.Email ?? "Unknown Email";
                });
        }));
    }
}
