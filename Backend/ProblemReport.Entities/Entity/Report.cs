using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ProblemReport.Entities.Helper;

namespace ProblemReport.Entities.Entity;

public enum SubSystem
{
    None = 0,
    Cemetery = 1,
    CityMaintenance = 2,
    TaskManagement = 3,
    ProblemReport = 4,
}

public class Report : IIdentity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public SubSystem SubSystem { get; set; } = SubSystem.None;
    [StringLength(250)]
    public string Text { get; set; } = string.Empty;
    [StringLength(250)]
    public string? ImagePath { get; set; } = "../Assets/UploadedImages/";
    [StringLength(250)]
    public string? ImageType { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.Now;
    public string Status { get; set; } = "Open"; //Open, Closed
}
