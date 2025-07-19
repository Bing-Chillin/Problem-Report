using System;
using Microsoft.EntityFrameworkCore;
using ProblemReport.Entities.Entity;

namespace ProblemReport.Data;

public class ProblemReportContext : DbContext
{
    public DbSet<Report> Reports { get; set; }

    public ProblemReportContext(DbContextOptions<ProblemReportContext> options) : base(options)
    {
        Database.EnsureCreated();
    }
}