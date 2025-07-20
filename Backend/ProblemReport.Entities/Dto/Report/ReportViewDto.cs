using System;

namespace ProblemReport.Entities.Dto.Report;

public class ReportViewDto
{
    public string Id { get; set; } = string.Empty;
    public string SubSystem { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string ImagePath { get; set; } = string.Empty;
    public string ImageType { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Open, Closed
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
