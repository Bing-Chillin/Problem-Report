using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProblemReport.Entities.Entity;

namespace ProblemReport.Data;

public class ProblemReportContext : IdentityDbContext
{
    public DbSet<Report> Reports { get; set; }

    public ProblemReportContext(DbContextOptions<ProblemReportContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
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
            },

            new Report
            {
                SubSystem = SubSystem.ProblemReport,
                Text = "Nem tölti be azdsdsds oldalt.",
                ImagePath = "../Assets/UploadedImages/timeout.jpg",
                ImageType = "jpg",
                Date = DateTime.Now.AddDays(-3)
            }

        );
    }
}
