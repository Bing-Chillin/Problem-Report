using System;

namespace ProblemReport.Entities.Dto;

public class ReportCreateUpdateDto
{
    public string Subsystem { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
}
