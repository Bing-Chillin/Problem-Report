using System;
using Microsoft.EntityFrameworkCore;
using ProblemReport.Entities.Entity;

namespace ProblemReport.Data;

public interface IProblemReportContext
{
    DbSet<Report>? Reports { get; set; }
}

public class ProblemReportContext : DbContext, IProblemReportContext
{
    public DbSet<Report>? Reports { get; set; }

    public ProblemReportContext(DbContextOptions<ProblemReportContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Report>().HasData(
            new Report
            {
                SubSystem = SubSystem.CityMaintenance,
                Text = "Nem talható az oldal.",
                ImagePath = "../Assets/UploadedImages/not_found.png",
                ImageType = "png",
                Date = DateTime.Now
            },

            new Report
            {
                SubSystem = SubSystem.TaskManagement,
                Text = "A szerver hibát jelez",
                ImagePath = "../Assets/UploadedImages/server_error.jpg",
                ImageType = "jpg",
                Date = DateTime.Now.AddDays(-1)
            },

            new Report
            {
                SubSystem = SubSystem.ProblemReport,
                Text = "Nem tölti be az oldalt.",
                ImagePath = "../Assets/UploadedImages/timeout.jpg",
                ImageType = "jpg",
                Date = DateTime.Now.AddDays(-2)
            }
        );
    }
}