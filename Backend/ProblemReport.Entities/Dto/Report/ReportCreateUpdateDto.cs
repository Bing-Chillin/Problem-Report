using System;

namespace ProblemReport.Entities.Dto.Report;

public class ReportCreateUpdateDto
{
    public string SubSystem { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string Status { get; set; } = "Open"; // Open/Closed, not required to give when creating a report
}
