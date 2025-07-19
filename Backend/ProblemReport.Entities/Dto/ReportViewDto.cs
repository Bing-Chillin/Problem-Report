using System;

namespace ProblemReport.Entities.Dto;

public class ReportViewDto
{
    public string Id { get; set; } = string.Empty;
    public string SubSystem { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string ImagePath { get; set; } = string.Empty;
    public string ImageType { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
}
